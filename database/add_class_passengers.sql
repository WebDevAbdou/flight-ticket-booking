-- Add class category and passenger count to database
-- This script is safe to run multiple times (uses IF NOT EXISTS logic)

USE flight_booking_db;

-- Add class columns to flights table if they don't exist
SET @dbname = DATABASE();
SET @tablename = 'flights';

-- Check and add economy_price column
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = @dbname 
    AND TABLE_NAME = @tablename 
    AND COLUMN_NAME = 'economy_price'
);

SET @query = IF(@col_exists = 0,
    'ALTER TABLE flights ADD COLUMN economy_price DECIMAL(10, 2) NOT NULL DEFAULT 0 AFTER price',
    'SELECT "economy_price column already exists" AS message'
);
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add business_price column
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = @dbname 
    AND TABLE_NAME = @tablename 
    AND COLUMN_NAME = 'business_price'
);

SET @query = IF(@col_exists = 0,
    'ALTER TABLE flights ADD COLUMN business_price DECIMAL(10, 2) NOT NULL DEFAULT 0 AFTER economy_price',
    'SELECT "business_price column already exists" AS message'
);
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add first_class_price column
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = @dbname 
    AND TABLE_NAME = @tablename 
    AND COLUMN_NAME = 'first_class_price'
);

SET @query = IF(@col_exists = 0,
    'ALTER TABLE flights ADD COLUMN first_class_price DECIMAL(10, 2) NOT NULL DEFAULT 0 AFTER business_price',
    'SELECT "first_class_price column already exists" AS message'
);
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing flights with class prices based on base price
UPDATE flights 
SET 
    economy_price = price,
    business_price = ROUND(price * 2.5, 2),
    first_class_price = ROUND(price * 4.0, 2)
WHERE economy_price = 0;

-- Add columns to bookings table
SET @tablename = 'bookings';

-- Check and add travel_class column
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = @dbname 
    AND TABLE_NAME = @tablename 
    AND COLUMN_NAME = 'travel_class'
);

SET @query = IF(@col_exists = 0,
    'ALTER TABLE bookings ADD COLUMN travel_class ENUM(''economy'', ''business'', ''first_class'') NOT NULL DEFAULT ''economy'' AFTER flight_id',
    'SELECT "travel_class column already exists" AS message'
);
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add number_of_passengers column
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = @dbname 
    AND TABLE_NAME = @tablename 
    AND COLUMN_NAME = 'number_of_passengers'
);

SET @query = IF(@col_exists = 0,
    'ALTER TABLE bookings ADD COLUMN number_of_passengers INT NOT NULL DEFAULT 1 AFTER travel_class',
    'SELECT "number_of_passengers column already exists" AS message'
);
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add total_price column
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = @dbname 
    AND TABLE_NAME = @tablename 
    AND COLUMN_NAME = 'total_price'
);

SET @query = IF(@col_exists = 0,
    'ALTER TABLE bookings ADD COLUMN total_price DECIMAL(10, 2) NOT NULL DEFAULT 0 AFTER number_of_passengers',
    'SELECT "total_price column already exists" AS message'
);
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'Database schema updated successfully!' AS status;

