from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
from database import Base, engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Meli Stock API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LOW_STOCK_THRESHOLD = 15


@app.get("/employees", response_model=List[schemas.EmployeeOut])
def list_employees(db: Session = Depends(get_db)):
    return db.query(models.Employee).all()


@app.get("/items", response_model=List[schemas.ItemOut])
def list_items(db: Session = Depends(get_db)):
    return db.query(models.UniformItem).order_by(models.UniformItem.name).all()


@app.get("/requisitions", response_model=List[schemas.RequisitionOut])
def list_requisitions(
    employee_id: int = Query(..., description="ID de quem está logado"),
    status: Optional[models.Status] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    db: Session = Depends(get_db),
):
    employee = db.query(models.Employee).get(employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Colaborador não encontrado")

    query = db.query(models.Requisition)

    # Regra de visibilidade: TL só vê as próprias requisições,
    # ADMIN_MASTER vê tudo.
    if employee.role != models.Role.ADMIN_MASTER:
        query = query.filter(models.Requisition.employee_id == employee_id)

    if status:
        query = query.filter(models.Requisition.status == status)
    if date_from:
        query = query.filter(models.Requisition.requested_at >= date_from)
    if date_to:
        query = query.filter(models.Requisition.requested_at <= date_to)

    return query.order_by(models.Requisition.requested_at.desc()).all()


@app.post("/requisitions", response_model=schemas.RequisitionOut, status_code=201)
def create_requisition(payload: schemas.RequisitionCreate, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).get(payload.employee_id)
    item = db.query(models.UniformItem).get(payload.item_id)
    if not employee or not item:
        raise HTTPException(status_code=404, detail="Colaborador ou item não encontrado")

    requisition = models.Requisition(
        employee_id=payload.employee_id,
        item_id=payload.item_id,
        quantity=payload.quantity,
        notes=payload.notes,
        status=models.Status.PENDING,
    )
    db.add(requisition)
    db.commit()
    db.refresh(requisition)
    return requisition


@app.patch("/requisitions/{requisition_id}/status", response_model=schemas.RequisitionOut)
def update_status(
    requisition_id: int,
    payload: schemas.RequisitionStatusUpdate,
    db: Session = Depends(get_db),
):
    requisition = db.query(models.Requisition).get(requisition_id)
    if not requisition:
        raise HTTPException(status_code=404, detail="Requisição não encontrada")

    requisition.status = payload.status
    if payload.status == models.Status.DELIVERED:
        requisition.delivered_at = datetime.utcnow()
        item = requisition.item
        if item.current_stock >= requisition.quantity:
            item.current_stock -= requisition.quantity
        requisition.delivery_cost = round(item.unit_cost_in * requisition.quantity, 2)

    db.commit()
    db.refresh(requisition)
    return requisition


@app.get("/dashboard/summary", response_model=schemas.DashboardSummary)
def dashboard_summary(
    employee_id: int = Query(...),
    db: Session = Depends(get_db),
):
    employee = db.query(models.Employee).get(employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Colaborador não encontrado")

    items = db.query(models.UniformItem).all()
    total_stock_value = sum(i.current_stock * i.unit_value for i in items)
    total_cost_in = sum(i.current_stock * i.unit_cost_in for i in items)
    low_stock_items = sum(1 for i in items if i.current_stock <= LOW_STOCK_THRESHOLD)

    req_query = db.query(models.Requisition)
    if employee.role != models.Role.ADMIN_MASTER:
        req_query = req_query.filter(models.Requisition.employee_id == employee_id)

    requisitions = req_query.all()
    total_delivery_cost = sum(r.delivery_cost for r in requisitions)
    pending = sum(1 for r in requisitions if r.status == models.Status.PENDING)

    return schemas.DashboardSummary(
        total_stock_value=round(total_stock_value, 2),
        total_cost_in=round(total_cost_in, 2),
        total_delivery_cost=round(total_delivery_cost, 2),
        total_requisitions=len(requisitions),
        pending_requisitions=pending,
        low_stock_items=low_stock_items,
    )


@app.get("/")
def root():
    return {"status": "ok", "service": "meli-stock-api"}