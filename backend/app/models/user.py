from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    DOCENTE = "docente"
    ESTUDIANTE = "estudiante"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(
        Enum(UserRole, name='user_role', create_type=False, values_callable=lambda obj: [e.value for e in obj]),
        default=UserRole.ESTUDIANTE,
        nullable=False
    )
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relaciones
    courses_taught = relationship("Course", back_populates="teacher", foreign_keys="Course.teacher_id")
    student_profile = relationship("Student", back_populates="user", uselist=False)

    def __repr__(self):
        return f"<User {self.username} ({self.role})>"
