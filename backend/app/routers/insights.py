"""
Insights Router
Handles health insights and explanation endpoints
"""

from fastapi import APIRouter, HTTPException
from services.openai_service import openai_service
from services.supabase_service import supabase_service
from services.analysis_service import analysis_service
from models.schemas import (
    ExplanationRequest, ExplanationResponse,
    AlertRequest, AlertResponse, TestStatus, Severity
)

router = APIRouter()


@router.post("/explain", response_model=ExplanationResponse)
async def get_explanation(request: ExplanationRequest):
    """
    Get a patient-friendly explanation for a specific test result
    """
    try:
        explanation = await openai_service.generate_explanation(
            request.test_name,
            request.value,
            request.unit or "",
            request.status.value
        )
        
        return ExplanationResponse(
            test_name=request.test_name,
            explanation=explanation,
            recommendations=None
        )
        
    except Exception as e:
        print(f"Error generating explanation: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/alert", response_model=AlertResponse)
async def get_alert(request: AlertRequest):
    """
    Get a health alert message for a specific test result
    """
    try:
        alert_message = await openai_service.generate_alert(
            request.test_name,
            request.status.value,
            request.severity.value
        )
        
        return AlertResponse(
            test_name=request.test_name,
            alert_message=alert_message
        )
        
    except Exception as e:
        print(f"Error generating alert: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{report_id}")
async def get_report_insights(report_id: str):
    """
    Get comprehensive insights for a report
    """
    try:
        # Get test results
        test_results = await supabase_service.get_test_results(report_id)
        
        if not test_results:
            raise HTTPException(status_code=404, detail="Report not found or has no results")
        
        # Calculate statistics
        total = len(test_results)
        normal_count = sum(1 for t in test_results if t.get("status") == "NORMAL")
        abnormal_count = sum(1 for t in test_results if t.get("status") in ["LOW", "HIGH"])
        critical_count = sum(1 for t in test_results if t.get("severity") == "red")
        
        # Get abnormal tests
        abnormal_tests = [t for t in test_results if t.get("status") in ["LOW", "HIGH"]]
        
        # Calculate health score
        health_score = int((normal_count / total) * 100) if total > 0 else 0
        
        return {
            "report_id": report_id,
            "statistics": {
                "total_tests": total,
                "normal_count": normal_count,
                "abnormal_count": abnormal_count,
                "critical_count": critical_count,
                "health_score": health_score
            },
            "abnormal_tests": abnormal_tests,
            "recommendations": [
                "Review any abnormal values with your healthcare provider",
                "Consider scheduling a follow-up appointment if multiple values are abnormal",
                "Maintain a healthy lifestyle with regular exercise and balanced nutrition"
            ] if abnormal_count > 0 else [
                "Your test results look good! Continue maintaining your healthy lifestyle",
                "Schedule regular check-ups to monitor your health"
            ]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting insights: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{report_id}/chart-data")
async def get_chart_data(report_id: str):
    """
    Get data formatted for charts
    """
    try:
        test_results = await supabase_service.get_test_results(report_id)
        
        if not test_results:
            raise HTTPException(status_code=404, detail="Report not found")
        
        # Status distribution for pie/bar chart
        status_counts = {"NORMAL": 0, "LOW": 0, "HIGH": 0, "UNKNOWN": 0}
        for t in test_results:
            status = t.get("status", "UNKNOWN")
            if status in status_counts:
                status_counts[status] += 1
        
        status_distribution = [
            {"name": "Normal", "value": status_counts["NORMAL"], "color": "#10b981"},
            {"name": "Low", "value": status_counts["LOW"], "color": "#f59e0b"},
            {"name": "High", "value": status_counts["HIGH"], "color": "#ef4444"},
            {"name": "Unknown", "value": status_counts["UNKNOWN"], "color": "#6b7280"}
        ]
        
        # Severity distribution
        severity_counts = {"green": 0, "yellow": 0, "red": 0, "gray": 0}
        for t in test_results:
            severity = t.get("severity", "gray")
            if severity in severity_counts:
                severity_counts[severity] += 1
        
        severity_distribution = [
            {"name": "Healthy", "value": severity_counts["green"], "color": "#10b981"},
            {"name": "Borderline", "value": severity_counts["yellow"], "color": "#f59e0b"},
            {"name": "Needs Attention", "value": severity_counts["red"], "color": "#ef4444"},
            {"name": "Unknown", "value": severity_counts["gray"], "color": "#6b7280"}
        ]
        
        return {
            "status_distribution": status_distribution,
            "severity_distribution": severity_distribution,
            "test_results": [
                {
                    "name": t["test_name"][:20],
                    "value": float(t["observed_value"]) if t["observed_value"].replace(".", "").replace("-", "").isdigit() else 0,
                    "status": t.get("status", "UNKNOWN"),
                    "severity": t.get("severity", "gray")
                }
                for t in test_results
            ]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting chart data: {e}")
        raise HTTPException(status_code=500, detail=str(e))
