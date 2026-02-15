#**FAST Peshawar Lost & Found Intelligence System**

A structured relational database system designed to digitize and manage the Lost & Found workflow at FAST Peshawar campus.
This project is developed as a Database Systems lab project to model real-world institutional processes using relational database principles, lifecycle state management, and audit tracking.

#**Overview**
The current Lost & Found process at FAST Peshawar relies on manual registers and physical signatures. This project replaces the manual system with a database-driven solution that ensures:
-Structured data storage
-Controlled workflow transitions
-Claim verification
-Accountability through audit logs
-Administrative reporting and analytics
The system enforces integrity constraints and models the complete lifecycle of a lost item.

#**Problem Statement**
Manual record-keeping in Lost & Found systems:
-Lacks traceability
-Is prone to data inconsistencies
-Does not support analytics
-Has no structured claim validation
This system addresses these issues through relational schema design and controlled state transitions.

#**Key Features**
-Register found items (category, location, date, description)
-Search items using filters
-Submit claim requests
-Claim approval / rejection workflow
-Digital receipt generation
-Lifecycle tracking (Found → Claimed → Closed)
-Administrative dashboard
-Audit logs for accountability
-Analytical reports using SQL queries

#**System Workflow**
-A found item is registered by Student Affairs.
-The system generates a unique Item ID.
-Students search for their lost items.
-A claim request is submitted.
-Admin verifies the claim.
-If approved, the item is marked as claimed.
-A digital receipt is recorded.
-The case is closed and archived.
All actions are logged and time-stamped.

#**Database Concepts Implemented**
-Relational Data Model
-Primary & Foreign Keys
-One-to-Many Relationships
-Many-to-Many Relationships
-Integrity Constraints
-State Transition Modeling
-SQL Joins
-Aggregations (GROUP BY)
-Indexing
-Transaction Handling

#**Project Structure**
lost-found-system/
│
├── database/
│   ├── schema.sql
│   ├── seed_data.sql
│
├── backend/
│   ├── models/
│   ├── services/
│
├── gui/
│   ├── admin_panel/
│   ├── search_interface/
│
├── logs/
│
└── README.md

#**Tech Stack**
-Language: Python
-Database: PostgreSQL / MySQL
-GUI: PyQt
-Query Language: SQL
-Environment: Linux
