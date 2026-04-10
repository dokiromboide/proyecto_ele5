from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.attendance import AttendanceSession, Attendance, AttendanceStatus
from app.routers.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Estadísticas reales para el dashboard."""
    total_students = (
        db.query(User)
        .filter(User.role == UserRole.ESTUDIANTE, User.is_active == True)
        .count()
    )
    total_docentes = (
        db.query(User)
        .filter(User.role == UserRole.DOCENTE, User.is_active == True)
        .count()
    )
    total_sessions = db.query(AttendanceSession).count()
    total_records = db.query(Attendance).count()
    present_records = (
        db.query(Attendance)
        .filter(Attendance.status == AttendanceStatus.PRESENTE)
        .count()
    )
    attendance_pct = (
        round(present_records / total_records * 100) if total_records > 0 else 0
    )

    return {
        "total_students": total_students,
        "total_docentes": total_docentes,
        "total_sessions": total_sessions,
        "attendance_percentage": attendance_pct,
        "total_records": total_records,
        "present_records": present_records,
    }
