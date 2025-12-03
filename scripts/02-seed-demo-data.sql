-- Updated to use proper bcrypt hashed password for demo admin
-- Demo admin password 'demo123' hashed with bcrypt
-- Hash: $2a$10$Yq9u6QiRK5RHBl5uXYB7k.s6GKg0ZoVkqJGLW.VPeKb2c7O0m3k9K

INSERT INTO admins (email, password_hash, school_name)
VALUES ('admin@demo.com', '$2a$10$Yq9u6QiRK5RHBl5uXYB7k.s6GKg0ZoVkqJGLW.VPeKb2c7O0m3k9K', 'Demo School')
ON CONFLICT (email) DO NOTHING;

-- Create exam types for the demo admin
WITH demo_admin AS (
  SELECT id FROM admins WHERE email = 'admin@demo.com' LIMIT 1
)
INSERT INTO exam_types (admin_id, name, order_index, created_at, updated_at)
SELECT da.id, 'Quarterly', 1, NOW(), NOW() FROM demo_admin da
ON CONFLICT (admin_id, name) DO NOTHING;

WITH demo_admin AS (
  SELECT id FROM admins WHERE email = 'admin@demo.com' LIMIT 1
)
INSERT INTO exam_types (admin_id, name, order_index, created_at, updated_at)
SELECT da.id, 'Half-Yearly', 2, NOW(), NOW() FROM demo_admin da
ON CONFLICT (admin_id, name) DO NOTHING;

WITH demo_admin AS (
  SELECT id FROM admins WHERE email = 'admin@demo.com' LIMIT 1
)
INSERT INTO exam_types (admin_id, name, order_index, created_at, updated_at)
SELECT da.id, 'Annual', 3, NOW(), NOW() FROM demo_admin da
ON CONFLICT (admin_id, name) DO NOTHING;

-- Create demo student
WITH demo_admin AS (
  SELECT id FROM admins WHERE email = 'admin@demo.com' LIMIT 1
)
INSERT INTO students (admin_id, register_no, name, dob, class, section, email, created_at, updated_at)
SELECT da.id, 'DEMO001', 'Demo Student', '2005-01-15'::date, '10', 'A', 'student@demo.com', NOW(), NOW() 
FROM demo_admin da
ON CONFLICT (register_no) DO NOTHING;

-- Create demo subjects
WITH demo_admin AS (
  SELECT id FROM admins WHERE email = 'admin@demo.com' LIMIT 1
)
INSERT INTO subjects (admin_id, name, max_marks, created_at, updated_at)
SELECT da.id, 'Mathematics', 100, NOW(), NOW() FROM demo_admin da
ON CONFLICT (admin_id, name) DO NOTHING;

WITH demo_admin AS (
  SELECT id FROM admins WHERE email = 'admin@demo.com' LIMIT 1
)
INSERT INTO subjects (admin_id, name, max_marks, created_at, updated_at)
SELECT da.id, 'English', 100, NOW(), NOW() FROM demo_admin da
ON CONFLICT (admin_id, name) DO NOTHING;

WITH demo_admin AS (
  SELECT id FROM admins WHERE email = 'admin@demo.com' LIMIT 1
)
INSERT INTO subjects (admin_id, name, max_marks, created_at, updated_at)
SELECT da.id, 'Science', 100, NOW(), NOW() FROM demo_admin da
ON CONFLICT (admin_id, name) DO NOTHING;
