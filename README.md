# Flight Ticket Booking System

A comprehensive flight booking web application built with JavaScript (Node.js/Express) and MySQL for a Database Course Final Year Project.

## 🎯 Project Overview

This is a fully functional flight ticket booking system that demonstrates:
- Normalized relational database design
- CRUD operations
- User authentication and authorization
- Real-world booking logic with transaction management
- Secure payment processing (simulated)
- PDF receipt generation

## 🛠️ Technology Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript

### Backend
- Node.js
- Express.js
- JWT (JSON Web Tokens) for authentication

### Database
- MySQL

### Key Libraries
- `mysql2` - MySQL database driver
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `pdfkit` - PDF receipt generation
- `dotenv` - Environment configuration
- `cors` - Cross-origin resource sharing

## 📋 Features

### User Features
- ✅ User registration and login
- ✅ Browse available flights (no login required)
- ✅ Advanced flight search with filters (origin, destination, date, price range)
- ✅ Book flights (login required)
- ✅ Secure payment processing
- ✅ View booking history
- ✅ Download PDF receipts
- ✅ Contact support form

### System Features
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Transaction management for bookings
- ✅ Automatic seat assignment
- ✅ Real-time seat availability checking
- ✅ Unique booking reference generation
- ✅ PDF receipt generation

## 📁 Project Structure

```
flight-ticket-booking/
├── database/
│   ├── schema.sql          # Database schema
│   └── seed.sql            # Sample flight data
├── server/
│   ├── config/
│   │   └── db.js           # Database configuration
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── flight.controller.js
│   │   ├── booking.controller.js
│   │   ├── payment.controller.js
│   │   ├── receipt.controller.js
│   │   └── contact.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── flight.routes.js
│   │   ├── booking.routes.js
│   │   ├── payment.routes.js
│   │   ├── receipt.routes.js
│   │   └── contact.routes.js
│   ├── utils/
│   │   └── receiptGenerator.js
│   └── server.js           # Main server file
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── auth.js
│   │   ├── home.js
│   │   ├── login.js
│   │   ├── register.js
│   │   ├── dashboard.js
│   │   ├── booking.js
│   │   ├── payment.js
│   │   ├── receipt.js
│   │   └── contact.js
│   ├── index.html          # Home page
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── booking.html
│   ├── payment.html
│   ├── receipt.html
│   ├── about.html
│   └── contact.html
├── receipts/               # Generated PDF receipts
├── .env.example            # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- MySQL Workbench (optional, for database management)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd flight-ticket-booking
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=flight_booking_db
DB_PORT=3306

PORT=3000

JWT_SECRET=your_secret_key_here

NODE_ENV=development
```

### Step 4: Set Up Database
1. Open MySQL Workbench or MySQL command line
2. Run the schema file:
```bash
mysql -u root -p < database/schema.sql
```

3. (Optional) Load sample flight data:
```bash
mysql -u root -p flight_booking_db < database/seed.sql
```

### Step 5: Start the Server
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

### Step 6: Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

## 📄 Available Pages

1. **Home** (`/`) - Search and browse flights
2. **Login** (`/login`) - User login
3. **Register** (`/register`) - User registration
4. **Dashboard** (`/dashboard`) - View bookings (protected)
5. **Booking** (`/booking`) - Book a flight (protected)
6. **Payment** (`/payment`) - Process payment (protected)
7. **Receipt** (`/receipt`) - View and download receipt (protected)
8. **About** (`/about`) - About the system
9. **Contact** (`/contact`) - Contact support

## 🗄️ Database Schema

### Tables
- `users` - User accounts
- `flights` - Flight information
- `bookings` - Flight bookings
- `payments` - Payment records
- `receipts` - Receipt records
- `contacts` - Contact form submissions

### Key Relationships
- `bookings.user_id` → `users.user_id`
- `bookings.flight_id` → `flights.flight_id`
- `payments.booking_id` → `bookings.booking_id`
- `receipts.booking_id` → `bookings.booking_id`

## 🔐 Security Features

- Password hashing using bcryptjs
- JWT-based authentication
- Protected API routes
- SQL injection prevention (parameterized queries)
- Input validation

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Flights
- `GET /api/flights` - Get all flights (with filters)
- `GET /api/flights/:id` - Get flight by ID
- `GET /api/flights/origins` - Get unique origins
- `GET /api/flights/destinations` - Get unique destinations

### Bookings
- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings` - Get user bookings (protected)
- `GET /api/bookings/:id` - Get booking by ID (protected)

### Payments
- `POST /api/payments` - Process payment (protected)

### Receipts
- `GET /api/receipts/:bookingId` - Get receipt (protected)
- `GET /api/receipts/:bookingId/download` - Download PDF (protected)

### Contact
- `POST /api/contact` - Submit contact form

## 👨‍💻 Usage Guide

### For Users

1. **Browse Flights**: Visit the home page to search and view available flights
2. **Register**: Create an account to book flights
3. **Login**: Sign in with your credentials
4. **Book Flight**: Select a flight and enter passenger details
5. **Payment**: Complete payment with card details (simulated)
6. **Receipt**: View and download your booking receipt
7. **Dashboard**: Manage all your bookings

### For Developers

1. **Add Flights**: Insert flight data directly into the database
2. **Monitor Bookings**: Use MySQL Workbench to view all bookings
3. **Check Payments**: View payment records in the database
4. **Contact Messages**: Review contact form submissions

## 🧪 Testing

### Test User Flow
1. Register a new account
2. Search for flights
3. Book a flight
4. Complete payment
5. Download receipt
6. View booking in dashboard

### Test Payment Cards (Simulated)
- Any 13-19 digit number works (e.g., 4111111111111111)
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits (e.g., 123)

## 📊 Academic Value

This project demonstrates:
- ✅ Normalized database design (3NF)
- ✅ Foreign key constraints
- ✅ Transaction management
- ✅ ACID properties
- ✅ Real-world business logic
- ✅ Authentication & authorization
- ✅ RESTful API design
- ✅ MVC architecture

## 🤝 Contributing

This is an academic project. For improvements or bug fixes, please create an issue or pull request.

## 📄 License

This project is created for educational purposes as a Database Course Final Year Project.

## 👤 Author

Database Course Final Year Project

## 🙏 Acknowledgments

- Node.js and Express.js communities
- MySQL documentation
- PDFKit library

---

**Note**: This is a simulated booking system for educational purposes. Payment processing is simulated and does not connect to real payment gateways.
