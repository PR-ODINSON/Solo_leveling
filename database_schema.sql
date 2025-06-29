-- Solo Leveling App Database Schema
-- This file contains all the necessary tables and functions for the application

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Create custom types
CREATE TYPE quest_category AS ENUM ('daily', 'weekly', 'monthly', 'milestone');
CREATE TYPE quest_difficulty AS ENUM ('E', 'D', 'C', 'B', 'A', 'S');
CREATE TYPE task_type AS ENUM ('habit', 'action', 'learning', 'social', 'creative');
CREATE TYPE hunter_rank AS ENUM ('E-Class', 'D-Class', 'C-Class', 'B-Class', 'A-Class', 'S-Class');

-- User Profiles Table (extends auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    display_name VARCHAR(100),
    selected_goal TEXT,
    trait_scores JSONB DEFAULT '{}',
    assessment_completed BOOLEAN DEFAULT FALSE,
    assessment_completed_at TIMESTAMP WITH TIME ZONE,
    current_level INTEGER DEFAULT 1,
    total_xp INTEGER DEFAULT 0,
    hunter_rank hunter_rank DEFAULT 'E-Class',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stats Table (Intelligence, Strength, Dexterity, etc.)
CREATE TABLE stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    stat_name VARCHAR(50) NOT NULL,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, stat_name)
);

-- Trait Questions Table (for assessment)
CREATE TABLE trait_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trait_name VARCHAR(50) NOT NULL,
    question_text TEXT NOT NULL,
    trait_weight DECIMAL(3,2) DEFAULT 1.0,
    reverse_scoring BOOLEAN DEFAULT FALSE,
    difficulty VARCHAR(20) DEFAULT 'Medium',
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Assessment Answers Table
CREATE TABLE user_assessment_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES trait_questions(id) ON DELETE CASCADE NOT NULL,
    answer_score INTEGER CHECK (answer_score >= 1 AND answer_score <= 5) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);

-- Goals Table (predefined goals users can choose)
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    color VARCHAR(50),
    benefits TEXT[],
    difficulty VARCHAR(20) DEFAULT 'Intermediate',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quests Table (master quest templates)
CREATE TABLE quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category quest_category NOT NULL,
    difficulty quest_difficulty NOT NULL,
    xp_reward INTEGER DEFAULT 0,
    primary_trait VARCHAR(50) NOT NULL,
    secondary_traits TEXT[] DEFAULT '{}',
    estimated_time VARCHAR(50),
    unlock_level INTEGER DEFAULT 1,
    required_traits JSONB,
    prerequisite_quests UUID[],
    hunter_notes TEXT,
    goal_id UUID REFERENCES goals(id),
    is_template BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Quests Table (assigned quests for specific users)
CREATE TABLE user_quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    quest_id UUID REFERENCES quests(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(20) DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'failed', 'abandoned')),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks Table (subtasks within quests)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quest_id UUID REFERENCES quests(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    type task_type NOT NULL,
    completion_criteria TEXT,
    xp_reward INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    is_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Task Progress Table
CREATE TABLE user_task_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    user_quest_id UUID REFERENCES user_quests(id) ON DELETE CASCADE NOT NULL,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, user_quest_id, task_id)
);

-- Rewards Table
CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    requirement_type VARCHAR(50) NOT NULL, -- 'xp_total', 'level', 'quest_count', 'streak'
    requirement_value INTEGER NOT NULL,
    reward_type VARCHAR(50) NOT NULL, -- 'badge', 'title', 'avatar', 'feature_unlock'
    reward_data JSONB,
    claimed BOOLEAN DEFAULT FALSE,
    claimed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Streaks Table (for tracking daily/weekly streaks)
CREATE TABLE streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    streak_type VARCHAR(50) NOT NULL, -- 'daily', 'weekly', 'quest_completion'
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, streak_type)
);

