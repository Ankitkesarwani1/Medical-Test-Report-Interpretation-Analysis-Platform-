"""
OpenAI Service
Handles all interactions with OpenAI API for medical report analysis
Uses TEXT-ONLY analysis (no Vision API) - budget friendly!
"""

import os
import json
from openai import OpenAI
from io import BytesIO
from prompts.medical_prompts import (
    SYSTEM_PROMPT_EXTRACT, USER_PROMPT_EXTRACT,
    SYSTEM_PROMPT_CLASSIFY, USER_PROMPT_CLASSIFY,
    SYSTEM_PROMPT_EXPLAIN, USER_PROMPT_EXPLAIN,
    SYSTEM_PROMPT_ALERT, USER_PROMPT_ALERT,
    SYSTEM_PROMPT_SUMMARY, USER_PROMPT_SUMMARY
)
from models.schemas import (
    ExtractedReportData, TestResult, PatientInfo,
    ReferenceRange, TestStatus, Severity
)


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extract text content from PDF bytes"""
    try:
        from PyPDF2 import PdfReader
        reader = PdfReader(BytesIO(pdf_bytes))
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text.strip()
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        return ""


class OpenAIService:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key or api_key == "your_openai_api_key_here":
            print("Warning: OpenAI API key not configured!")
            self.client = None
        else:
            self.client = OpenAI(api_key=api_key)
        
        # Using GPT-3.5-turbo - MUCH cheaper than GPT-4!
        self.model = "gpt-3.5-turbo"
    
    async def extract_report_data(self, file_url: str = None, file_bytes: bytes = None, file_type: str = "application/pdf") -> ExtractedReportData:
        """
        Extract structured data from a medical report PDF
        Uses TEXT extraction only - no Vision API
        """
        if not self.client:
            raise Exception("OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file.")
        
        try:
            # Extract text from PDF
            if file_bytes:
                pdf_text = extract_text_from_pdf(file_bytes)
                
                if not pdf_text or len(pdf_text) < 50:
                    raise Exception("Could not extract text from PDF. The PDF might be scanned/image-based. Please try a text-based PDF.")
                
                print(f"Extracted {len(pdf_text)} characters from PDF")
            else:
                raise Exception("No file provided for analysis")
            
            # Use text-based analysis
            user_content = f"""{USER_PROMPT_EXTRACT}

Here is the extracted text from the medical report:

---
{pdf_text[:8000]}
---

