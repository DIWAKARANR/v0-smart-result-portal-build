-- Create tables for SmartResult Portal

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  school_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  register_no VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  dob DATE NOT NULL,
  class VARCHAR(50) NOT NULL,
  section VARCHAR(10) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exam types table (Quarterly, Half-Yearly, Annual, etc.)
CREATE TABLE IF NOT EXISTS exam_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(admin_id, name)
);

-- Exams table
CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  exam_type_id UUID NOT NULL REFERENCES exam_types(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  exam_date DATE,
  publish_date TIMESTAMP,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  max_marks INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(admin_id, name)
);

-- Results table (Student marks for each exam subject)
CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  marks_obtained INT,
  max_marks INT DEFAULT 100,
  grade VARCHAR(2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(exam_id, student_id, subject_id)
);

-- Student rankings table
CREATE TABLE IF NOT EXISTS student_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  rank INT,
  total_marks INT,
  percentage DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(exam_id, student_id)
);

-- Gamification badges table
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_url VARCHAR(255),
  badge_type VARCHAR(50), -- 'top_performer', 'most_improved', 'consistent_achiever'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student badges table (Many to many)
CREATE TABLE IF NOT EXISTS student_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, badge_id)
);

-- AI feedback table
CREATE TABLE IF NOT EXISTS ai_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  feedback_text TEXT,
  emotion_tone VARCHAR(50), -- 'encouraging', 'neutral', 'challenging'
  improvement_tips TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grade prediction table
CREATE TABLE IF NOT EXISTS grade_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  predicted_grade VARCHAR(2),
  predicted_marks INT,
  confidence_score DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_students_admin_id ON students(admin_id);
CREATE INDEX idx_students_register_no ON students(register_no);
CREATE INDEX idx_exams_admin_id ON exams(admin_id);
CREATE INDEX idx_exams_exam_type_id ON exams(exam_type_id);
CREATE INDEX idx_results_exam_id ON results(exam_id);
CREATE INDEX idx_results_student_id ON results(student_id);
CREATE INDEX idx_rankings_exam_id ON student_rankings(exam_id);
CREATE INDEX idx_ai_feedback_student_id ON ai_feedback(student_id);
CREATE INDEX idx_student_badges_student_id ON student_badges(student_id);
