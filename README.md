# 🔍 FAST Peshawar — Lost & Found Intelligence System

> A full-stack web application that digitizes the Lost & Found workflow at FAST Peshawar campus, replacing the manual register-based system at the Student Affairs office with a structured, database-driven solution.

---

## 👥 Group Information

| Name | Roll Number |
|---|---|
| Muhammad Musawar Ali Shah | 24P-0619 |
| Muhammad Ahmed Asim | 24P-0740 |

**GitHub Repository:** [Lost-Found Intelligence](https://github.com/SayedMusawar/Lost-FoundIntelligence)

---

## 📸 Application Preview

<!-- Add a banner/hero screenshot of the app here -->
<!-- Example: ![App Banner](screenshots/banner.png) -->

> _Screenshot: Homepage / Item Listing_

<!-- Add screenshot here -->

---

## 📋 Project Description

The system manages the complete lifecycle of a lost item — from registration by staff, to student claim submission, admin verification, and digital receipt generation. It enforces role-based access control, maintains audit trails, and sends in-app notifications to users on claim status updates.

---

## 🛠️ Technologies Used

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite) |
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| DB Driver | psycopg2 |
| Data Validation | Pydantic |
| HTTP Client | Axios |
| API Server | Uvicorn |

---

## ✨ Features

- 📦 Register found items with category, location, date, and description
- 🔎 Search and filter items by keyword, category, and campus location
- 📝 Submit claim requests with ownership proof description
- 🛡️ Admin dashboard for claim approval and rejection
- 🧾 Digital receipt generation with print support
- 📁 My Claims page for students to track claim status
- 🔔 In-app notifications on claim approval or rejection
- 🔐 Role-based access control — admin, staff, student, faculty
- 🔒 Secure password hashing using SHA-256

---

## 📸 Screenshots

### Login Page
<!-- Add screenshot here -->
> _Screenshot: Login screen_

---

### Item Listing / Browse
<!-- Add screenshot here -->
> _Screenshot: Public item listing with search & filter_

---

### Register Found Item (Staff)
<!-- Add screenshot here -->
> _Screenshot: Staff form to register a found item_

---

### Admin Dashboard
<!-- Add screenshot here -->
> _Screenshot: Admin claim review panel_

---

### My Claims (Student)
<!-- Add screenshot here -->
> _Screenshot: Student's claim tracking page_

---

### Digital Receipt
<!-- Add screenshot here -->
> _Screenshot: Generated receipt on claim approval_

---

## 🗂️ CRUD Operations

| Operation | Where Implemented |
|---|---|
| **CREATE** | Register items, submit claims, issue receipts, create notifications, add users |
| **READ** | Browse items, search/filter, view claims, view receipts, view notifications |
| **UPDATE** | Approve/reject claims, mark item as claimed, mark notifications as read |
| **DELETE** | Cascade delete on item removal (images, status history) |

---

## 🗃️ Database Schema

**9 Tables:**
`USER`, `ITEM`, `CATEGORY`, `ITEM_IMAGE`, `CLAIM_REQUEST`, `RECEIPT`, `AUDIT_LOG`, `NOTIFICATION`, `ITEM_STATUS_HISTORY`

**Custom ENUMs:**
- `user_role` → student, faculty, staff, admin
- `item_status` → found, claimed, closed, expired
- `claim_status` → pending, approved, rejected

<!-- Add an ER Diagram image here -->
> _Diagram: Entity-Relationship (ER) Diagram_

<!-- Add ER diagram screenshot here -->

---

## ⚙️ Prerequisites — Install These First

Run these commands on Ubuntu:

```bash
# PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib -y

# Python 3
sudo apt install python3 python3-pip python3-venv -y

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

---

## 🚀 Installation & Running the App

### Step 1 — Database Setup

```bash
# Start PostgreSQL service
sudo service postgresql start

# Open PostgreSQL shell
sudo -u postgres psql

# Inside the shell, set password then exit
ALTER USER postgres PASSWORD 'admin123';
\q
```

Open **pgAdmin 4**, connect with:
- Host: `localhost`
- Username: `postgres`
- Password: `admin123`

Right-click **Databases → Create → Database**, name it `lost_found`, click Save.

Open **Query Tool** on `lost_found` and run the full schema from `backend/schema.sql`.

Then run this seed data:

```sql
-- Categories
INSERT INTO category (cat_name, description) VALUES
('Electronics', 'Phones, laptops, chargers, earphones'),
('Stationery', 'Pens, notebooks, calculators'),
('ID Cards', 'Student and faculty ID cards'),
('Keys', 'Car keys, locker keys, house keys'),
('Clothing', 'Jackets, scarves, caps'),
('Bags', 'Backpacks, handbags'),
('Books', 'Textbooks and notebooks'),
('Other', 'Anything not listed above');

