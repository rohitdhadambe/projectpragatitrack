from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Dict, Any, List


class ProjectDetails(BaseModel):
    research_plan: List[str]
    technical_design: List[str]
    data_strategy: List[str]
    resource_plan: List[str]
    timeline: List[str]
    risk_management: List[str]


class ProjectCreate(BaseModel):
    proposal_id: int
    project_manager_id: int
    title: str
    description: str
    project_details: ProjectDetails
    status: Optional[str] = "planned"


class ProjectResponse(ProjectCreate):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
