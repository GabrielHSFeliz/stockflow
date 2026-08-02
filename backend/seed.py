from datetime import datetime, timedelta
import random

from database import Base, engine, SessionLocal
import models

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

db = SessionLocal()

employees = [
    models.Employee(name="Gabriel Henrique", role=models.Role.ADMIN_MASTER, area="BRSP11 - Geral"),
    models.Employee(name="Marcos Lima", role=models.Role.TL, area="BRSP11 - Inbound"),
    models.Employee(name="Fernanda Costa", role=models.Role.TL, area="BRSP11 - Outbound"),
    models.Employee(name="Renata Alves", role=models.Role.TL, area="BRSP11 - Picking"),
]
db.add_all(employees)
db.commit()

items = [
    models.UniformItem(sku="UNI-CAM-P", name="Camisa uniforme", size="P", current_stock=42, unit_cost_in=28.50, unit_value=45.00),
    models.UniformItem(sku="UNI-CAM-M", name="Camisa uniforme", size="M", current_stock=8, unit_cost_in=28.50, unit_value=45.00),
    models.UniformItem(sku="UNI-CAM-G", name="Camisa uniforme", size="G", current_stock=25, unit_cost_in=28.50, unit_value=45.00),
    models.UniformItem(sku="UNI-CAL-38", name="Calça uniforme", size="38", current_stock=12, unit_cost_in=45.00, unit_value=70.00),
    models.UniformItem(sku="UNI-CAL-40", name="Calça uniforme", size="40", current_stock=30, unit_cost_in=45.00, unit_value=70.00),
    models.UniformItem(sku="UNI-BOT-39", name="Bota de segurança", size="39", current_stock=6, unit_cost_in=95.00, unit_value=140.00),
    models.UniformItem(sku="UNI-BOT-41", name="Bota de segurança", size="41", current_stock=18, unit_cost_in=95.00, unit_value=140.00),
    models.UniformItem(sku="UNI-LUV-M", name="Luva de proteção", size="M", current_stock=60, unit_cost_in=9.90, unit_value=15.00),
]
db.add_all(items)
db.commit()

statuses = [models.Status.PENDING, models.Status.APPROVED, models.Status.DELIVERED, models.Status.REJECTED]

for i in range(24):
    employee = random.choice(employees[1:])  # requisições feitas por TLs
    item = random.choice(items)
    status = random.choices(statuses, weights=[3, 2, 4, 1])[0]
    quantity = random.randint(1, 3)
    requested_at = datetime.utcnow() - timedelta(days=random.randint(0, 45))

    requisition = models.Requisition(
        employee_id=employee.id,
        item_id=item.id,
        quantity=quantity,
        status=status,
        requested_at=requested_at,
        notes=random.choice([None, "Reposição por desgaste", "Novo colaborador", "Troca de tamanho"]),
    )
    if status == models.Status.DELIVERED:
        requisition.delivered_at = requested_at + timedelta(days=random.randint(1, 5))
        requisition.delivery_cost = round(item.unit_cost_in * quantity, 2)

    db.add(requisition)

db.commit()
db.close()

print("Seed concluído com sucesso.")