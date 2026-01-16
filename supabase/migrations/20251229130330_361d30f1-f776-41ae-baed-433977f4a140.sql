-- Create table for storing student results
CREATE TABLE public.student_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  groupe TEXT NOT NULL,
  niveau TEXT NOT NULL,
  specialite TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 5,
  level1_score INTEGER DEFAULT 0,
  level2_score INTEGER DEFAULT 0,
  level3_score INTEGER DEFAULT 0,
  level4_score INTEGER DEFAULT 0,
  level5_score INTEGER DEFAULT 0,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_results ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert results (students don't need to be authenticated)
CREATE POLICY "Anyone can insert results" 
ON public.student_results 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to read results (for admin dashboard)
CREATE POLICY "Anyone can read results" 
ON public.student_results 
FOR SELECT 
USING (true);