-- Repair Flyway checksum for V21 migration
-- This updates the checksum in flyway_schema_history to match the current file

-- First, let's see what the current checksum is
SELECT version, description, checksum, installed_on 
FROM flyway_schema_history 
WHERE version = '21';

-- Update the checksum for V21
-- The new checksum is calculated by Flyway based on the file content
-- We'll use Flyway's repair command, but if that doesn't work, we can manually update
-- Note: The checksum value -151168186 is the new calculated checksum

-- Option 1: Use Flyway repair (recommended)
-- Run: mvn flyway:repair (with proper database credentials)

-- Option 2: Manually update checksum (if repair doesn't work)
-- UPDATE flyway_schema_history 
-- SET checksum = -151168186 
-- WHERE version = '21';

-- However, the safest way is to use Flyway repair via Spring Boot
-- Add this to application.properties temporarily:
-- spring.flyway.repair-on-migrate=true
