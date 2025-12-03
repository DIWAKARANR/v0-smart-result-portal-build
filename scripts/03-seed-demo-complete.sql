-- Clean slate: delete demo data if it exists
DELETE FROM results WHERE admin_id IN (SELECT id FROM admins WHERE email = 'admin@demo.com');
DELETE FROM student_rankings WHERE admin_id IN (SELECT id FROM admins WHERE email = 'admin@demo.com');
DELETE FROM exams WHERE admin_id IN (SELECT id FROM admins WHERE email = 'admin@demo.com');
DELETE FROM exam_types WHERE admin_id IN (SELECT id FROM admins WHERE email = 'admin@demo.com');
DELETE FROM student_badges WHERE student_id IN (SELECT id FROM students WHERE admin_id IN (SELECT id FROM admins WHERE email = 'admin@demo.com'));
DELETE FROM students WHERE admin_id IN (SELECT id FROM admins WHERE email = 'admin@demo.com');
DELETE FROM subjects WHERE admin_id IN (SELECT id FROM admins WHERE email = 'admin@demo.com');
DELETE FROM ai_feedback WHERE admin_id IN (SELECT id FROM admins WHERE email = 'admin@demo.com');
DELETE FROM grade_predictions WHERE admin_id IN (SELECT id FROM admins WHERE email = 'admin@demo.com');

-- Ensure admin exists first
INSERT INTO admins (email, password_hash, school_name) 
VALUES ('admin@demo.com', '$2a$10$Yq9u6QiRK5RHBl5uXYB7k.s6GKg0ZoVkqJGLW.VPeKb2c7O0m3k9K', 'Demo School')
ON CONFLICT (email) DO NOTHING;

-- Store admin ID in a variable for all subsequent queries
DO $$ 
DECLARE
  v_admin_id UUID;
