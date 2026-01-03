"""
Reports Router
Handles PDF upload and report analysis endpoints
"""

import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from typing import Optional
from services.openai_service import openai_service
from services.supabase_service import supabase_service
from services.analysis_service import analysis_service
from models.schemas import (
    ReportUploadResponse, AnalysisResponse, TestStatus, TestResult, ReferenceRange, Severity
)

router = APIRouter()


@router.post("/upload", response_model=AnalysisResponse)
async def upload_and_analyze_report(
    file: UploadFile = File(...),
    user_id: Optional[str] = Form(default=None)
):
    """
    Upload a PDF/image medical report and get AI analysis
    """
    # Validate file type
    allowed_types = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"File type not supported. Allowed types: {', '.join(allowed_types)}"
        )
    
    try:
        # Read file content
        file_bytes = await file.read()
        
        # Generate user_id if not provided (for demo purposes)
        if not user_id:
            user_id = str(uuid.uuid4())
        
        # Upload to Supabase Storage
        file_url = await supabase_service.upload_file(
            file_bytes,
            file.filename,
            file.content_type
        )
        
        # Create report record
        report = await supabase_service.create_report(
            user_id=user_id,
            file_url=file_url,
            file_name=file.filename
        )
        
        report_id = report.get("id", str(uuid.uuid4()))
        
        # Update status to processing
        await supabase_service.update_report(report_id, {"status": "processing"})
        
        # Step 1: Extract data from PDF using AI
        extracted_data = await openai_service.extract_report_data(
            file_bytes=file_bytes,
            file_type=file.content_type
        )
        
        # Step 2: Classify values and assign severity
        classified_tests = await openai_service.classify_values(extracted_data.tests)
        
        # Step 3: Enrich with explanations for abnormal values
        enriched_tests = await analysis_service.enrich_with_explanations(classified_tests)
        
        # Step 4: Generate overall summary
        summary_data = await openai_service.generate_summary(enriched_tests)
        
        # Calculate health score
        health_score = summary_data.get("health_score", analysis_service.calculate_health_score(enriched_tests))
        overall_status = analysis_service.get_overall_status(enriched_tests)
        
        # Save test results to database
        await supabase_service.save_test_results(report_id, enriched_tests)
        
        # Update report with patient info and health score
        patient_name = extracted_data.patient_info.name if extracted_data.patient_info else None
        patient_age = extracted_data.patient_info.age if extracted_data.patient_info else None
        patient_gender = extracted_data.patient_info.gender if extracted_data.patient_info else None
        
        await supabase_service.update_report(report_id, {
            "status": "completed",
            "patient_name": patient_name,
            "patient_age": patient_age,
            "patient_gender": patient_gender,
            "health_score": health_score
        })
        
        return AnalysisResponse(
            report_id=report_id,
            patient_info=extracted_data.patient_info,
            tests=enriched_tests,
            health_score=health_score,
            summary=summary_data.get("summary"),
            overall_status=overall_status
        )
        
    except Exception as e:
        print(f"Error processing report: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{report_id}", response_model=AnalysisResponse)
async def get_report(report_id: str):
    """
    Get a previously analyzed report by ID
    """
    try:
        report = await supabase_service.get_report(report_id)
        
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        # Get test results
        test_results = await supabase_service.get_test_results(report_id)
        
        tests = []
        for tr in test_results:
            ref_range = None
            if tr.get("reference_min") or tr.get("reference_max"):
                ref_range = ReferenceRange(
                    min=tr.get("reference_min"),
                    max=tr.get("reference_max")
                )
            
            tests.append(TestResult(
                test_name=tr["test_name"],
                observed_value=tr["observed_value"],
                unit=tr.get("unit"),
                reference_range=ref_range,
                status=TestStatus(tr["status"]) if tr.get("status") else None,
                severity=Severity(tr["severity"]) if tr.get("severity") else None,
                explanation=tr.get("explanation"),
                alert_message=tr.get("alert_message")
            ))
        
        return AnalysisResponse(
            report_id=report_id,
            patient_info=None,
            tests=tests,
            health_score=report.get("health_score"),
            summary=None,
            overall_status=report.get("status", "completed")
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting report: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/user/{user_id}")
async def get_user_reports(user_id: str):
    """
    Get all reports for a specific user
    """
    try:
        reports = await supabase_service.get_user_reports(user_id)
        return {"reports": reports}
        
    except Exception as e:
        print(f"Error getting user reports: {e}")
        raise HTTPException(status_code=500, detail=str(e))
