from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.attendance import AttendanceStatus


class AttendanceSessionCreate(BaseModel):
    course_id: int
    topic: Optional[str] = None
    date: Optional[datetime] = None


class AttendanceSessionResponse(BaseModel):
    id: int
    course_id: int
    date: datetime
    topic: Optional[str]
    session_code: str
    is_open: bool
    created_at: datetime

    class Config:
        from_attributes = True


class AttendanceCreate(BaseModel):
    session_id: int
    student_id: int
    status: AttendanceStatus = AttendanceStatus.PRESENTE
    notes: Optional[str] = None


class AttendanceBulkCreate(BaseModel):
    session_id: int
    records: List[dict]  # [{student_id: int, status: str}]


class AttendanceResponse(BaseModel):
    id: int
    session_id: int
    student_id: int
    status: AttendanceStatus
    notes: Optional[str]
    registered_at: datetime

    class Config:
        from_attributes = True


class AttendanceMarkByCode(BaseModel):
    """Estudiante marca asistencia con el código de sesión."""
    session_code: str
    student_code: str
