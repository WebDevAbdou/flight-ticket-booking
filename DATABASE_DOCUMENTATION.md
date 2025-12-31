# Database Documentation - Flight Booking System

## Database Overview

**Database Name**: `flight_booking_db`  
**Database Engine**: MySQL (InnoDB)  
**Character Set**: UTF8MB4  
**Normalization Level**: Third Normal Form (3NF)

---

## Entity Relationship Diagram (ERD)

```
┌─────────────┐
│    USERS    │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────┐      N:1     ┌─────────────┐
│  BOOKINGS   ├──────────────►│   FLIGHTS   │
└──────┬──────┘              └─────────────┘
       │
       │ 1:1
       │
┌──────▼──────┐
│  PAYMENTS   │
└──────┬──────┘
       │
       │ 1:1
       │
┌──────▼──────┐
│  RECEIPTS   │
└─────────────┘

┌─────────────┐
│  CONTACTS   │  (Independent)
└─────────────┘
```

---

## Table Schemas

### 1. USERS Table

Stores user account information.

| Column        | Type         | Constraints                    | Description                |
|---------------|--------------|--------------------------------|----------------------------|
| user_id       | INT          | PRIMARY KEY, AUTO_INCREMENT    | Unique user identifier     |
| full_name     | VARCHAR(100) | NOT NULL                       | User's full name           |
| email         | VARCHAR(100) | NOT NULL, UNIQUE               | User's email (login)       |
| password_hash | VARCHAR(255) | NOT NULL                       | Hashed password (bcrypt)   |
| phone         | VARCHAR(20)  | NULL                           | User's phone number        |
| created_at    | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP      | Account creation date      |

**Indexes**:
- PRIMARY KEY on `user_id`
- INDEX on `email`

---

### 2. FLIGHTS Table

Stores flight information.

| Column          | Type         | Constraints                    | Description                |
|-----------------|--------------|--------------------------------|----------------------------|
| flight_id       | INT          | PRIMARY KEY, AUTO_INCREMENT    | Unique flight identifier   |
| flight_number   | VARCHAR(20)  | NOT NULL, UNIQUE               | Flight number (e.g., AA101)|
| airline         | VARCHAR(100) | NOT NULL                       | Airline name               |
| origin          | VARCHAR(100) | NOT NULL                       | Departure city/airport     |
| destination     | VARCHAR(100) | NOT NULL                       | Arrival city/airport       |
| departure_time  | DATETIME     | NOT NULL                       | Departure date & time      |
| arrival_time    | DATETIME     | NOT NULL                       | Arrival date & time        |
| price           | DECIMAL(10,2)| NOT NULL, CHECK (price > 0)    | Ticket price               |
| total_seats     | INT          | NOT NULL                       | Total seats on flight      |
| available_seats | INT          | NOT NULL, CHECK (>= 0)         | Available seats            |
| status          | ENUM         | DEFAULT 'scheduled'            | Flight status              |
| created_at      | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP      | Record creation date       |

**Status Values**: 'scheduled', 'delayed', 'cancelled', 'completed'

**Indexes**:
- PRIMARY KEY on `flight_id`
- INDEX on `(origin, destination)`
- INDEX on `departure_time`

**Constraints**:
- `available_seats` must be between 0 and `total_seats`
- `price` must be greater than 0

---

### 3. BOOKINGS Table

Stores flight booking information.

| Column            | Type         | Constraints                    | Description                |
|-------------------|--------------|--------------------------------|----------------------------|
| booking_id        | INT          | PRIMARY KEY, AUTO_INCREMENT    | Unique booking identifier  |
| booking_reference | VARCHAR(20)  | NOT NULL, UNIQUE               | Booking reference code     |
| user_id           | INT          | NOT NULL, FOREIGN KEY          | Reference to users table   |
| flight_id         | INT          | NOT NULL, FOREIGN KEY          | Reference to flights table |
| passenger_name    | VARCHAR(100) | NOT NULL                       | Passenger full name        |
| passenger_email   | VARCHAR(100) | NOT NULL                       | Passenger email            |
| passenger_phone   | VARCHAR(20)  | NOT NULL                       | Passenger phone            |
| seat_number       | VARCHAR(10)  | NULL                           | Assigned seat number       |
| booking_date      | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP      | Booking creation date      |
| status            | ENUM         | DEFAULT 'pending'              | Booking status             |

**Status Values**: 'pending', 'confirmed', 'cancelled'

**Foreign Keys**:
- `user_id` → `users(user_id)` ON DELETE CASCADE
- `flight_id` → `flights(flight_id)` ON DELETE CASCADE

**Indexes**:
- PRIMARY KEY on `booking_id`
- INDEX on `user_id`
- INDEX on `flight_id`
- INDEX on `booking_reference`

---

### 4. PAYMENTS Table

Stores payment transaction information.

| Column          | Type         | Constraints                    | Description                |
|-----------------|--------------|--------------------------------|----------------------------|
| payment_id      | INT          | PRIMARY KEY, AUTO_INCREMENT    | Unique payment identifier  |
| booking_id      | INT          | NOT NULL, UNIQUE, FOREIGN KEY  | Reference to bookings      |
| amount          | DECIMAL(10,2)| NOT NULL, CHECK (amount > 0)   | Payment amount             |
| payment_method  | ENUM         | NOT NULL                       | Payment method used        |
| card_last_four  | VARCHAR(4)   | NULL                           | Last 4 digits of card      |
| payment_date    | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP      | Payment date & time        |
| transaction_id  | VARCHAR(100) | NOT NULL, UNIQUE               | Transaction identifier     |
| status          | ENUM         | DEFAULT 'completed'            | Payment status             |

