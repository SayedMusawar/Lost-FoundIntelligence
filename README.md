# Lost-FoundIntelligence System:
**Project Description**

This project implements a Lost & Found Intelligence System for FAST Peshawar campus. The system digitizes the process of reporting, tracking, and claiming lost items within the university. It allows Student Affairs to register found items, manage claim requests, and maintain a complete audit trail. The system ensures accountability, prevents duplicate claims, and replaces the current manual register-based process with a secure database-driven solution.

**Project Objective**
Traditional Lost & Found processes rely on manual registers and paper-based signatures, which lack traceability, security, and data analytics.

This system introduces:
Structured relational schema design
Lifecycle-based item state management
Claim verification and validation logic
Audit trail tracking
Administrative reporting and analytics

The goal is to apply core relational database principles to model and enforce a real institutional workflow.

**Key Features**
Register found items with detailed information (category, location, date, description)
Search lost items using filters (date, category, location)
Submit and manage claim requests
Claim verification and approval/rejection system
Digital receipt generation with timestamp
Item status lifecycle management (Found → Claimed → Closed)
Audit logs and reports for administrative analysis

**Core Concepts Used**
Relational Data Model
Primary and Foreign Keys
One-to-Many Relationships
Many-to-Many Relationships
State Transition Modeling
Integrity Constraints
Transaction Management
SQL Joins and Aggregations
Indexing for optimized search
Audit Trail Design

**System Architecture**

lost-found-system/
│
├── database/
│ ├── schema.sql
│ ├── seed_data.sql
│
├── backend/
│ ├── models/
│ ├── controllers/
│ ├── services/
│
├── gui/
│ ├── admin_panel/
│ ├── search_interface/
│
├── logs/
│ └── audit_logs
│
└── README.md

**How It Works**
A found item is registered by Student Affairs.
The system generates a unique Item ID and stores metadata.
Students search using filters (category, date, location).
A claim request is submitted with verification details.
Admin reviews claim and approves or rejects it.
On approval, the system records receipt details and updates item status.
All actions are logged for accountability.

The system enforces strict state transitions to prevent invalid operations

**Selected RDBMS**
PostgreSQL

**Tools / Tech Stack**
Python
PyQt (for GUI)
PostgreSQL
SQL
Local file storage (for item images)

**Academic Relevance**

This project demonstrates:
Real-world relational schema design
Process modeling using database constraints
State-based workflow enforcement
Secure data handling and validation
Reporting through advanced SQL queries
Unlike basic CRUD systems, this project emphasizes structured data integrity, lifecycle enforcement, and audit-based accountability.

**Future Improvements**
Multi-campus support
Role-based access control
Automated notification system
Image recognition tagging
Performance optimization and indexing
Web-based interface expansion
