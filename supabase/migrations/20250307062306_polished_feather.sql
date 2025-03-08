/*
  # Health Data Schema

  1. New Tables
    - `health_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `type` (text) - ECG or EEG
      - `timestamp` (timestamptz)
      - `data` (jsonb) - Stores signal data and metadata
      - `created_at` (timestamptz)
    
    - `anomalies`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `health_data_id` (uuid, references health_data)
      - `type` (text) - ECG, EEG, or Combined
      - `severity` (text)
      - `description` (text)
      - `details` (jsonb)
      - `status` (text)
      - `created_at` (timestamptz)
    
    - `recommendations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `anomaly_id` (uuid, references anomalies)
      - `category` (text)
      - `title` (text)
      - `description` (text)
      - `recommendations` (jsonb)
      - `source` (text)
      - `confidence` (float)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to:
      - Read their own data
      - Create new records
      - Update their own records
*/

-- Health Data Table
CREATE TABLE IF NOT EXISTS health_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  type text NOT NULL CHECK (type IN ('ECG', 'EEG')),
  timestamp timestamptz NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own health data"
  ON health_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health data"
  ON health_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Anomalies Table
CREATE TABLE IF NOT EXISTS anomalies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  health_data_id uuid REFERENCES health_data NOT NULL,
  type text NOT NULL CHECK (type IN ('ECG', 'EEG', 'Combined')),
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  description text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL CHECK (status IN ('active', 'resolved')) DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE anomalies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own anomalies"
  ON anomalies
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own anomalies"
  ON anomalies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own anomalies"
  ON anomalies
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Recommendations Table
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  anomaly_id uuid REFERENCES anomalies NOT NULL,
  category text NOT NULL CHECK (category IN ('Cardiac', 'Neurological', 'Combined')),
  title text NOT NULL,
  description text NOT NULL,
  recommendations jsonb NOT NULL DEFAULT '[]',
  source text NOT NULL,
  confidence float NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own recommendations"
  ON recommendations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations"
  ON recommendations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_health_data_user_timestamp 
  ON health_data (user_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_anomalies_user_created 
  ON anomalies (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_recommendations_user_created 
  ON recommendations (user_id, created_at DESC);