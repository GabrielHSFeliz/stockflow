import enum
from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey,
    Enum as SAEnum,
)
from sqlalchemy.orm import relationship

from database import Base


class Role(str, enum.Enum):
    TL = "TL"
    ADMIN_MASTER = "ADMIN_MASTER"


class Status(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    DELIVERED = "DELIVERED"
    REJECTED = "REJECTED"


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    role = Column(SAEnum(Role), nullable=False, default=Role.TL)
    area = Column(String, nullable=False)

    requisitions = relationship("Requisition", back_populates="employee")


class UniformItem(Base):
    __tablename__ = "uniform_items"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    size = Column(String, nullable=False)
    current_stock = Column(Integer, nullable=False, default=0)
    unit_cost_in = Column(Float, nullable=False)  # custo de aquisição
    unit_value = Column(Float, nullable=False)  # valor de reposição/venda

    requisitions = relationship("Requisition", back_populates="item")


class Requisition(Base):
    __tablename__ = "requisitions"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    item_id = Column(Integer, ForeignKey("uniform_items.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    status = Column(SAEnum(Status), nullable=False, default=Status.PENDING)
    delivery_cost = Column(Float, nullable=False, default=0.0)
    requested_at = Column(DateTime, default=datetime.utcnow)
    delivered_at = Column(DateTime, nullable=True)
    notes = Column(String, nullable=True)

    employee = relationship("Employee", back_populates="requisitions")
    item = relationship("UniformItem", back_populates="requisitions")