BEGIN
  -- Get the admin ID
  SELECT id INTO v_admin_id FROM admins WHERE email = 'admin@demo.com' LIMIT 1;

  -- Insert exam types
  INSERT INTO exam_types (admin_id, name, order_index) 
  VALUES 
    (v_admin_id, 'Quarterly', 1),
    (v_admin_id, 'Half-Yearly', 2),
    (v_admin_id, 'Annual', 3)
  ON CONFLICT (admin_id, name) DO NOTHING;

  -- Insert demo students (5 students with varied marks)
  INSERT INTO students (admin_id, register_no, name, dob, class, section)
  VALUES
    (v_admin_id, 'DEMO001', 'Rahul Sharma', '2005-01-15'::DATE, '10', 'A'),
    (v_admin_id, 'STU002', 'Priya Patel', '2005-02-20'::DATE, '10', 'A'),
    (v_admin_id, 'STU003', 'Arjun Kumar', '2005-03-25'::DATE, '10', 'B'),
    (v_admin_id, 'STU004', 'Anjali Singh', '2005-04-10'::DATE, '10', 'B'),
    (v_admin_id, 'STU005', 'Vikram Reddy', '2005-05-05'::DATE, '10', 'A')
  ON CONFLICT (register_no) DO NOTHING;

  -- Insert subjects
  INSERT INTO subjects (admin_id, name, max_marks)
  VALUES
    (v_admin_id, 'Mathematics', 100),
    (v_admin_id, 'English', 100),
    (v_admin_id, 'Science', 100),
    (v_admin_id, 'Social Studies', 100)
  ON CONFLICT (admin_id, name) DO NOTHING;

  -- Insert demo exam
  INSERT INTO exams (admin_id, exam_type_id, name, exam_date, is_published)
  SELECT 
    v_admin_id,
    (SELECT id FROM exam_types WHERE admin_id = v_admin_id AND name = 'Quarterly' LIMIT 1),
    'Quarterly Exam 2025',
    '2025-01-20'::DATE,
    true
  WHERE NOT EXISTS (SELECT 1 FROM exams WHERE admin_id = v_admin_id AND name = 'Quarterly Exam 2025');

  -- Insert sample results with realistic marks
  INSERT INTO results (admin_id, exam_id, student_id, subject_id, marks_obtained, max_marks, grade)
  SELECT 
    v_admin_id,
    (SELECT id FROM exams WHERE admin_id = v_admin_id AND name = 'Quarterly Exam 2025' LIMIT 1),
    s.id,
    subj.id,
    CASE 
      WHEN s.register_no = 'DEMO001' THEN CASE subj.name WHEN 'Mathematics' THEN 95 WHEN 'English' THEN 88 WHEN 'Science' THEN 92 ELSE 85 END
      WHEN s.register_no = 'STU002' THEN CASE subj.name WHEN 'Mathematics' THEN 78 WHEN 'English' THEN 85 WHEN 'Science' THEN 80 ELSE 82 END
      WHEN s.register_no = 'STU003' THEN CASE subj.name WHEN 'Mathematics' THEN 72 WHEN 'English' THEN 75 WHEN 'Science' THEN 78 ELSE 76 END
      WHEN s.register_no = 'STU004' THEN CASE subj.name WHEN 'Mathematics' THEN 88 WHEN 'English' THEN 90 WHEN 'Science' THEN 87 ELSE 89 END
      ELSE CASE subj.name WHEN 'Mathematics' THEN 92 WHEN 'English' THEN 87 WHEN 'Science' THEN 94 ELSE 91 END
    END,
    100,
    CASE 
      WHEN CASE 
        WHEN s.register_no = 'DEMO001' THEN CASE subj.name WHEN 'Mathematics' THEN 95 WHEN 'English' THEN 88 WHEN 'Science' THEN 92 ELSE 85 END
        WHEN s.register_no = 'STU002' THEN CASE subj.name WHEN 'Mathematics' THEN 78 WHEN 'English' THEN 85 WHEN 'Science' THEN 80 ELSE 82 END
        WHEN s.register_no = 'STU003' THEN CASE subj.name WHEN 'Mathematics' THEN 72 WHEN 'English' THEN 75 WHEN 'Science' THEN 78 ELSE 76 END
        WHEN s.register_no = 'STU004' THEN CASE subj.name WHEN 'Mathematics' THEN 88 WHEN 'English' THEN 90 WHEN 'Science' THEN 87 ELSE 89 END
        ELSE CASE subj.name WHEN 'Mathematics' THEN 92 WHEN 'English' THEN 87 WHEN 'Science' THEN 94 ELSE 91 END
      END >= 90 THEN 'A'
      WHEN CASE 
        WHEN s.register_no = 'DEMO001' THEN CASE subj.name WHEN 'Mathematics' THEN 95 WHEN 'English' THEN 88 WHEN 'Science' THEN 92 ELSE 85 END
        WHEN s.register_no = 'STU002' THEN CASE subj.name WHEN 'Mathematics' THEN 78 WHEN 'English' THEN 85 WHEN 'Science' THEN 80 ELSE 82 END
        WHEN s.register_no = 'STU003' THEN CASE subj.name WHEN 'Mathematics' THEN 72 WHEN 'English' THEN 75 WHEN 'Science' THEN 78 ELSE 76 END
        WHEN s.register_no = 'STU004' THEN CASE subj.name WHEN 'Mathematics' THEN 88 WHEN 'English' THEN 90 WHEN 'Science' THEN 87 ELSE 89 END
        ELSE CASE subj.name WHEN 'Mathematics' THEN 92 WHEN 'English' THEN 87 WHEN 'Science' THEN 94 ELSE 91 END
      END >= 80 THEN 'B'
      WHEN CASE 
        WHEN s.register_no = 'DEMO001' THEN CASE subj.name WHEN 'Mathematics' THEN 95 WHEN 'English' THEN 88 WHEN 'Science' THEN 92 ELSE 85 END
        WHEN s.register_no = 'STU002' THEN CASE subj.name WHEN 'Mathematics' THEN 78 WHEN 'English' THEN 85 WHEN 'Science' THEN 80 ELSE 82 END
        WHEN s.register_no = 'STU003' THEN CASE subj.name WHEN 'Mathematics' THEN 72 WHEN 'English' THEN 75 WHEN 'Science' THEN 78 ELSE 76 END
        WHEN s.register_no = 'STU004' THEN CASE subj.name WHEN 'Mathematics' THEN 88 WHEN 'English' THEN 90 WHEN 'Science' THEN 87 ELSE 89 END
        ELSE CASE subj.name WHEN 'Mathematics' THEN 92 WHEN 'English' THEN 87 WHEN 'Science' THEN 94 ELSE 91 END
      END >= 70 THEN 'C'
      ELSE 'D'
    END
  FROM students s
  CROSS JOIN subjects subj
  WHERE s.admin_id = v_admin_id AND subj.admin_id = v_admin_id
  ON CONFLICT (exam_id, student_id, subject_id) DO NOTHING;

END $$;