-- Activity Log Table (for tracking all user actions)
CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    action_type VARCHAR(50) NOT NULL, -- 'quest_completed', 'level_up', 'xp_gained', 'assessment_taken'
    action_data JSONB,
    xp_gained INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Sessions Table (for tracking login sessions)
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_stats_user_id ON stats(user_id);
CREATE INDEX idx_user_quests_user_id ON user_quests(user_id);
CREATE INDEX idx_user_quests_status ON user_quests(status);
CREATE INDEX idx_user_task_progress_user_id ON user_task_progress(user_id);
CREATE INDEX idx_rewards_user_id ON rewards(user_id);
CREATE INDEX idx_streaks_user_id ON streaks(user_id);
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);
CREATE INDEX idx_user_assessment_answers_user_id ON user_assessment_answers(user_id);

-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE trait_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_task_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies

-- User Profiles - users can only access their own profile
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Stats - users can only access their own stats
CREATE POLICY "Users can view own stats" ON stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trait Questions - readable by all authenticated users
CREATE POLICY "Authenticated users can view trait questions" ON trait_questions FOR SELECT TO authenticated USING (true);

-- User Assessment Answers - users can only access their own answers
CREATE POLICY "Users can view own assessment answers" ON user_assessment_answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assessment answers" ON user_assessment_answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assessment answers" ON user_assessment_answers FOR UPDATE USING (auth.uid() = user_id);

-- Goals - readable by all authenticated users
CREATE POLICY "Authenticated users can view goals" ON goals FOR SELECT TO authenticated USING (true);

-- Quests - readable by all authenticated users (templates)
CREATE POLICY "Authenticated users can view quest templates" ON quests FOR SELECT TO authenticated USING (true);

-- User Quests - users can only access their own assigned quests
CREATE POLICY "Users can view own quests" ON user_quests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own quests" ON user_quests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quests" ON user_quests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tasks - readable by all authenticated users
CREATE POLICY "Authenticated users can view tasks" ON tasks FOR SELECT TO authenticated USING (true);

-- User Task Progress - users can only access their own task progress
CREATE POLICY "Users can view own task progress" ON user_task_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own task progress" ON user_task_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own task progress" ON user_task_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Rewards - users can only access their own rewards
CREATE POLICY "Users can view own rewards" ON rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own rewards" ON rewards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own rewards" ON rewards FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Streaks - users can only access their own streaks
CREATE POLICY "Users can view own streaks" ON streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own streaks" ON streaks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own streaks" ON streaks FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activity Log - users can only access their own activity
CREATE POLICY "Users can view own activity" ON activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity" ON activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Sessions - users can only access their own sessions
CREATE POLICY "Users can view own sessions" ON user_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON user_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON user_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Functions and Triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stats_updated_at BEFORE UPDATE ON stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quests_updated_at BEFORE UPDATE ON quests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_quests_updated_at BEFORE UPDATE ON user_quests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_task_progress_updated_at BEFORE UPDATE ON user_task_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON streaks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, username, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
    );
    
    -- Initialize default stats
    INSERT INTO public.stats (user_id, stat_name, xp, level) VALUES
    (NEW.id, 'Intelligence', 0, 0),
    (NEW.id, 'Strength', 0, 0),
    (NEW.id, 'Dexterity', 0, 0),
    (NEW.id, 'Wisdom', 0, 0),
    (NEW.id, 'Charisma', 0, 0),
    (NEW.id, 'Discipline', 0, 0);
    
    -- Initialize default streaks
    INSERT INTO public.streaks (user_id, streak_type, current_streak, longest_streak) VALUES
    (NEW.id, 'daily', 0, 0),
    (NEW.id, 'weekly', 0, 0),
    (NEW.id, 'quest_completion', 0, 0);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to calculate user level based on total XP
