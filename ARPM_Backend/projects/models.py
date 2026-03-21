from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, ForeignKey, Enum, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from database import Base


class ProjectStatus(str, enum.Enum):
    planned = "planned"
    in_progress = "in_progress"
    completed = "completed"
    on_hold = "on_hold"
    cancelled = "cancelled"


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey("proposals.id"), unique=True, nullable=False, index=True)
    project_manager_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    project_details = Column(JSON, nullable=False)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.planned)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    proposal = relationship("Proposal")
    project_manager = relationship("User")

    __table_args__ = (
        UniqueConstraint('proposal_id', name='uq_projects_proposal_id'),
    )
