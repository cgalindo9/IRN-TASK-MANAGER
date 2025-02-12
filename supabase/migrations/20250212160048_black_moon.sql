/*
  # School Task Management System Schema

  1. New Tables
    - `teachers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `created_at` (timestamp)
    
    - `students`
      - `id` (uuid, primary key)
      - `name` (text)
      - `grade` (integer)
      - `group` (text)
      - `created_at` (timestamp)
      - `teacher_id` (uuid, foreign key)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `due_date` (timestamp)
      - `status` (text)
      - `student_id` (uuid, foreign key)
      - `teacher_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated teachers to manage their data
*/

-- Create tables
CREATE TABLE teachers (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  grade integer NOT NULL,
  "group" text NOT NULL,
  teacher_id uuid REFERENCES teachers(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  due_date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  student_id uuid REFERENCES students(id) NOT NULL,
  teacher_id uuid REFERENCES teachers(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Teachers can view their own data"
  ON teachers FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Teachers can manage their students"
  ON students FOR ALL
  TO authenticated
  USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can manage tasks"
  ON tasks FOR ALL
  TO authenticated
  USING (teacher_id = auth.uid());