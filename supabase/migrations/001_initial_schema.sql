-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Employer Profiles Table
CREATE TABLE IF NOT EXISTS employer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  company_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Worker Profiles Table
CREATE TABLE IF NOT EXISTS worker_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  skills TEXT[] DEFAULT '{}',
  availability JSONB DEFAULT '{}',
  avg_rating NUMERIC(3, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Posts Table
CREATE TABLE IF NOT EXISTS job_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  required_skills TEXT[] DEFAULT '{}',
  location TEXT,
  job_time_start TIMESTAMPTZ,
  job_time_end TIMESTAMPTZ,
  pay_amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Applications Table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES job_posts(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, worker_id)
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES job_posts(id) ON DELETE CASCADE,
  payer_id UUID NOT NULL,
  payee_id UUID NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded')),
  wx_transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES job_posts(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL,
  reviewee_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, reviewer_id)
);

-- Indexes for better query performance
CREATE INDEX idx_job_posts_employer ON job_posts(employer_id);
CREATE INDEX idx_job_posts_status ON job_posts(status);
CREATE INDEX idx_job_applications_job ON job_applications(job_id);
CREATE INDEX idx_job_applications_worker ON job_applications(worker_id);
CREATE INDEX idx_transactions_job ON transactions(job_id);
CREATE INDEX idx_reviews_job ON reviews(job_id);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE employer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employer_profiles
CREATE POLICY "Employer profiles are viewable by their owner"
  ON employer_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Employers can insert their own profile"
  ON employer_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Employers can update their own profile"
  ON employer_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for worker_profiles
CREATE POLICY "Worker profiles are viewable by everyone"
  ON worker_profiles FOR SELECT
  USING (true);

CREATE POLICY "Workers can insert their own profile"
  ON worker_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Workers can update their own profile"
  ON worker_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for job_posts
CREATE POLICY "Job posts are viewable by everyone"
  ON job_posts FOR SELECT
  USING (true);

CREATE POLICY "Employers can create job posts"
  ON job_posts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employer_profiles
      WHERE employer_profiles.id = job_posts.employer_id
      AND employer_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Employers can update their own job posts"
  ON job_posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM employer_profiles
      WHERE employer_profiles.id = job_posts.employer_id
      AND employer_profiles.user_id = auth.uid()
    )
  );

-- RLS Policies for job_applications
CREATE POLICY "Applications are viewable by job owner and applicant"
  ON job_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM job_posts
      WHERE job_posts.id = job_applications.job_id
      AND EXISTS (
        SELECT 1 FROM employer_profiles
        WHERE employer_profiles.id = job_posts.employer_id
        AND employer_profiles.user_id = auth.uid()
      )
    )
    OR
    EXISTS (
      SELECT 1 FROM worker_profiles
      WHERE worker_profiles.id = job_applications.worker_id
      AND worker_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Workers can create applications"
  ON job_applications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM worker_profiles
      WHERE worker_profiles.id = job_applications.worker_id
      AND worker_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Job owner can update applications"
  ON job_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM job_posts
      WHERE job_posts.id = job_applications.job_id
      AND EXISTS (
        SELECT 1 FROM employer_profiles
        WHERE employer_profiles.id = job_posts.employer_id
        AND employer_profiles.user_id = auth.uid()
      )
    )
  );

-- RLS Policies for transactions
CREATE POLICY "Transactions are viewable by participants"
  ON transactions FOR SELECT
  USING (
    auth.uid() = payer_id
    OR auth.uid() = payee_id
    OR
    EXISTS (
      SELECT 1 FROM job_posts
      WHERE job_posts.id = transactions.job_id
      AND EXISTS (
        SELECT 1 FROM employer_profiles
        WHERE employer_profiles.id = job_posts.employer_id
        AND employer_profiles.user_id = auth.uid()
      )
    )
  );

-- RLS Policies for reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Participants can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM job_posts
      WHERE job_posts.id = reviews.job_id
      AND (
        EXISTS (
          SELECT 1 FROM employer_profiles
          WHERE employer_profiles.id = job_posts.employer_id
          AND employer_profiles.user_id = reviews.reviewer_id
        )
        OR
        EXISTS (
          SELECT 1 FROM worker_profiles
          WHERE worker_profiles.id = reviews.reviewee_id
          AND worker_profiles.user_id = reviews.reviewer_id
        )
      )
    )
  );

-- Function to update worker's average rating
CREATE OR REPLACE FUNCTION update_worker_avg_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE worker_profiles
  SET avg_rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM reviews
    WHERE reviewee_id = NEW.reviewee_id
  )
  WHERE id = NEW.reviewee_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update worker rating
CREATE TRIGGER update_worker_rating_trigger
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_worker_avg_rating();

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
