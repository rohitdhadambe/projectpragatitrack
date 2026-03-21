from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, not_

from database import get_db
from projects.models import Project, ProjectStatus
from projects.schema import ProjectCreate, ProjectResponse
from proposals.models import Proposal, ProposalStatus

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("/eligible-proposals/{pm_id}")
async def get_eligible_proposals(pm_id: int, db: AsyncSession = Depends(get_db)):
    # proposals assigned to PM and eligible for project creation
    # include approved + submitted_to_reviewers as requested
    result = await db.execute(
        select(Proposal).where(
            and_(
                Proposal.assigned_pm_id == pm_id,
                Proposal.status.in_([ProposalStatus.approved, ProposalStatus.submitted_to_reviewers])
            )
        )
    )
    proposals = result.scalars().all()

    if not proposals:
        return []

    # filter one-to-one: not already used by a project
    used_proposal_ids = [p.proposal_id for p in (await db.execute(select(Project.proposal_id))).scalars().all()]

    eligible = [p for p in proposals if p.id not in used_proposal_ids]

    return eligible


@router.post("/", response_model=ProjectResponse)
async def create_project(project_data: ProjectCreate, db: AsyncSession = Depends(get_db)):
    # Validate proposal
    proposal = await db.get(Proposal, project_data.proposal_id)
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")

    if proposal.status not in [ProposalStatus.approved, ProposalStatus.submitted_to_reviewers]:
        raise HTTPException(status_code=400, detail="Proposal must be approved or submitted_to_reviewers")

    if proposal.assigned_pm_id != project_data.project_manager_id:
        raise HTTPException(status_code=403, detail="Proposal does not belong to this project manager")

    existing = await db.execute(select(Project).where(Project.proposal_id == project_data.proposal_id))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="A project is already created for this proposal")

    project = Project(
        proposal_id=project_data.proposal_id,
        project_manager_id=project_data.project_manager_id,
        title=project_data.title,
        description=project_data.description,
        project_details=project_data.project_details.model_dump(),
        status=ProjectStatus(project_data.status) if project_data.status else ProjectStatus.planned
    )

    db.add(project)
    await db.commit()
    await db.refresh(project)

    return project


@router.get("/pm/{pm_id}", response_model=list[ProjectResponse])
async def get_projects_by_pm(pm_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Project).where(Project.project_manager_id == pm_id)
    )
    return result.scalars().all()


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: int, db: AsyncSession = Depends(get_db)):
    project = await db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.get("/", response_model=list[ProjectResponse])
async def get_all_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project))
    return result.scalars().all()
