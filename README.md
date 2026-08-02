# StockFlow

Sistema de controle de estoque de uniformes, com dashboard financeiro e visão diferenciada por papel de usuário (Team Leader vs. Administrador). Full-stack: **React + TypeScript** no frontend, **FastAPI + SQLAlchemy** no backend.

**🔗 Demo ao vivo:** [stockflow-pearl-ten.vercel.app](https://stockflow-pearl-ten.vercel.app)
**🔗 API:** [stockflow-api-cyuo.onrender.com](https://stockflow-api-cyuo.onrender.com)

> Nota: o backend roda no plano gratuito do Render, que "dorme" após inatividade — a primeira requisição pode levar ~30-50s pra responder enquanto o servidor acorda.

## Sobre o projeto

Esse projeto nasceu como a evolução de um sistema real que já rodava em produção internamente (Google Apps Script + Sheets), migrado pra uma stack moderna como exercício de portfólio. Mantém as mesmas regras de negócio centrais:

- **Visibilidade por papel**: um Team Leader só vê as próprias requisições; um Administrador vê tudo
- **Fluxo de aprovação**: pendente → aprovada/recusada → entregue, com baixa automática de estoque
- **Dashboard financeiro**: valor de reposição em estoque, custo de aquisição, custo de entregas, alertas de estoque baixo

## Stack

**Frontend**
- React 19 + TypeScript
- Tailwind CSS v4
- Recharts (gráficos)
- Vite

**Backend**
- FastAPI
- SQLAlchemy + SQLite
- Pydantic

**Deploy**
- Frontend: Vercel
- Backend: Render

## Rodando localmente

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1    # Windows (PowerShell)
pip install -r requirements.txt
python seed.py                 # popula o banco com dados de exemplo
uvicorn main:app --reload
```
API disponível em `http://localhost:8000` (documentação automática em `/docs`).

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Aplicação disponível em `http://localhost:5173`.

## Estrutura
