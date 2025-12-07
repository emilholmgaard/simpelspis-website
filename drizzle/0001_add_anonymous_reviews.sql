-- Alter existing reviews table to support anonymous reviews
-- First, drop the NOT NULL constraint on user_id (if it exists)
ALTER TABLE "reviews" ALTER COLUMN "user_id" DROP NOT NULL;

-- Add anonymous_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reviews' AND column_name = 'anonymous_id') THEN
        ALTER TABLE "reviews" ADD COLUMN "anonymous_id" text;
    END IF;
END $$;

