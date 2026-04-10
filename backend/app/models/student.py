from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

# Tabla de relación muchos-a-muchos: estudiantes <-> cursos
enrollment = Table(
    "enrollments",
    Base.metadata,
    Column("student_id", Integer, ForeignKey("students.id"), primary_key=True),
    Column("course_id", Integer, ForeignKey("courses.id"), primary_key=True),
    Column("enrolled_at", DateTime, default=datetime.utcnow)
)


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    student_code = Column(String(20), unique=True, index=True, nullable=False)
    program = Column(String(255), nullable=False)
    semester = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relaciones
    user = relationship("User", back_populates="student_profile")
    courses = relationship("Course", secondary=enrollment, back_populates="students")
    attendance_records = relationship("Attendance", back_populates="student")

    def __repr__(self):
        return f"<Student {self.student_code}>"
