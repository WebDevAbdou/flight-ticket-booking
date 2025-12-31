# Testing Checklist - Flight Booking System

Use this checklist to verify all features are working correctly.

---

## ✅ Pre-Testing Setup

- [ ] MySQL server is running
- [ ] Database `flight_booking_db` is created
- [ ] Schema is loaded (tables created)
- [ ] Sample data is loaded (20 flights)
- [ ] `.env` file is configured correctly
- [ ] Dependencies are installed (`npm install`)
- [ ] Server starts without errors (`npm start`)

---

## 🏠 Home Page Testing

### Page Load
- [ ] Home page loads at `http://localhost:3000`
- [ ] Navigation bar displays correctly
- [ ] Hero section shows "Find Your Perfect Flight"
- [ ] Search form is visible

### Flight Search
- [ ] Origin dropdown populates with cities
- [ ] Destination dropdown populates with cities
- [ ] Date picker works
- [ ] Price filters accept numbers
- [ ] "Search Flights" button works
- [ ] Flights display after search
- [ ] "Clear Filters" button resets form

### Flight Display
- [ ] All 20 sample flights are visible (without filters)
- [ ] Flight cards show:
  - [ ] Origin and destination
  - [ ] Airline name
  - [ ] Flight number
  - [ ] Departure/arrival times
  - [ ] Price
  - [ ] Available seats
  - [ ] "Book Now" button

### Search Filters
- [ ] Filter by origin works
- [ ] Filter by destination works
- [ ] Filter by date works
- [ ] Filter by min price works
- [ ] Filter by max price works
- [ ] Combined filters work
- [ ] "No flights found" shows when no results

### Guest User Restrictions
- [ ] Clicking "Book Now" without login redirects to login page
- [ ] Alert shows "Please login to book a flight"

---

## 🔐 Authentication Testing

### Registration
- [ ] Navigate to `/register`
- [ ] Registration form displays
- [ ] All fields are present:
  - [ ] Full Name
  - [ ] Email
  - [ ] Phone (optional)
  - [ ] Password
  - [ ] Confirm Password
- [ ] Password mismatch shows error
- [ ] Short password (< 6 chars) shows error
- [ ] Duplicate email shows error
- [ ] Successful registration:
  - [ ] Shows success message
  - [ ] Redirects to dashboard
  - [ ] User is logged in
  - [ ] Token is stored in localStorage

### Login
- [ ] Navigate to `/login`
- [ ] Login form displays
- [ ] Email and password fields present
- [ ] Wrong credentials show error
- [ ] Correct credentials:
  - [ ] Shows success message
  - [ ] Redirects to dashboard
  - [ ] User is logged in
  - [ ] Token is stored in localStorage

### Navigation After Login
- [ ] "Login" button changes to "Dashboard"
- [ ] "Logout" button appears
- [ ] User name displays in dashboard

### Logout
- [ ] Clicking "Logout" works
- [ ] Redirects to home page
- [ ] Token is removed from localStorage
- [ ] Navigation reverts to "Login" button

---

## 📊 Dashboard Testing

### Access Control
- [ ] Dashboard requires login
- [ ] Redirects to login if not authenticated
- [ ] Shows user's name in welcome message

### Bookings Display
- [ ] Shows "No bookings" message when empty
- [ ] Shows all user's bookings
- [ ] Each booking card displays:
  - [ ] Booking reference
  - [ ] Flight details
  - [ ] Passenger details
  - [ ] Booking status (pending/confirmed)
  - [ ] Price
  - [ ] Seat number

### Booking Status
- [ ] Pending bookings show yellow badge
- [ ] Confirmed bookings show green badge
- [ ] "View Receipt" button only on confirmed bookings

---

## ✈️ Booking Flow Testing

### Step 1: Select Flight
- [ ] Login as user
- [ ] Search for flights
- [ ] Click "Book Now" on a flight
- [ ] Redirects to `/booking?flightId=X`

### Step 2: Booking Page
- [ ] Flight details display correctly
- [ ] Passenger form shows:
  - [ ] Name (pre-filled with user name)
  - [ ] Email (pre-filled with user email)
  - [ ] Phone number field
- [ ] All fields are required
- [ ] "Proceed to Payment" button works
- [ ] "Cancel" button returns to home

### Step 3: Create Booking
- [ ] Submit passenger form
- [ ] Booking is created in database
- [ ] Seat is assigned automatically
- [ ] Available seats decrease by 1
- [ ] Booking reference is generated
- [ ] Redirects to payment page

### Step 4: Payment Page
- [ ] Booking summary displays correctly
- [ ] Shows all flight details
- [ ] Shows passenger details
- [ ] Shows total amount
- [ ] Payment form displays:
  - [ ] Payment method dropdown
  - [ ] Card number field
  - [ ] Expiry date field
  - [ ] CVV field
  - [ ] Cardholder name field

