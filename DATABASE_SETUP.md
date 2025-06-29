# AscendOS Database Setup Guide

This guide will help you set up the complete database schema for the Solo Leveling-themed web application using Supabase.

## Prerequisites

1. A Supabase project created at [supabase.com](https://supabase.com)
2. Access to the Supabase SQL Editor
3. Your Supabase project URL and anon key

## Environment Variables

First, create a `.env.local` file in your project root with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema Setup

### Step 1: Run the Complete Schema

Copy and paste the entire contents of `database_schema.sql` into your Supabase SQL Editor and execute it. This will create:

- **Custom Types**: Enums for quest categories, difficulties, hunter ranks, etc.
- **Tables**: All necessary tables with proper relationships
- **Indexes**: For optimal query performance
- **Row Level Security**: Policies to secure user data
- **Functions**: Automated triggers and calculations
- **Sample Data**: Default goals and trait questions

### Step 2: Verify Table Creation

After running the schema, verify that the following tables were created:

#### Core Tables
- `user_profiles` - Extended user information
- `stats` - User statistics (Intelligence, Strength, etc.)
- `trait_questions` - Assessment questions
- `user_assessment_answers` - User responses to assessment
- `goals` - Available goals for users
- `quests` - Quest templates
- `user_quests` - User-assigned quests
- `tasks` - Subtasks within quests
- `user_task_progress` - User progress on tasks
- `rewards` - Available rewards
- `streaks` - User streak tracking
- `activity_log` - User activity history
- `user_sessions` - Login session tracking

### Step 3: Enable Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Enable email authentication
3. Configure email templates (optional)
4. Set up any additional auth providers if needed

### Step 4: Test the Setup

Run the following queries to verify everything is working:

```sql
-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verify sample data
SELECT COUNT(*) as goal_count FROM goals;
SELECT COUNT(*) as question_count FROM trait_questions;

-- Test RLS policies (should return empty for unauthenticated user)
SELECT * FROM user_profiles LIMIT 1;
```

## Database Features

### 1. Automatic User Profile Creation

When a user signs up, a database trigger automatically:
- Creates a user profile
- Initializes default stats (Intelligence, Strength, Dexterity, Wisdom, Charisma, Discipline)
- Sets up default streaks (daily, weekly, quest_completion)

### 2. Quest Completion Automation

When a user completes a quest, the system automatically:
- Awards XP based on the quest reward
- Updates user's total XP and level
- Calculates new hunter rank based on trait scores
- Logs the activity
- Updates quest completion streaks

### 3. Level Calculation

User levels are calculated using the formula: `level = floor(sqrt(total_xp / 100))`

### 4. Hunter Rank System

Hunter ranks are calculated based on average trait scores:
- **S-Class**: 9.0+ average
- **A-Class**: 8.0+ average
- **B-Class**: 6.5+ average
- **C-Class**: 5.0+ average
- **D-Class**: 3.5+ average
- **E-Class**: Below 3.5 average

### 5. Assessment System

The trait assessment system:
- Supports weighted questions
- Handles reverse scoring for negative questions
- Groups questions by trait categories
- Calculates normalized scores (1-10 scale)

## Data Flow

### User Registration Flow
1. User signs up with email/password
2. `handle_new_user()` trigger creates profile and initial data
3. User is redirected to assessment
4. Assessment completion updates trait scores and hunter rank
5. Goal selection triggers quest assignment

### Quest Completion Flow
1. User marks quest as completed
2. `update_user_progress()` trigger fires
3. XP is awarded and user level recalculated
4. Hunter rank updated based on trait scores
5. Activity logged and streaks updated

## Security

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring:
- Users can only access their own data
- Public data (goals, quest templates, trait questions) is readable by authenticated users
- No unauthorized data access or modification

### Data Validation

- Check constraints on scores (1-5 for assessments, 0-100 for progress)
- Foreign key constraints maintain data integrity
- Unique constraints prevent duplicate entries

## Sample Queries

### Get User Dashboard Data
```sql
-- Get user profile with stats
SELECT 
  up.*,
  array_agg(
    json_build_object(
      'stat_name', s.stat_name,
      'xp', s.xp,
      'level', s.level
    )
  ) as stats
FROM user_profiles up
LEFT JOIN stats s ON up.user_id = s.user_id
WHERE up.user_id = auth.uid()
GROUP BY up.id;
```

### Get Active Quests
```sql
-- Get user's active quests with quest details
SELECT 
  uq.*,
  q.title,
  q.description,
  q.xp_reward,
  q.difficulty
FROM user_quests uq
JOIN quests q ON uq.quest_id = q.id
WHERE uq.user_id = auth.uid()
  AND uq.status IN ('assigned', 'in_progress')
ORDER BY uq.created_at DESC;
```

### Get Assessment Results
```sql
-- Get user's trait scores from assessment
SELECT 
  trait_scores
FROM user_profiles
WHERE user_id = auth.uid();
```

## Maintenance

### Regular Tasks

1. **Monitor Activity Logs**: Check for unusual patterns
2. **Update Quest Templates**: Add new quests based on user feedback
3. **Optimize Queries**: Monitor slow queries and add indexes as needed
4. **Backup Data**: Regular backups of user progress

### Performance Optimization

- All frequently queried columns have indexes
- Composite indexes on user_id + status for quest queries
- Partial indexes on active quests only
- Regular VACUUM and ANALYZE operations

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**: Ensure user is authenticated and policies are correct
2. **Trigger Failures**: Check function logs for detailed error messages
3. **Constraint Violations**: Verify data meets all check constraints
4. **Performance Issues**: Check query execution plans and index usage

### Debug Queries

```sql
-- Check user authentication
SELECT auth.uid(), auth.email();

-- View function logs
SELECT * FROM pg_stat_user_functions;

-- Check constraint violations
SELECT conname, conrelid::regclass 
FROM pg_constraint 
WHERE NOT convalidated;
```

## Next Steps

After setting up the database:

1. Test user registration and login
2. Complete the assessment flow
3. Verify quest assignment and completion
4. Test all CRUD operations
5. Monitor performance and optimize as needed

The database is now ready to support the full AscendOS application with all its features including user management, quest systems, progress tracking, and gamification elements. 