**Payment Methods**: 'credit_card', 'debit_card', 'paypal'  
**Status Values**: 'pending', 'completed', 'failed', 'refunded'

**Foreign Keys**:
- `booking_id` → `bookings(booking_id)` ON DELETE CASCADE

**Indexes**:
- PRIMARY KEY on `payment_id`
- INDEX on `booking_id`
- INDEX on `transaction_id`

**Constraints**:
- `amount` must be greater than 0
- One payment per booking (UNIQUE on `booking_id`)

---

### 5. RECEIPTS Table

Stores receipt information and PDF paths.

| Column         | Type         | Constraints                    | Description                |
|----------------|--------------|--------------------------------|----------------------------|
| receipt_id     | INT          | PRIMARY KEY, AUTO_INCREMENT    | Unique receipt identifier  |
| booking_id     | INT          | NOT NULL, UNIQUE, FOREIGN KEY  | Reference to bookings      |
| receipt_number | VARCHAR(20)  | NOT NULL, UNIQUE               | Receipt number             |
| generated_at   | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP      | Receipt generation date    |
| pdf_path       | VARCHAR(255) | NULL                           | Path to PDF file           |

**Foreign Keys**:
- `booking_id` → `bookings(booking_id)` ON DELETE CASCADE

**Indexes**:
- PRIMARY KEY on `receipt_id`
- INDEX on `booking_id`
- INDEX on `receipt_number`

---

### 6. CONTACTS Table

Stores contact form submissions.

| Column       | Type         | Constraints                    | Description                |
|--------------|--------------|--------------------------------|----------------------------|
| contact_id   | INT          | PRIMARY KEY, AUTO_INCREMENT    | Unique contact identifier  |
| name         | VARCHAR(100) | NOT NULL                       | Sender's name              |
| email        | VARCHAR(100) | NOT NULL                       | Sender's email             |
| subject      | VARCHAR(200) | NULL                           | Message subject            |
| message      | TEXT         | NOT NULL                       | Message content            |
| submitted_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP      | Submission date            |
| status       | ENUM         | DEFAULT 'new'                  | Message status             |

**Status Values**: 'new', 'in_progress', 'resolved'

**Indexes**:
- PRIMARY KEY on `contact_id`
- INDEX on `email`
- INDEX on `status`

---

## Relationships

### One-to-Many Relationships

1. **Users → Bookings** (1:N)
   - One user can have multiple bookings
   - Each booking belongs to one user

2. **Flights → Bookings** (1:N)
   - One flight can have multiple bookings
   - Each booking is for one flight

### One-to-One Relationships

1. **Bookings → Payments** (1:1)
   - Each booking has exactly one payment
   - Each payment is for one booking

2. **Bookings → Receipts** (1:1)
   - Each booking has exactly one receipt
   - Each receipt is for one booking

---

## Database Integrity Features

### Referential Integrity
- All foreign keys use `ON DELETE CASCADE`
- Ensures data consistency when parent records are deleted

### Data Validation
- CHECK constraints on prices and seat counts
- ENUM types for status fields
- UNIQUE constraints on email, booking references, etc.

### Indexing Strategy
- Primary keys on all tables
- Foreign key indexes for join performance
- Additional indexes on frequently queried columns

---

## Sample Queries

### Get User's Bookings with Flight Details
```sql
SELECT 
    b.booking_reference,
    b.passenger_name,
    f.flight_number,
    f.airline,
    f.origin,
    f.destination,
    f.departure_time,
    b.status
FROM bookings b
JOIN flights f ON b.flight_id = f.flight_id
WHERE b.user_id = ?
ORDER BY b.booking_date DESC;
```

### Get Available Flights
```sql
SELECT * FROM flights
WHERE status = 'scheduled'
  AND available_seats > 0
  AND departure_time > NOW()
ORDER BY departure_time ASC;
```

### Get Complete Receipt Data
```sql
SELECT 
    r.receipt_number,
    r.generated_at,
    b.booking_reference,
    b.passenger_name,
    b.passenger_email,
    f.flight_number,
    f.airline,
    f.origin,
    f.destination,
    f.departure_time,
    p.amount,
    p.payment_method,
    p.transaction_id
FROM receipts r
JOIN bookings b ON r.booking_id = b.booking_id
JOIN flights f ON b.flight_id = f.flight_id
JOIN payments p ON b.booking_id = p.booking_id
WHERE r.booking_id = ?;
```

---

## Backup and Maintenance

### Backup Database
```bash
mysqldump -u root -p flight_booking_db > backup.sql
```

### Restore Database
```bash
mysql -u root -p flight_booking_db < backup.sql
```

### View Table Statistics
```sql
SELECT 
    table_name,
    table_rows,
    data_length,
    index_length
FROM information_schema.tables
WHERE table_schema = 'flight_booking_db';
```

---

**Database Version**: 1.0  
**Last Updated**: 2025-01-01

