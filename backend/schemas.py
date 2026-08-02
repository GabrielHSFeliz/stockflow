from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from models import Role, Status


class EmployeeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    role: Role
    area: str


class ItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    sku: str
    name: str
    size: str
    current_stock: int
    unit_cost_in: float
    unit_value: float


class RequisitionCreate(BaseModel):
    employee_id: int
    item_id: int
    quantity: int = 1
    notes: Optional[str] = None


class RequisitionStatusUpdate(BaseModel):
    status: Status


class RequisitionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    quantity: int
    status: Status
    delivery_cost: float
    requested_at: datetime
    delivered_at: Optional[datetime] = None
    notes: Optional[str] = None
    employee: EmployeeOut
    item: ItemOut


class DashboardSummary(BaseModel):
    total_stock_value: float
    total_cost_in: float
    total_delivery_cost: float
    total_requisitions: int
    pending_requisitions: int
    low_stock_items: int