-- Admin user
INSERT INTO "USER" (name, email, password_hash, role, department)
VALUES ('Test Admin', 'admin@fast.edu.pk',
  encode(sha256('admin123'::bytea), 'hex'),
  'admin', 'Student Affairs');

-- Student user
INSERT INTO "USER" (name, email, password_hash, role, department)
VALUES ('Ali Student', 'ali@fast.edu.pk',
  encode(sha256('student123'::bytea), 'hex'),
  'student', 'CS');
```

---

### Step 2 — Backend Setup

Open a terminal:

```bash
cd ~/Desktop/lost-found
python3 -m venv myenv
source myenv/bin/activate
pip install fastapi uvicorn psycopg2-binary pydantic
cd backend
uvicorn main:app --reload
```

- Backend runs at: `http://127.0.0.1:8000`
- Interactive API docs at: `http://127.0.0.1:8000/docs`

<!-- Add a screenshot of the Swagger/API docs here -->
> _Screenshot: FastAPI interactive docs at /docs_

---

### Step 3 — Frontend Setup

Open a **second terminal**:

```bash
cd ~/Desktop/lost-found/frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### Step 4 — Open in Browser

Go to `http://localhost:5173`

| Role | Email | Password |
|---|---|---|
| Admin | admin@fast.edu.pk | admin123 |
| Student | ali@fast.edu.pk | student123 |

---

## 📁 Project Structure

```
lost-found/
├── myenv/                      # Python virtual environment
├── backend/
│   ├── main.py                 # FastAPI app, CORS, router registration
│   ├── database.py             # PostgreSQL connection + query executor
│   ├── schema.sql              # Full DDL — all 9 tables + ENUMs
│   ├── models/
│   │   ├── user.py             # Pydantic models for user
│   │   └── item.py             # Pydantic models for item
│   └── routers/
│       ├── auth.py             # Login endpoint
│       ├── items.py            # Item CRUD + search
│       ├── claims.py           # Claim submission + review
│       ├── receipts.py         # Receipt generation
│       └── notifications.py   # Notification read/unread
└── frontend/
    └── src/
        ├── App.jsx             # Page routing + role guards
        ├── api/
        │   └── client.js       # All Axios API calls
        └── pages/
            ├── Login.jsx
            ├── ItemList.jsx
            ├── RegisterItem.jsx
            ├── ClaimItem.jsx
            ├── AdminDashboard.jsx
            ├── IssueReceipt.jsx
            ├── MyClaims.jsx
            └── Notifications.jsx
```

---

## 🔒 SQL Injection — Is This App Secure?

**Yes. This application is fully protected against SQL injection.**

All database queries use **parameterized queries** via psycopg2. User input is never concatenated directly into SQL strings.

**Example from `routers/auth.py`:**
```python
execute_query(
    'SELECT * FROM "USER" WHERE email = %s',
    params=(credentials.email,),
    fetch="one"
)
```

The `%s` placeholder tells psycopg2 to treat the value as data, never as executable SQL. Even if a user types `' OR '1'='1` into the email field, it is passed as a plain string — the database will not execute it.

| Threat | Protection |
|---|---|
| SQL Injection | Parameterized queries via psycopg2 |
| Password theft | SHA-256 hashing — plain passwords never stored |
| Unauthorized access | Role-based access control on all routes |

---

## 🔄 System Workflow

```
1. Staff registers a found item with details and campus location
        ↓
2. Students browse and search the public item listing
        ↓
3. A student submits a claim describing why the item is theirs
        ↓
4. Admin reviews the claim in the Admin Dashboard
        ↓
5. Admin approves or rejects → student gets an in-app notification
        ↓
6. Staff issues a digital receipt when student collects the item
        ↓
7. Item status updates to `claimed` and the case is closed
```

<!-- Add a workflow diagram image here -->
> _Diagram: System workflow / flowchart_

---

## 👨‍💻 Developed By

| Name | Roll Number |
|---|---|
| Muhammad Musawar Ali Shah | 24P-0619 |
| Muhammad Ahmed Asim | 24P-0740 |

**FAST Peshawar — Database Systems Lab Project, Spring 2026**
