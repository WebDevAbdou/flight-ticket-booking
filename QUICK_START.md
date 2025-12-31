# Quick Start Guide - Flight Booking System

Get your flight booking system up and running in 5 minutes!

## ⚡ Quick Setup (5 Steps)

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Configure Database Password
Edit the `.env` file and set your MySQL password:
```env
DB_PASSWORD=your_mysql_password_here
```

### 3️⃣ Create Database
Open MySQL and run:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p flight_booking_db < database/seed.sql
```

Or using MySQL Workbench:
- Open and execute `database/schema.sql`
- Open and execute `database/seed.sql`

### 4️⃣ Start the Server
```bash
npm start
```

### 5️⃣ Open Browser
Navigate to: **http://localhost:3000**

---

## 🎯 Test the System

### Quick Test Flow:
1. **Register** a new account
2. **Search** for flights (try "New York" to "Los Angeles")
3. **Book** a flight
4. **Pay** with test card: `4111111111111111`
5. **Download** your receipt

---

## 📊 Sample Data Included

The system comes with **20 sample flights** including:
- New York ↔ Los Angeles
- Chicago ↔ Miami
- San Francisco ↔ Seattle
- And more!

All flights are scheduled for January-February 2025.

---

## 🔑 Default Configuration

- **Server Port**: 3000
- **Database**: flight_booking_db
- **Sample Flights**: 20 flights
- **No hardcoded users** (register to create)

---

## 🆘 Troubleshooting

**Can't connect to database?**
- Check MySQL is running
- Verify password in `.env`

**Port 3000 in use?**
- Change `PORT=3001` in `.env`

**Missing modules?**
- Run `npm install` again

---

## 📚 Full Documentation

For detailed setup instructions, see:
- `README.md` - Complete project documentation
- `SETUP_GUIDE.md` - Step-by-step setup guide

---

## 🎓 Project Features

✅ User Registration & Login  
✅ Flight Search & Filters  
✅ Real-time Seat Availability  
✅ Secure Booking System  
✅ Payment Processing (Simulated)  
✅ PDF Receipt Generation  
✅ User Dashboard  
✅ Contact Support Form  

---

**Ready to fly? 🛫**

Start the server and visit http://localhost:3000

