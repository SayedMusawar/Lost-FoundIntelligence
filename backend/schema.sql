-- ============================================================
--  FAST PESHAWAR -- Lost & Found Intelligence System
-- ============================================================


-- ============================================================
--  ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM (
    'student',
    'faculty',
    'staff',
    'admin'
);

CREATE TYPE item_status AS ENUM (
    'found',
    'claimed',
    'closed',
    'expired'
);

CREATE TYPE claim_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);


-- ============================================================
--  1. USER
--  Represents every person who can log into the system.
-- ============================================================

CREATE TABLE "USER" (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    contact_number VARCHAR(20),
    roll_number VARCHAR(20),
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);


-- ============================================================
--  2. CATEGORY
-- ============================================================

CREATE TABLE CATEGORY (
    category_id SERIAL PRIMARY KEY,
    cat_name VARCHAR(80) UNIQUE NOT NULL,
    description TEXT
);


-- ============================================================
--  3. ITEM
--  Central entity. Tracks every found item.
-- ============================================================

CREATE TABLE ITEM (
    item_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category_id INT,
    location_found VARCHAR(200) NOT NULL,
    found_at TIMESTAMP NOT NULL,
    status item_status NOT NULL,
    is_public BOOLEAN DEFAULT TRUE,
    submitted_by INT,                            -- the finder (optional / anonymous)
    registered_by INT,                            -- the staff member who entered the record
    expiry_date DATE,                           -- when unclaimed item transitions to EXPIRED
    registered_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (category_id)   REFERENCES CATEGORY(category_id),
    FOREIGN KEY (submitted_by)  REFERENCES "USER"(user_id),
    FOREIGN KEY (registered_by) REFERENCES "USER"(user_id)
);


-- ============================================================
--  4. ITEM_IMAGE
--  Stores multiple photos per item.
-- ============================================================

CREATE TABLE ITEM_IMAGE (
    image_id SERIAL PRIMARY KEY,
    item_id INT NOT NULL,
    image_path VARCHAR(300) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (item_id) REFERENCES ITEM(item_id) ON DELETE CASCADE
);


-- ============================================================
--  5. CLAIM_REQUEST
-- ============================================================

CREATE TABLE CLAIM_REQUEST (
    claim_id SERIAL PRIMARY KEY,
    item_id INT NOT NULL,
    claimant_id INT NOT NULL,
    claim_description TEXT NOT NULL,
    status claim_status NOT NULL DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    reviewed_by INT,

    UNIQUE (item_id, claimant_id),          -- one claim per user per item

    FOREIGN KEY (item_id)       REFERENCES ITEM(item_id),
    FOREIGN KEY (claimant_id)   REFERENCES "USER"(user_id),
    FOREIGN KEY (reviewed_by)   REFERENCES "USER"(user_id)
);

-- Partial unique index: only one APPROVED claim per item is allowed
CREATE UNIQUE INDEX ON CLAIM_REQUEST (item_id)
    WHERE status = 'approved';


-- ============================================================
--  6. RECEIPT
-- ============================================================

CREATE TABLE RECEIPT (
    receipt_id SERIAL PRIMARY KEY,
    claim_id INT UNIQUE NOT NULL,
    issued_to INT,
    issued_by INT,
    receiver_name VARCHAR(100),
    receiver_phone VARCHAR(20),
    condition_at_handover TEXT,
    issued_at TIMESTAMP DEFAULT NOW(),
    notes TEXT,

    FOREIGN KEY (claim_id)  REFERENCES CLAIM_REQUEST(claim_id) ON DELETE CASCADE,
    FOREIGN KEY (issued_to) REFERENCES "USER"(user_id),
    FOREIGN KEY (issued_by) REFERENCES "USER"(user_id)
);


-- ============================================================
--  7. AUDIT_LOG
-- ============================================================

CREATE TABLE AUDIT_LOG (
    log_id SERIAL PRIMARY KEY,
    actor_id INT,                        -- the user who performed the action
    action_type VARCHAR(80),
    target_table VARCHAR(80),
    target_id INT NOT NULL,   -- polymorphic: ID in any table
    action_timestamp TIMESTAMP DEFAULT NOW(),
    details TEXT,

    FOREIGN KEY (actor_id) REFERENCES "USER"(user_id)
);


-- ============================================================
--  8. NOTIFICATION
-- ============================================================

CREATE TABLE NOTIFICATION (
    notification_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    related_claim_id INT,

    FOREIGN KEY (user_id) REFERENCES "USER"(user_id),
    FOREIGN KEY (related_claim_id)  REFERENCES CLAIM_REQUEST(claim_id)
);


-- ============================================================
--  9. ITEM_STATUS_HISTORY
-- ============================================================

CREATE TABLE ITEM_STATUS_HISTORY (
    history_id SERIAL PRIMARY KEY,
    item_id INT,
    old_status VARCHAR(30) NOT NULL,
    new_status VARCHAR(30) NOT NULL,
    changed_by INT,
    changed_at TIMESTAMP DEFAULT NOW(),      -- FIX: NOW() not NOW

    FOREIGN KEY (item_id) REFERENCES ITEM(item_id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES "USER"(user_id)
);


-- ============================================================
--  END OF SCHEMA
-- ============================================================