from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base
from app.models.student import enrollment


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    code = Column(String(20), unique=True, index=True, nullable=False)
    program = Column(String(255), nullable=False)
    semester = Column(Integer, nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relaciones
    teacher = relationship("User", back_populates="courses_taught", foreign_keys=[teacher_id])
    students = relationship("Student", secondary=enrollment, back_populates="courses")
    sessions = relationship("AttendanceSession", back_populates="course")

    def __repr__(self):
        return f"<Course {self.code}: {self.name}>"
