from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base


class AttendanceStatus(str, enum.Enum):
    PRESENTE = "presente"
    AUSENTE = "ausente"
    TARDANZA = "tardanza"
    JUSTIFICADO = "justificado"


class AttendanceSession(Base):
    """Sesión de clase donde se toma asistencia."""
    __tablename__ = "attendance_sessions"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    date = Column(DateTime, nullable=False, default=datetime.utcnow)
    topic = Column(String(500))
    session_code = Column(String(20), unique=True, index=True)  # Código único por sesión
    is_open = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    closed_at = Column(DateTime, nullable=True)

    # Relaciones
    course = relationship("Course", back_populates="sessions")
    attendance_records = relationship("Attendance", back_populates="session")

    def __repr__(self):
        return f"<Session {self.session_code} - {self.date}>"


class Attendance(Base):
    """Registro individual de asistencia de un estudiante."""
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("attendance_sessions.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    status = Column(
        Enum(AttendanceStatus, name='attendance_status', create_type=False, values_callable=lambda obj: [e.value for e in obj]),
        default=AttendanceStatus.AUSENTE
    )
    notes = Column(String(500), nullable=True)
    registered_at = Column(DateTime, default=datetime.utcnow)

    # Relaciones
    session = relationship("AttendanceSession", back_populates="attendance_records")
    student = relationship("Student", back_populates="attendance_records")

    def __repr__(self):
        return f"<Attendance {self.student_id} - {self.status}>"
