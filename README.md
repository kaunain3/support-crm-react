
# Support CRM Ticketing System (React + FastAPI)

A full-stack customer support ticketing system with a FastAPI backend and a React frontend. Supports creating tickets, live search/filtering, and updating status with notes.

**Live demo:** https://web-production-c7a05.up.railway.app
**API docs:** https://web-production-c7a05.up.railway.app/docs
**Vanilla JS version of this project:** [link to your other repo, if relevant]

## Tech Stack

- **Backend:** Python, FastAPI, Uvicorn
- **Database:** SQLite + SQLAlchemy ORM
- **Frontend:** React (Vite), React Router, Tailwind CSS
- **Deployment:** Railway.app

## Features

- Create tickets with customer info, subject, and description
- Auto-generated sequential ticket IDs (e.g. `TKT-001`)
- List all tickets with live, debounced search (name, ID, email, description)
- Filter tickets by status (Open / In Progress / Closed)
- Client-side routing between list, create, and detail views (React Router)
- Detail view per ticket with full description and note history
- Update ticket status and append notes without a full page reload

## Project Structure


react_srm/
├── app/                      # FastAPI backend
│   ├── main.py                # Routes + serves the built React app
│   ├── database.py            # DB engine/session setup
│   ├── models.py              # SQLAlchemy models (Ticket, Note)
│   ├── schemas.py             # Pydantic request/response schemas
│   └── crud.py                 # Database query logic
├── frontend/                 # React app (Vite)
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx             # Route definitions
│   │   ├── api.js              # Centralized fetch() calls to the backend
│   │   └── pages/
│   │       ├── TicketList.jsx
│   │       ├── CreateTicket.jsx
│   │       └── TicketDetail.jsx
│   ├── dist/                  # Built static output (committed, served by FastAPI)
│   └── vite.config.js
├── requirements.txt
├── Procfile
└── .gitignore


## API Endpoints

| Method | Endpoint                  | Description                          |
|--------|----------------------------|---------------------------------------|
| POST   | `/api/tickets`              | Create a new ticket                   |
| GET    | `/api/tickets`               | List tickets (`?status=`, `?search=`) |
| GET    | `/api/tickets/{ticket_id}`   | Get full ticket detail + notes        |
| PUT    | `/api/tickets/{ticket_id}`   | Update status and/or add a note       |

All other paths are served by the React app (client-side routed).

## Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/kaunain3/support-crm-react.git
cd react_srm
```

### 2. Backend setup
```bash
python -m venv venv
# Mac/Linux
source venv/bin/activate
# Windows
venv\Scripts\activate

pip install -r requirements.txt
```

### 3. Frontend setup
```bash
cd frontend
npm install
```

### 4. Run in development (two servers, one terminal each)

**Terminal 1 — backend:**
```bash
uvicorn app.main:app --reload
```

**Terminal 2 — frontend:**
```bash
cd frontend
npm run dev
```

Open the app at `http://localhost:5173` — the Vite dev server proxies `/api/*` requests to FastAPI on port 8000 (see `vite.config.js`).

### 5. Run in production mode locally (single server)
```bash
cd frontend
npm run build
cd ..
uvicorn app.main:app --reload
```
Open `http://127.0.0.1:8000` — FastAPI now serves the built React app directly, exactly as it does in production.

The SQLite database file (`support_crm.db`) is created automatically on first run.

## Deployment

Deployed on [Railway](https://railway.app). The React app is built locally (`npm run build`) and its output (`frontend/dist/`) is committed to the repo, so no Node.js build step runs on the server — Railway only needs Python.

`Procfile`:
```
web: python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

FastAPI serves the built frontend via a static mount plus a catch-all route, so React Router's client-side routes (like `/tickets/TKT-001`) work correctly even on a direct page load or refresh:
```python
app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")

@app.get("/{full_path:path}")
def serve_react(full_path: str):
    return FileResponse("frontend/dist/index.html")
```

## Known Tradeoffs

- **SQLite on Railway's ephemeral filesystem**: data resets on redeploy. Acceptable for this project's scope; a production version would use a persistent Postgres database.
- **Ticket ID generation** uses a row count (`TKT-001`, `TKT-002`, ...) for readability, which has a theoretical race condition under concurrent writes at scale — a UUID or DB auto-increment would be more robust for high-concurrency production use.
- **Frontend build is committed rather than built on the server**, trading a slightly larger repo for a simpler, faster, Node-free deploy. A larger project would typically build in CI instead.
```

One placeholder to fill in: the "Vanilla JS version of this project" link, if you want to cross-reference your other repo — otherwise just delete that line.
