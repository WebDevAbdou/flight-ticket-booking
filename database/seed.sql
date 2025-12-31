-- Sample Data for Flight Booking System
-- This file provides initial data for testing purposes

USE flight_booking_db;

-- Insert Sample Flights
-- Note: Flights scheduled for January-February 2026
-- Prices: economy_price (base), business_price (2.5x), first_class_price (4x)
INSERT INTO flights (flight_number, airline, origin, destination, departure_time, arrival_time, price, economy_price, business_price, first_class_price, total_seats, available_seats, status) VALUES
('AA101', 'American Airlines', 'New York (JFK)', 'Los Angeles (LAX)', '2026-01-15 08:00:00', '2026-01-15 11:30:00', 299.99, 299.99, 749.98, 1199.96, 180, 180, 'scheduled'),
('UA202', 'United Airlines', 'Chicago (ORD)', 'Miami (MIA)', '2026-01-16 09:30:00', '2026-01-16 13:45:00', 249.99, 249.99, 624.98, 999.96, 150, 150, 'scheduled'),
('DL303', 'Delta Airlines', 'San Francisco (SFO)', 'Seattle (SEA)', '2026-01-17 14:00:00', '2026-01-17 16:30:00', 179.99, 179.99, 449.98, 719.96, 120, 120, 'scheduled'),
('SW404', 'Southwest Airlines', 'Las Vegas (LAS)', 'Denver (DEN)', '2026-01-18 10:15:00', '2026-01-18 12:45:00', 159.99, 159.99, 399.98, 639.96, 140, 140, 'scheduled'),
('AA505', 'American Airlines', 'Boston (BOS)', 'Orlando (MCO)', '2026-01-19 07:30:00', '2026-01-19 11:00:00', 219.99, 219.99, 549.98, 879.96, 160, 160, 'scheduled'),
('UA606', 'United Airlines', 'Los Angeles (LAX)', 'New York (JFK)', '2026-01-20 15:00:00', '2026-01-20 23:30:00', 329.99, 329.99, 824.98, 1319.96, 180, 180, 'scheduled'),
('DL707', 'Delta Airlines', 'Atlanta (ATL)', 'Dallas (DFW)', '2026-01-21 11:00:00', '2026-01-21 13:30:00', 189.99, 189.99, 474.98, 759.96, 130, 130, 'scheduled'),
('SW808', 'Southwest Airlines', 'Phoenix (PHX)', 'San Diego (SAN)', '2026-01-22 16:30:00', '2026-01-22 17:45:00', 129.99, 129.99, 324.98, 519.96, 110, 110, 'scheduled'),
('AA909', 'American Airlines', 'Miami (MIA)', 'Chicago (ORD)', '2026-01-23 12:00:00', '2026-01-23 15:30:00', 269.99, 269.99, 674.98, 1079.96, 170, 170, 'scheduled'),
('UA1010', 'United Airlines', 'Seattle (SEA)', 'San Francisco (SFO)', '2026-01-24 08:45:00', '2026-01-24 11:15:00', 169.99, 169.99, 424.98, 679.96, 125, 125, 'scheduled'),
('DL1111', 'Delta Airlines', 'Denver (DEN)', 'Las Vegas (LAS)', '2026-01-25 13:30:00', '2026-01-25 15:00:00', 149.99, 149.99, 374.98, 599.96, 135, 135, 'scheduled'),
('SW1212', 'Southwest Airlines', 'Orlando (MCO)', 'Boston (BOS)', '2026-01-26 17:00:00', '2026-01-26 20:30:00', 239.99, 239.99, 599.98, 959.96, 145, 145, 'scheduled'),
('AA1313', 'American Airlines', 'Dallas (DFW)', 'Atlanta (ATL)', '2026-01-27 09:00:00', '2026-01-27 12:30:00', 199.99, 199.99, 499.98, 799.96, 155, 155, 'scheduled'),
('UA1414', 'United Airlines', 'San Diego (SAN)', 'Phoenix (PHX)', '2026-01-28 14:45:00', '2026-01-28 16:00:00', 139.99, 139.99, 349.98, 559.96, 115, 115, 'scheduled'),
('DL1515', 'Delta Airlines', 'New York (JFK)', 'Chicago (ORD)', '2026-01-29 10:30:00', '2026-01-29 12:45:00', 209.99, 209.99, 524.98, 839.96, 165, 165, 'scheduled'),
('SW1616', 'Southwest Airlines', 'Los Angeles (LAX)', 'Seattle (SEA)', '2026-01-30 18:00:00', '2026-01-30 21:00:00', 259.99, 259.99, 649.98, 1039.96, 150, 150, 'scheduled'),
('AA1717', 'American Airlines', 'Chicago (ORD)', 'San Francisco (SFO)', '2026-01-31 06:30:00', '2026-01-31 09:30:00', 289.99, 289.99, 724.98, 1159.96, 175, 175, 'scheduled'),
('UA1818', 'United Airlines', 'Miami (MIA)', 'Denver (DEN)', '2026-02-01 11:30:00', '2026-02-01 14:45:00', 279.99, 279.99, 699.98, 1119.96, 160, 160, 'scheduled'),
('DL1919', 'Delta Airlines', 'Boston (BOS)', 'Las Vegas (LAS)', '2026-02-02 15:15:00', '2026-02-02 18:45:00', 319.99, 319.99, 799.98, 1279.96, 170, 170, 'scheduled'),
('SW2020', 'Southwest Airlines', 'Atlanta (ATL)', 'Los Angeles (LAX)', '2026-02-03 07:00:00', '2026-02-03 09:30:00', 299.99, 299.99, 749.98, 1199.96, 180, 180, 'scheduled');

-- Note: User data will be created when users register through the application
-- No hardcoded user credentials for security reasons

