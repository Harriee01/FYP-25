/*
  # Quality Management System Database Schema

  1. New Tables
    - `organizations`
      - `id` (uuid, primary key)
      - `name` (text)
      - `industry` (text)
      - `admin_id` (uuid)
      - `created_at` (timestamp)
      - `is_active` (boolean)
    
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `role` (text)
      - `organization_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `is_active` (boolean)
    
    - `quality_benchmarks`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `category` (text)
      - `min_value` (numeric)
      - `max_value` (numeric)
      - `unit` (text)
      - `organization_id` (uuid, foreign key)
      - `created_by` (uuid, foreign key)
      - `created_at` (timestamp)
      - `is_active` (boolean)
    
    - `quality_reports`
      - `id` (uuid, primary key)
      - `benchmark_id` (uuid, foreign key)
      - `value` (numeric)
      - `status` (text)
      - `notes` (text)
      - `inspector_id` (uuid, foreign key)
      - `organization_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `blockchain_hash` (text)
    
    - `alerts`
      - `id` (uuid, primary key)
      - `type` (text)
      - `severity` (text)
      - `title` (text)
      - `message` (text)
      - `report_id` (uuid, foreign key)
      - `organization_id` (uuid, foreign key)
      - `is_read` (boolean)
      - `created_at` (timestamp)
    
    - `audit_trail`
      - `id` (uuid, primary key)
      - `action` (text)
      - `entity_type` (text)
      - `entity_id` (uuid)
      - `user_id` (uuid, foreign key)
      - `organization_id` (uuid, foreign key)
      - `timestamp` (timestamp)
      - `details` (jsonb)
      - `blockchain_hash` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for organization-based access control
*/

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  industry text NOT NULL,
  admin_id uuid,
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'quality_inspector',
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Quality benchmarks table
CREATE TABLE IF NOT EXISTS quality_benchmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  min_value numeric,
  max_value numeric,
  unit text NOT NULL,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE quality_benchmarks ENABLE ROW LEVEL SECURITY;

-- Quality reports table
CREATE TABLE IF NOT EXISTS quality_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  benchmark_id uuid REFERENCES quality_benchmarks(id) ON DELETE CASCADE,
  value numeric NOT NULL,
  status text NOT NULL DEFAULT 'compliant',
  notes text,
  inspector_id uuid REFERENCES users(id),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  blockchain_hash text
);

ALTER TABLE quality_reports ENABLE ROW LEVEL SECURITY;

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'deviation',
  severity text NOT NULL DEFAULT 'medium',
  title text NOT NULL,
  message text NOT NULL,
  report_id uuid REFERENCES quality_reports(id),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Audit trail table
CREATE TABLE IF NOT EXISTS audit_trail (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  user_id uuid REFERENCES users(id),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  timestamp timestamptz DEFAULT now(),
  details jsonb DEFAULT '{}',
  blockchain_hash text NOT NULL
);

ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;

-- Add foreign key constraint for admin_id in organizations
ALTER TABLE organizations ADD CONSTRAINT fk_organizations_admin 
  FOREIGN KEY (admin_id) REFERENCES users(id);

-- RLS Policies
CREATE POLICY "Organizations can be viewed by members"
  ON organizations FOR SELECT
  TO authenticated
  USING (id IN (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view organization members"
  ON users FOR SELECT
  TO authenticated
  USING (organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Quality benchmarks can be viewed by organization members"
  ON quality_benchmarks FOR SELECT
  TO authenticated
  USING (organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Quality benchmarks can be managed by admins and quality managers"
  ON quality_benchmarks FOR ALL
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM users 
    WHERE id = auth.uid() AND role IN ('admin', 'quality_manager')
  ));

CREATE POLICY "Quality reports can be viewed by organization members"
  ON quality_reports FOR SELECT
  TO authenticated
  USING (organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Quality reports can be created by inspectors and managers"
  ON quality_reports FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM users 
    WHERE id = auth.uid() AND role IN ('admin', 'quality_manager', 'quality_inspector')
  ));

CREATE POLICY "Alerts can be viewed by organization members"
  ON alerts FOR SELECT
  TO authenticated
  USING (organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Audit trail can be viewed by organization members"
  ON audit_trail FOR SELECT
  TO authenticated
  USING (organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid()));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_quality_benchmarks_organization_id ON quality_benchmarks(organization_id);
CREATE INDEX IF NOT EXISTS idx_quality_reports_organization_id ON quality_reports(organization_id);
CREATE INDEX IF NOT EXISTS idx_quality_reports_benchmark_id ON quality_reports(benchmark_id);
CREATE INDEX IF NOT EXISTS idx_alerts_organization_id ON alerts(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_trail_organization_id ON audit_trail(organization_id);