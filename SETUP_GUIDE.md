# Flight Booking System - Complete Setup Guide

This guide will walk you through setting up the Flight Booking System from scratch.

## Prerequisites Installation

### 1. Install Node.js
- Download from: https://nodejs.org/
- Recommended version: v18 or higher
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### 2. Install MySQL
- Download from: https://dev.mysql.com/downloads/mysql/
- During installation, remember your root password
- Verify installation:
  ```bash
  mysql --version
  ```

### 3. Install MySQL Workbench (Optional but Recommended)
- Download from: https://dev.mysql.com/downloads/workbench/
- This provides a GUI for database management

## Project Setup

### Step 1: Navigate to Project Directory
```bash
cd flight-ticket-booking
```

### Step 2: Install Node.js Dependencies
```bash
npm install
```

This will install all required packages:
- express
- mysql2
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- pdfkit

### Step 3: Configure Environment Variables

1. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

2. Open `.env` and update with your settings:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=flight_booking_db
DB_PORT=3306

# Server Configuration
PORT=3000

# JWT Secret (change this to a random string)
JWT_SECRET=my_super_secret_jwt_key_12345

# Environment
NODE_ENV=development
```

**Important**: Replace `YOUR_MYSQL_PASSWORD_HERE` with your actual MySQL root password.

### Step 4: Set Up the Database

#### Option A: Using MySQL Command Line

1. Open terminal/command prompt
2. Login to MySQL:
```bash
mysql -u root -p
```
3. Enter your MySQL password
4. Run the schema file:
```sql
source database/schema.sql
```
5. Load sample flight data:
```sql
source database/seed.sql
```
6. Exit MySQL:
```sql
exit;
```

#### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Click "File" → "Open SQL Script"
4. Navigate to `database/schema.sql` and open it
5. Click the lightning bolt icon to execute
6. Repeat for `database/seed.sql`

### Step 5: Verify Database Setup

1. Login to MySQL:
```bash
mysql -u root -p
```

2. Check if database exists:
```sql
SHOW DATABASES;
USE flight_booking_db;
SHOW TABLES;
```

You should see these tables:
- users
- flights
- bookings
- payments
- receipts
- contacts

3. Check sample flights:
```sql
SELECT * FROM flights LIMIT 5;
```

### Step 6: Start the Server

```bash
npm start
```

You should see:
```
✅ Database connected successfully
🚀 Server is running on http://localhost:3000
```

For development with auto-restart on file changes:
```bash
npm run dev
```

### Step 7: Access the Application

Open your web browser and go to:
```
http://localhost:3000
```

## Testing the Application

### 1. Register a New User
- Click "Login" → "Register here"
- Fill in the registration form
- Submit

### 2. Browse Flights
- Go to home page
- Use search filters to find flights
- Try different combinations of origin, destination, date, and price

### 3. Book a Flight
- Select a flight and click "Book Now"
- Fill in passenger details
- Proceed to payment

### 4. Complete Payment
- Enter any test card number (e.g., 4111111111111111)
- Enter expiry date (e.g., 12/25)
- Enter CVV (e.g., 123)
- Complete payment

### 5. View Receipt
- Download the PDF receipt
- Check your dashboard for booking history

## Common Issues and Solutions

### Issue 1: Database Connection Failed
**Error**: `❌ Database connection failed`

**Solution**:
- Check if MySQL is running
- Verify credentials in `.env` file
- Ensure database exists: `CREATE DATABASE flight_booking_db;`

### Issue 2: Port Already in Use
**Error**: `Port 3000 is already in use`

**Solution**:
- Change PORT in `.env` to another number (e.g., 3001)
- Or kill the process using port 3000

### Issue 3: Module Not Found
**Error**: `Cannot find module 'express'`

**Solution**:
- Run `npm install` again
- Delete `node_modules` folder and run `npm install`

### Issue 4: JWT Secret Error
**Error**: `JWT_SECRET is not defined`

**Solution**:
- Make sure `.env` file exists
- Verify JWT_SECRET is set in `.env`

## Project Structure Overview

```
flight-ticket-booking/
├── database/           # Database files
├── server/            # Backend code
│   ├── config/       # Database configuration
│   ├── controllers/  # Business logic
│   ├── middleware/   # Authentication middleware
│   ├── routes/       # API routes
│   ├── utils/        # Utility functions
│   └── server.js     # Main server file
├── public/           # Frontend files
│   ├── css/         # Stylesheets
│   ├── js/          # JavaScript files
│   └── *.html       # HTML pages
└── receipts/        # Generated PDF receipts
```

## Next Steps

1. **Add More Flights**: Insert additional flight data into the database
2. **Customize Styling**: Modify `public/css/style.css`
3. **Test All Features**: Go through the complete booking flow
4. **Monitor Database**: Use MySQL Workbench to view data changes

## Support

For issues or questions:
1. Check this setup guide
2. Review the main README.md
3. Check the code comments
4. Verify all prerequisites are installed correctly

---

**Happy Coding! 🚀**