Please analyze this text and extract the medical test data as JSON."""
            
            messages = [
                {"role": "system", "content": SYSTEM_PROMPT_EXTRACT},
                {"role": "user", "content": user_content}
            ]
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=2000,
                temperature=0.1
            )
            
            content = response.choices[0].message.content
            
            # Clean up markdown formatting
            if "```json" in content:
                content = content.split("```json")[1]
            if "```" in content:
                content = content.split("```")[0]
            
            content = content.strip()
            
            try:
                data = json.loads(content)
            except json.JSONDecodeError as e:
                print(f"JSON parse error: {e}")
                print(f"Raw content: {content[:500]}")
                raise Exception("Failed to parse AI response. The report format may not be recognized.")
            
            # Convert to Pydantic model
            patient_info = None
            if data.get("patient_info"):
                patient_info = PatientInfo(**data["patient_info"])
            
            tests = []
            for test in data.get("tests", []):
                ref_range = None
                if test.get("reference_range") and isinstance(test["reference_range"], dict):
                    ref_range = ReferenceRange(
                        min=test["reference_range"].get("min"),
                        max=test["reference_range"].get("max")
                    )
                
                tests.append(TestResult(
                    test_name=test.get("test_name", "Unknown Test"),
                    observed_value=str(test.get("observed_value", test.get("value", "N/A"))),
                    unit=test.get("unit"),
                    reference_range=ref_range
                ))
            
            if not tests:
                raise Exception("No test results found in the report. Please ensure you uploaded a valid medical lab report.")
            
            return ExtractedReportData(patient_info=patient_info, tests=tests)
            
        except Exception as e:
            print(f"Error extracting report data: {e}")
            raise e
    
    async def classify_values(self, tests: list[TestResult]) -> list[TestResult]:
        """Classify test values as NORMAL, LOW, HIGH, or UNKNOWN"""
        if not self.client:
            for test in tests:
                test.status = TestStatus.UNKNOWN
                test.severity = Severity.GRAY
            return tests
        
        try:
            tests_json = json.dumps([t.model_dump() for t in tests], indent=2, default=str)
            
            messages = [
                {"role": "system", "content": SYSTEM_PROMPT_CLASSIFY},
                {"role": "user", "content": USER_PROMPT_CLASSIFY.format(tests_json=tests_json)}
            ]
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=2000,
                temperature=0.1
            )
            
            content = response.choices[0].message.content
            
            if "```json" in content:
                content = content.split("```json")[1]
            if "```" in content:
                content = content.split("```")[0]
            
            classified_data = json.loads(content.strip())
            tests_data = classified_data if isinstance(classified_data, list) else classified_data.get("tests", [])
            
            classified_tests = []
            for test_data in tests_data:
                ref_range = None
                if test_data.get("reference_range") and isinstance(test_data["reference_range"], dict):
                    ref_range = ReferenceRange(
                        min=test_data["reference_range"].get("min"),
                        max=test_data["reference_range"].get("max")
                    )
                
                status_str = test_data.get("status", "UNKNOWN").upper()
                severity_str = test_data.get("severity", "gray").lower()
                
                classified_tests.append(TestResult(
                    test_name=test_data.get("test_name", "Unknown"),
                    observed_value=str(test_data.get("observed_value", "N/A")),
                    unit=test_data.get("unit"),
                    reference_range=ref_range,
                    status=TestStatus(status_str) if status_str in ["NORMAL", "LOW", "HIGH", "UNKNOWN"] else TestStatus.UNKNOWN,
                    severity=Severity(severity_str) if severity_str in ["green", "yellow", "red", "gray"] else Severity.GRAY
                ))
            
            return classified_tests
            
        except Exception as e:
            print(f"Error classifying values: {e}")
            for test in tests:
                test.status = TestStatus.UNKNOWN
                test.severity = Severity.GRAY
            return tests
    
    async def generate_explanation(self, test_name: str, value: str, unit: str, status: str) -> str:
        """Generate patient-friendly explanation"""
        if not self.client:
            return "Please consult your healthcare provider for interpretation."
        
        try:
            messages = [
                {"role": "system", "content": SYSTEM_PROMPT_EXPLAIN},
                {"role": "user", "content": USER_PROMPT_EXPLAIN.format(
                    test_name=test_name,
                    value=value,
                    unit=unit or "",
                    status=status
                )}
            ]
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=200,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error generating explanation: {e}")
            return "Please consult your healthcare provider."
    
    async def generate_alert(self, test_name: str, status: str, severity: str) -> str:
        """Generate health alert message"""
        if not self.client:
            return "Please consult your healthcare provider."
        
        try:
            messages = [
                {"role": "system", "content": SYSTEM_PROMPT_ALERT},
                {"role": "user", "content": USER_PROMPT_ALERT.format(
                    test_name=test_name,
                    status=status,
                    severity=severity
                )}
            ]
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=100,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error generating alert: {e}")
            return "Please consult your healthcare provider."
    
    async def generate_summary(self, tests: list[TestResult]) -> dict:
        """Generate overall health summary"""
        normal_count = sum(1 for t in tests if t.status == TestStatus.NORMAL)
        health_score = int((normal_count / len(tests)) * 100) if tests else 0
        
        if not self.client:
            return {
                "summary": "Please review your results with a healthcare provider.",
                "health_score": health_score,
                "attention_areas": []
            }
        
        try:
            tests_summary = "\n".join([
                f"- {t.test_name}: {t.observed_value} {t.unit or ''} - {t.status.value if t.status else 'UNKNOWN'}"
                for t in tests
            ])
            
            abnormal_count = sum(1 for t in tests if t.status in [TestStatus.LOW, TestStatus.HIGH])
            
            messages = [
                {"role": "system", "content": SYSTEM_PROMPT_SUMMARY},
                {"role": "user", "content": USER_PROMPT_SUMMARY.format(
                    tests_summary=tests_summary,
                    total_count=len(tests),
                    normal_count=normal_count,
                    abnormal_count=abnormal_count
                )}
            ]
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=300,
                temperature=0.7
            )
            
            content = response.choices[0].message.content
            
            if "```json" in content:
                content = content.split("```json")[1]
            if "```" in content:
                content = content.split("```")[0]
            
            return json.loads(content.strip())
            
        except Exception as e:
            print(f"Error generating summary: {e}")
            return {
                "summary": "Please review your results with a healthcare provider.",
                "health_score": health_score,
                "attention_areas": []
            }


# Singleton instance
openai_service = OpenAIService()
