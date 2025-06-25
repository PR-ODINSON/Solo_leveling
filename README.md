# 🚀 AscendOS - Level Up Your Life

A **Solo Leveling** inspired self-improvement system built with **Next.js**, **TailwindCSS**, and **Supabase**. Transform your daily tasks into RPG-style quests and watch your stats grow!

![AscendOS Preview](https://img.shields.io/badge/Status-Demo_Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.10-cyan)

## ✨ Features

### 📊 **RPG-Style Stats System**
- 6 Core Stats: Intelligence, Strength, Dexterity, Wisdom, Charisma, Discipline
- XP progression with dynamic level calculation
- Beautiful stat cards with animated XP bars
- Level-up animations and notifications

### 📘 **Quest Management**
- Create daily/weekly quests linked to specific stats
- Three categories: Academic, Emotional, Physical
- Due date tracking with overdue warnings
- XP rewards for quest completion
- Quest filtering and search functionality

### 🏆 **Reward System**
- Milestone-based rewards unlocked by total XP
- Visual progress tracking for each reward
- Claim system with satisfaction animations
- Mock rewards included for demo purposes

### 🎨 **Cyberpunk UI/UX**
- Dark theme with neon accents (`#00ffff`, `#ff00ff`)
- Smooth animations powered by Framer Motion
- Responsive design (mobile + desktop)
- Glassmorphism effects and glowing elements
- Custom loading states and transitions

### 🔐 **Authentication**
- Supabase Auth integration
- Email/password signup and login
- Secure session management
- Auto-redirect based on auth status

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.3.4 | React framework with App Router |
| **React** | 19.1.0 | UI library |
| **TypeScript** | 5.8.3 | Type safety |
| **TailwindCSS** | 4.1.10 | Styling framework |
| **Supabase** | Latest | Backend-as-a-Service (Auth + Database) |
| **Zustand** | Latest | State management |
| **Framer Motion** | Latest | Animations |
| **Lucide React** | Latest | Icons |
| **React Hot Toast** | Latest | Notifications |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works!)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd ascendos
npm install
```

### 2. Environment Setup
Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Schema
Create these tables in your Supabase dashboard:

```sql
-- Stats table
CREATE TABLE stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stat_name TEXT NOT NULL,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quests table
CREATE TABLE quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT CHECK (category IN ('Academic', 'Emotional', 'Physical')),
  stat_target TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 25,
  due_date TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rewards table
CREATE TABLE rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  requirement_xp INTEGER NOT NULL,
  claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Streaks table (optional)
CREATE TABLE streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  last_completed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Enable Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

-- Create policies (example for stats table)
CREATE POLICY "Users can view own stats" ON stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Repeat similar policies for other tables
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start leveling up! 🎮

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Main dashboard
│   ├── quests/           # Quest management
│   ├── rewards/          # Reward system
│   ├── layout.tsx        # Root layout with auth
│   └── page.tsx          # Home redirect
├── components/            # Reusable components
│   ├── StatCard.tsx      # Individual stat display
│   ├── QuestCard.tsx     # Quest item component
│   ├── CreateQuestModal.tsx # Quest creation modal
│   ├── Sidebar.tsx       # Navigation sidebar
│   ├── AuthForm.tsx      # Login/signup form
│   ├── AuthWrapper.tsx   # Auth state manager
│   └── LoadingSpinner.tsx # Loading component
├── lib/                   # Core logic & utilities
│   ├── supabase.ts       # Supabase client & types
│   ├── store.ts          # Zustand state management
│   └── utils.ts          # Helper functions & constants
└── styles/
    └── globals.css       # Global styles & Tailwind
```

## 🎮 Usage Guide

### Creating Your First Quest
1. Click "New Quest" button
2. Fill in quest details:
   - **Title**: What you want to accomplish
   - **Category**: Academic, Emotional, or Physical
   - **Target Stat**: Which stat gains XP
   - **XP Reward**: 1-100 XP points
   - **Due Date**: Deadline for completion
3. Save and start grinding! 💪

### Leveling System
- **XP Range**: 0-100 per level
- **Level Calculation**: `Math.floor(totalXP / 100)`
- **Level Up**: Automatic when reaching 100+ XP
- **Animations**: Level up triggers special effects

### Reward Milestones
Default rewards unlock at:
- 100 XP: 1 Hour Gaming Session
- 250 XP: Favorite Meal
- 500 XP: Movie Night
- 750 XP: New Book Purchase
- 1000 XP: Weekend Adventure

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your GitHub repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables in Netlify dashboard
5. Deploy! 🎉

### Vercel Alternative
```bash
npm install -g vercel
vercel --prod
```

## 🔧 Customization

### Adding New Stats
Edit `src/lib/utils.ts`:
```typescript
export const STAT_NAMES = [
  'Intelligence', 'Strength', 'Dexterity', 
  'Wisdom', 'Charisma', 'Discipline',
  'YourNewStat' // Add here
]

export const STAT_ICONS = {
  // Add corresponding emoji
  YourNewStat: '🎯'
}
```

### Modifying XP System
Adjust in `src/lib/utils.ts`:
```typescript
export function calculateLevel(xp: number): number {
  return Math.floor(xp / 150) // Change 100 to 150 for harder leveling
}
```

### Custom Reward Tiers
Edit the mock rewards in `src/app/rewards/page.tsx` or create them in your Supabase rewards table.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by **Solo Leveling** manhwa/anime
- Built with modern React ecosystem
- Supabase for seamless backend integration
- Framer Motion for buttery smooth animations

---

**Ready to start your journey?** Create your account and begin ascending to greatness! 🚀

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/ascendos) 