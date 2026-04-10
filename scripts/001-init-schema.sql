-- Initial schema migration for SAgeStartups
-- Creates all tables required by the application

-- Sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR(255) PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON sessions (expire);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  profile_image_url VARCHAR(255),
  company VARCHAR(255),
  job_title VARCHAR(255),
  phone VARCHAR(255),
  location VARCHAR(255),
  timezone VARCHAR(255),
  language VARCHAR(255) DEFAULT 'en',
  subscription_tier VARCHAR(20) NOT NULL DEFAULT 'free',
  subscription_status VARCHAR(20) NOT NULL DEFAULT 'active',
  next_tier VARCHAR(20),
  role VARCHAR(20) NOT NULL DEFAULT 'client',
  subscription_expires TIMESTAMP,
  trial_used BOOLEAN NOT NULL DEFAULT FALSE,
  email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  marketing_emails BOOLEAN NOT NULL DEFAULT FALSE,
  security_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  last_active TIMESTAMP,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  pending_subscription VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  resource VARCHAR(255) NOT NULL,
  resource_id VARCHAR(255),
  details JSONB,
  ip_address VARCHAR(255),
  user_agent VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  tier VARCHAR(255) NOT NULL,
  price REAL NOT NULL,
  billing_interval VARCHAR(255) NOT NULL,
  features JSONB NOT NULL,
  bot_limit INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id),
  plan_id INTEGER REFERENCES subscription_plans(id),
  amount REAL NOT NULL,
  currency VARCHAR(255) NOT NULL DEFAULT 'USD',
  status VARCHAR(255) NOT NULL,
  payment_method VARCHAR(255),
  transaction_id VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Content table
CREATE TABLE IF NOT EXISTS content (
  id SERIAL PRIMARY KEY,
  type VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'draft',
  author_id VARCHAR(255) NOT NULL REFERENCES users(id),
  metadata JSONB,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Media table
CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(255) NOT NULL,
  size INTEGER NOT NULL,
  url VARCHAR(255) NOT NULL,
  uploaded_by VARCHAR(255) NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- User analytics table
CREATE TABLE IF NOT EXISTS user_analytics (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id),
  total_sessions INTEGER NOT NULL DEFAULT 0,
  total_messages INTEGER NOT NULL DEFAULT 0,
  total_assets INTEGER NOT NULL DEFAULT 0,
  favorite_section VARCHAR(50),
  last_active TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bot sessions table
CREATE TABLE IF NOT EXISTS bot_sessions (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL,
  bot_id TEXT NOT NULL,
  bot_name TEXT NOT NULL,
  section TEXT NOT NULL,
  session_title TEXT,
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Generated assets table
CREATE TABLE IF NOT EXISTS generated_assets (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL,
  asset_type TEXT NOT NULL,
  content JSONB NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Bot programs table
CREATE TABLE IF NOT EXISTS bot_programs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id),
  bot_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger VARCHAR(255) NOT NULL,
  schedule VARCHAR(255),
  event VARCHAR(255),
  enabled BOOLEAN DEFAULT TRUE,
  instructions TEXT NOT NULL,
  parameters JSONB,
  last_run TIMESTAMP,
  status VARCHAR(255) DEFAULT 'idle',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Founder metrics table
CREATE TABLE IF NOT EXISTS founder_metrics (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id),
  company_name TEXT NOT NULL DEFAULT 'Your Startup',
  revenue INTEGER NOT NULL DEFAULT 0,
  monthly_growth INTEGER NOT NULL DEFAULT 0,
  active_users INTEGER NOT NULL DEFAULT 0,
  churn_rate INTEGER NOT NULL DEFAULT 0,
  burn_rate INTEGER NOT NULL DEFAULT 0,
  runway INTEGER NOT NULL DEFAULT 0,
  goals JSONB NOT NULL DEFAULT '[]',
  last_updated TIMESTAMP DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  source VARCHAR(255) DEFAULT 'landing-page-2',
  referrer VARCHAR(255),
  is_early_bird BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Early bird counter table
CREATE TABLE IF NOT EXISTS early_bird_counter (
  id SERIAL PRIMARY KEY,
  spots_remaining INTEGER NOT NULL DEFAULT 20,
  total_spots INTEGER NOT NULL DEFAULT 20,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Site visits table
CREATE TABLE IF NOT EXISTS site_visits (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) REFERENCES users(id),
  ip_address VARCHAR(255) NOT NULL,
  user_agent VARCHAR(255),
  referrer VARCHAR(255),
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  country VARCHAR(255),
  city VARCHAR(255),
  browser VARCHAR(255),
  os VARCHAR(255),
  device VARCHAR(255),
  visit_start TIMESTAMP DEFAULT NOW() NOT NULL,
  visit_end TIMESTAMP,
  duration INTEGER,
  page_views INTEGER DEFAULT 1,
  is_authenticated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Page views table
CREATE TABLE IF NOT EXISTS page_views (
  id SERIAL PRIMARY KEY,
  visit_id INTEGER NOT NULL REFERENCES site_visits(id),
  session_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) REFERENCES users(id),
  path VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  time_on_page INTEGER,
  exit_page BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- User actions table
CREATE TABLE IF NOT EXISTS user_actions (
  id SERIAL PRIMARY KEY,
  visit_id INTEGER NOT NULL REFERENCES site_visits(id),
  session_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  element VARCHAR(255),
  element_text VARCHAR(255),
  page VARCHAR(255) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Conversion events table
CREATE TABLE IF NOT EXISTS conversion_events (
  id SERIAL PRIMARY KEY,
  visit_id INTEGER NOT NULL REFERENCES site_visits(id),
  session_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) REFERENCES users(id),
  event_type VARCHAR(255) NOT NULL,
  event_value REAL,
  funnel VARCHAR(255),
  source VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Initialize early bird counter if not exists
INSERT INTO early_bird_counter (spots_remaining, total_spots)
SELECT 20, 20
WHERE NOT EXISTS (SELECT 1 FROM early_bird_counter LIMIT 1);
