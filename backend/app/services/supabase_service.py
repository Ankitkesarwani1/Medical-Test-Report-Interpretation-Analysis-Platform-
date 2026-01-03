"""
Supabase Service
Handles all database and storage operations
"""

import os
from typing import Optional, List
from datetime import datetime


class SupabaseService:
    def __init__(self):
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        self.client = None
        self.storage_bucket = "medical-reports"
        
        if url and key and url != "your_supabase_project_url":
            try:
                from supabase import create_client, Client
                self.client: Client = create_client(url, key)
                print("Supabase client initialized successfully")
            except Exception as e:
                print(f"Warning: Could not initialize Supabase client: {e}")
                print("Running in mock mode - data will not be persisted")
                self.client = None
        else:
            print("Supabase credentials not configured. Running in mock mode.")
    
    async def upload_file(self, file_bytes: bytes, file_name: str, content_type: str) -> Optional[str]:
        """Upload a file to Supabase Storage and return the public URL"""
        if not self.client:
            # Return a mock URL for development
            return f"mock://storage/{file_name}"
        
        try:
            # Generate unique file path
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            file_path = f"reports/{timestamp}_{file_name}"
            
            # Upload to storage
            result = self.client.storage.from_(self.storage_bucket).upload(
                file_path,
                file_bytes,
                {"content-type": content_type}
            )
            
            # Get public URL
            url = self.client.storage.from_(self.storage_bucket).get_public_url(file_path)
            return url
            
        except Exception as e:
            print(f"Error uploading file: {e}")
            return f"mock://storage/{file_name}"
    
    async def create_report(self, user_id: str, file_url: str, file_name: str) -> dict:
        """Create a new report record in the database"""
        import uuid
        mock_id = str(uuid.uuid4())
        
        if not self.client:
            # Return mock data for development
            return {
                "id": mock_id,
                "user_id": user_id,
                "file_url": file_url,
                "file_name": file_name,
                "status": "pending",
                "created_at": datetime.now().isoformat()
            }
        
        try:
            result = self.client.table("reports").insert({
                "user_id": user_id,
                "file_url": file_url,
                "file_name": file_name,
                "status": "pending"
            }).execute()
            
            return result.data[0] if result.data else {"id": mock_id}
            
        except Exception as e:
            print(f"Error creating report: {e}")
            return {"id": mock_id, "user_id": user_id, "file_url": file_url, "status": "pending"}
    
    async def update_report(self, report_id: str, data: dict) -> dict:
        """Update a report record"""
        if not self.client:
            return {"id": report_id, **data}
        
        try:
            result = self.client.table("reports").update(data).eq("id", report_id).execute()
            return result.data[0] if result.data else {"id": report_id, **data}
            
        except Exception as e:
            print(f"Error updating report: {e}")
            return {"id": report_id, **data}
    
    async def get_report(self, report_id: str) -> Optional[dict]:
        """Get a report by ID with its test results"""
        if not self.client:
            return None
        
        try:
            result = self.client.table("reports").select("*, test_results(*)").eq("id", report_id).execute()
            return result.data[0] if result.data else None
            
        except Exception as e:
            print(f"Error getting report: {e}")
            return None
    
    async def get_user_reports(self, user_id: str) -> List[dict]:
        """Get all reports for a user"""
        if not self.client:
            return []
        
        try:
            result = self.client.table("reports").select(
                "*, test_results(count)"
            ).eq("user_id", user_id).order("created_at", desc=True).execute()
            
            return result.data or []
            
        except Exception as e:
            print(f"Error getting user reports: {e}")
            return []
    
    async def save_test_results(self, report_id: str, tests: list) -> List[dict]:
        """Save test results for a report"""
        if not self.client:
            return []
        
        try:
            # Prepare test data for insertion
            test_records = []
            for test in tests:
                record = {
                    "report_id": report_id,
                    "test_name": test.test_name,
                    "observed_value": test.observed_value,
                    "unit": test.unit,
                    "reference_min": test.reference_range.min if test.reference_range else None,
                    "reference_max": test.reference_range.max if test.reference_range else None,
                    "status": test.status.value if test.status else None,
                    "severity": test.severity.value if test.severity else None,
                    "explanation": test.explanation,
                    "alert_message": test.alert_message
                }
                test_records.append(record)
            
            result = self.client.table("test_results").insert(test_records).execute()
            return result.data or []
            
        except Exception as e:
            print(f"Error saving test results: {e}")
            return []
    
    async def get_test_results(self, report_id: str) -> List[dict]:
        """Get all test results for a report"""
        if not self.client:
            return []
        
        try:
            result = self.client.table("test_results").select("*").eq("report_id", report_id).execute()
            return result.data or []
            
        except Exception as e:
            print(f"Error getting test results: {e}")
            return []


# Singleton instance
supabase_service = SupabaseService()