CREATE OR REPLACE FUNCTION calculate_user_level(total_xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
    -- Level formula: level = floor(sqrt(total_xp / 100))
    RETURN GREATEST(1, FLOOR(SQRT(total_xp / 100.0)));
END;
$$ LANGUAGE plpgsql;

-- Function to calculate hunter rank based on average trait scores
CREATE OR REPLACE FUNCTION calculate_hunter_rank(avg_trait_score DECIMAL)
RETURNS hunter_rank AS $$
BEGIN
    IF avg_trait_score >= 9.0 THEN
        RETURN 'S-Class';
    ELSIF avg_trait_score >= 8.0 THEN
        RETURN 'A-Class';
    ELSIF avg_trait_score >= 6.5 THEN
        RETURN 'B-Class';
    ELSIF avg_trait_score >= 5.0 THEN
        RETURN 'C-Class';
    ELSIF avg_trait_score >= 3.5 THEN
        RETURN 'D-Class';
    ELSE
        RETURN 'E-Class';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update user profile after quest completion
CREATE OR REPLACE FUNCTION update_user_progress()
RETURNS TRIGGER AS $$
DECLARE
    quest_xp INTEGER;
    user_total_xp INTEGER;
    new_level INTEGER;
    new_rank hunter_rank;
    avg_score DECIMAL;
BEGIN
    -- Only process when quest is completed
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        -- Get quest XP reward
        SELECT xp_reward INTO quest_xp FROM quests WHERE id = NEW.quest_id;
        
        -- Update user's total XP
        UPDATE user_profiles 
        SET total_xp = total_xp + quest_xp
        WHERE user_id = NEW.user_id
        RETURNING total_xp INTO user_total_xp;
        
        -- Calculate new level
        new_level := calculate_user_level(user_total_xp);
        
        -- Calculate new rank based on trait scores
        SELECT AVG((value::TEXT)::DECIMAL) INTO avg_score
        FROM user_profiles, jsonb_each(trait_scores)
        WHERE user_id = NEW.user_id;
        
        IF avg_score IS NOT NULL THEN
            new_rank := calculate_hunter_rank(avg_score);
        ELSE
            new_rank := 'E-Class';
        END IF;
        
        -- Update user level and rank
        UPDATE user_profiles 
        SET current_level = new_level, hunter_rank = new_rank
        WHERE user_id = NEW.user_id;
        
        -- Log the activity
        INSERT INTO activity_log (user_id, action_type, action_data, xp_gained)
        VALUES (
            NEW.user_id, 
            'quest_completed', 
            jsonb_build_object('quest_id', NEW.quest_id, 'quest_title', (SELECT title FROM quests WHERE id = NEW.quest_id)),
            quest_xp
        );
        
        -- Update quest completion streak
        UPDATE streaks 
        SET 
            current_streak = current_streak + 1,
            longest_streak = GREATEST(longest_streak, current_streak + 1),
            last_activity_date = CURRENT_DATE
        WHERE user_id = NEW.user_id AND streak_type = 'quest_completion';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for quest completion
CREATE TRIGGER on_quest_completion
    AFTER UPDATE ON user_quests
    FOR EACH ROW EXECUTE FUNCTION update_user_progress();

-- Insert default goals
INSERT INTO goals (name, description, icon, color, benefits, difficulty) VALUES
('Master of Knowledge', 'Become a relentless learner and knowledge seeker', '📚', 'from-blue-500 to-indigo-600', ARRAY['Enhanced learning speed', 'Better problem-solving', 'Increased curiosity'], 'Intermediate'),
('Apex Warrior', 'Achieve peak physical and mental performance', '⚔️', 'from-red-500 to-orange-600', ARRAY['Superior strength', 'Enhanced endurance', 'Mental toughness'], 'Advanced'),
('Shadow Assassin', 'Master stealth, precision, and efficiency', '🥷', 'from-purple-500 to-indigo-600', ARRAY['Laser focus', 'Perfect execution', 'Strategic thinking'], 'Advanced'),
('Social Commander', 'Lead and inspire others through charisma', '👑', 'from-yellow-500 to-orange-600', ARRAY['Natural leadership', 'Strong relationships', 'Influence'], 'Intermediate'),
('Digital Sage', 'Master technology while maintaining balance', '💻', 'from-cyan-500 to-blue-600', ARRAY['Tech mastery', 'Digital minimalism', 'Balanced lifestyle'], 'Beginner'),
('Wellness Guardian', 'Achieve perfect mind-body harmony', '🧘', 'from-green-500 to-emerald-600', ARRAY['Inner peace', 'Physical health', 'Emotional balance'], 'Beginner'),
('Creative Visionary', 'Unleash unlimited creative potential', '🎨', 'from-pink-500 to-purple-600', ARRAY['Enhanced creativity', 'Artistic expression', 'Innovation'], 'Intermediate'),
('Leadership Sovereign', 'Become an inspiring and effective leader', '🏆', 'from-amber-500 to-yellow-600', ARRAY['Leadership skills', 'Team building', 'Decision making'], 'Advanced');

-- Insert sample trait questions (you can add more)
INSERT INTO trait_questions (trait_name, question_text, trait_weight, reverse_scoring, difficulty, category) VALUES
('Discipline', 'I consistently follow through on my commitments, even when I don''t feel like it.', 1.2, false, 'Hard', 'behavior'),
('Discipline', 'I often start projects but struggle to finish them.', 1.1, true, 'Medium', 'behavior'),
('Focus', 'I can work for extended periods without getting distracted.', 1.0, false, 'Medium', 'mindset'),
('Focus', 'I frequently check my phone or social media while working.', 1.1, true, 'Easy', 'behavior'),
('Energy', 'I maintain high energy levels throughout most of the day.', 1.0, false, 'Medium', 'physical'),
('Energy', 'I often feel tired or drained by mid-afternoon.', 1.0, true, 'Easy', 'physical'),
('Curiosity', 'I actively seek out new information and experiences.', 1.0, false, 'Medium', 'mindset'),
('Curiosity', 'I prefer sticking to familiar routines rather than trying new things.', 1.1, true, 'Medium', 'behavior'),
('Learning Agility', 'I quickly grasp new concepts and skills.', 1.1, false, 'Medium', 'cognitive'),
('Learning Agility', 'I struggle to adapt when I need to learn something completely new.', 1.2, true, 'Hard', 'cognitive'),
('Social Courage', 'I speak up confidently in group settings.', 1.2, false, 'Hard', 'social'),
('Social Courage', 'I avoid social situations where I might be judged.', 1.1, true, 'Medium', 'social'),
('Confidence', 'I believe in my ability to overcome challenges.', 1.0, false, 'Medium', 'mindset'),
('Confidence', 'I often doubt my abilities even in areas where I have proven success.', 1.1, true, 'Medium', 'mindset'),
('Initiative', 'I take action without waiting for others to tell me what to do.', 1.1, false, 'Medium', 'behavior'),
('Initiative', 'I prefer to wait for clear instructions before starting something new.', 1.0, true, 'Easy', 'behavior'),
('Digital Minimalism', 'I have healthy boundaries with technology and social media.', 1.2, false, 'Hard', 'lifestyle'),
('Digital Minimalism', 'I spend more time on devices than I would like to.', 1.0, true, 'Easy', 'lifestyle'),
('Emotional Resilience', 'I bounce back quickly from setbacks and disappointments.', 1.1, false, 'Medium', 'emotion'),
('Emotional Resilience', 'Criticism or failure tends to affect me for days or weeks.', 1.2, true, 'Hard', 'emotion'),
('Self Mastery', 'I have good awareness and control over my thoughts and emotions.', 1.2, false, 'Hard', 'mindset'),
('Self Mastery', 'I often react impulsively without thinking things through.', 1.1, true, 'Medium', 'behavior'),
('Consistency', 'I maintain steady progress on my goals over time.', 1.1, false, 'Medium', 'behavior'),
('Consistency', 'My motivation and effort levels vary dramatically from day to day.', 1.0, true, 'Easy', 'behavior');