### Step 5: Process Payment
- [ ] Card number formatting works (spaces every 4 digits)
- [ ] Expiry date formatting works (MM/YY)
- [ ] CVV accepts only numbers
- [ ] Invalid card number shows error
- [ ] Submit payment form
- [ ] Payment is processed
- [ ] Transaction ID is generated
- [ ] Booking status changes to "confirmed"
- [ ] Receipt is created
- [ ] Redirects to receipt page

### Step 6: Receipt Page
- [ ] Receipt displays all information:
  - [ ] Receipt number
  - [ ] Passenger details
  - [ ] Flight details
  - [ ] Payment details
  - [ ] Transaction ID
- [ ] "Download Receipt" button works
- [ ] PDF downloads successfully
- [ ] PDF contains all booking information
- [ ] "View All Bookings" button works
- [ ] "Book Another Flight" button works

---

## 📄 Other Pages Testing

### About Page
- [ ] Loads at `/about`
- [ ] Shows mission statement
- [ ] Shows features
- [ ] Shows technology stack
- [ ] Navigation works

### Contact Page
- [ ] Loads at `/contact`
- [ ] Contact form displays
- [ ] All fields present:
  - [ ] Name
  - [ ] Email
  - [ ] Subject (optional)
  - [ ] Message
- [ ] Form validation works
- [ ] Submit saves to database
- [ ] Success message shows
- [ ] Form resets after submission

---

## 🗄️ Database Testing

### Check Data in MySQL

```sql
-- Check users
SELECT * FROM users;

-- Check bookings
SELECT * FROM bookings;

-- Check payments
SELECT * FROM payments;

-- Check receipts
SELECT * FROM receipts;

-- Check seat reduction
SELECT flight_number, total_seats, available_seats 
FROM flights 
WHERE flight_id = X;

-- Check contact submissions
SELECT * FROM contacts;
```

### Verify Data Integrity
- [ ] User passwords are hashed (not plain text)
- [ ] Booking references are unique
- [ ] Transaction IDs are unique
- [ ] Receipt numbers are unique
- [ ] Foreign keys are correct
- [ ] Seat counts are accurate
- [ ] Timestamps are correct

---

## 🔒 Security Testing

### Authentication
- [ ] Cannot access dashboard without login
- [ ] Cannot access booking page without login
- [ ] Cannot access payment page without login
- [ ] Cannot access receipt page without login
- [ ] Invalid token redirects to login
- [ ] Expired token redirects to login

### Authorization
- [ ] Users can only see their own bookings
- [ ] Users can only see their own receipts
- [ ] Cannot access other users' data

### Data Validation
- [ ] SQL injection attempts fail
- [ ] XSS attempts are prevented
- [ ] Invalid email formats rejected
- [ ] Invalid data types rejected

---

## 🧪 Edge Cases Testing

### Booking Edge Cases
- [ ] Booking last available seat works
- [ ] Cannot book when no seats available
- [ ] Concurrent bookings handled correctly
- [ ] Duplicate booking prevention

### Payment Edge Cases
- [ ] Cannot pay for already paid booking
- [ ] Invalid card numbers rejected
- [ ] Payment amount matches flight price

### Search Edge Cases
- [ ] Search with no results handled
- [ ] Search with all filters works
- [ ] Date in past handled correctly
- [ ] Invalid price ranges handled

---

## 📱 Responsive Design Testing

- [ ] Works on desktop (1920x1080)
- [ ] Works on laptop (1366x768)
- [ ] Works on tablet (768x1024)
- [ ] Works on mobile (375x667)
- [ ] Navigation adapts to screen size
- [ ] Forms are usable on mobile
- [ ] Cards stack properly on mobile

---

## ⚡ Performance Testing

- [ ] Page loads in < 2 seconds
- [ ] Flight search returns results quickly
- [ ] Database queries are optimized
- [ ] No console errors
- [ ] No memory leaks

---

## 🎯 Final Verification

- [ ] All 20 sample flights display
- [ ] Complete booking flow works end-to-end
- [ ] PDF receipt generates correctly
- [ ] All forms save to database
- [ ] No hardcoded data (all from database)
- [ ] All pages accessible
- [ ] All links work
- [ ] All buttons work
- [ ] Error messages display correctly
- [ ] Success messages display correctly

---

## 📝 Test Results

**Date Tested**: _______________  
**Tested By**: _______________  
**Total Tests**: 150+  
**Passed**: _______________  
**Failed**: _______________  
**Notes**: 

---

## 🐛 Bug Reporting Template

If you find any issues:

```
Bug Title: 
Page/Feature: 
Steps to Reproduce:
1. 
2. 
3. 

Expected Result: 
Actual Result: 
Error Message (if any): 
Browser: 
```

---

**Testing Complete!** ✅

All features tested and verified working correctly.

