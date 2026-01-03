# SkillSprint - Online Skill Learning & Challenge Platform

A comprehensive platform where users learn skills through interactive challenges, track progress, earn badges, and compete on leaderboards.

## 🚀 Features

### Core Functionality
- **Authentication System**: Secure signup/login with role-based access (Student/Admin)
- **Skills Catalog**: Browse, search, and filter skills by difficulty and popularity
- **Challenge System**: Sequential unlock system with submission workflow
- **Progress Tracking**: Real-time progress bars and completion tracking
- **Badge System**: Earn badges for achievements and milestones
- **Leaderboard**: Compete with others based on points, streaks, and challenges
- **User Dashboard**: Personalized dashboard with stats and active skills
- **Admin Panel**: Manage skills, challenges, and review submissions
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Responsive Design**: Mobile-first design that works on all devices

### Pages
1. **Home** - Hero section, featured skills, top users, how it works
2. **Explore** - Browse all skills with search and filters
3. **Skill Detail** - View skill information and challenges
4. **Dashboard** - User progress, active skills, badges, weekly chart
5. **Challenges** - Complete challenges with submission system
6. **Leaderboard** - Rankings by points, streaks, and challenges
7. **Profile** - View and edit user profile
8. **Login/Signup** - Authentication pages
9. **Admin Panel** - Review submissions and manage content

## 🛠️ Tech Stack

### Frontend
- **React** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **Recharts** for data visualization
- **Lucide React** for icons
- **Vanilla CSS** with modern design system

### Backend
- **Node.js** with Express
- **JSON file-based database** (easily replaceable with MongoDB/PostgreSQL)
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** enabled

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone or navigate to the project directory**
```bash
cd "c:\Users\abdul\OneDrive\Desktop\Skill SPrint"
```

2. **Install Backend Dependencies**
```bash
cd server
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../client
npm install
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd server
npm run dev
```
Server will run on http://localhost:5000

### Start Frontend Development Server
```bash
cd client
npm run dev
```
Frontend will run on http://localhost:5173

## 👤 Demo Accounts

### Student Account
- Email: `user@skillsprint.com`
- Password: `user123`

### Admin Account
- Email: `admin@skillsprint.com`
- Password: `admin123`

## 📚 Available Skills

The platform comes pre-loaded with 5 skills:
1. **Web Design** (Beginner) - 5 challenges
2. **WordPress Development** (Intermediate) - 6 challenges
3. **Graphic Design** (Beginner) - 5 challenges
4. **Video Editing** (Intermediate) - 6 challenges
5. **JavaScript Programming** (Advanced) - 8 challenges

Each skill has multiple sequential challenges that unlock as you progress.

## 🎯 User Journey

1. **Sign up** for a new account or login with demo credentials
2. **Explore** available skills and choose one to start
3. **Enroll** in a skill to begin learning
4. **Complete challenges** by submitting your work
5. **Wait for admin approval** of your submissions
6. **Earn points and badges** as you progress
7. **Climb the leaderboard** and compete with others
8. **Track your progress** on the dashboard

## 🔧 Admin Features

Admins can:
- Review pending challenge submissions
- Approve or reject submissions with feedback
- Create new skills with custom details
- Add challenges to existing skills
- Manage user progress and badges

## 🎨 Design Features

- **Modern Aesthetics**: Vibrant gradients, glassmorphism effects
- **Smooth Animations**: Fade-ins, hover effects, transitions
- **Dark Mode**: Full dark/light theme support
- **Responsive**: Mobile-first design with breakpoints
- **Accessible**: Semantic HTML and ARIA labels
- **Performance**: Optimized loading and rendering

## 📁 Project Structure

```
Skill SPrint/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context (Auth, Theme)
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   └── package.json
│
└── server/                # Node.js backend
    ├── database/          # JSON database files
    ├── server.js          # Express server
    └── package.json
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/:id` - Get skill by ID
- `POST /api/skills` - Create skill (admin only)

### Challenges
- `GET /api/skills/:skillId/challenges` - Get challenges for skill
- `POST /api/challenges` - Create challenge (admin only)

### Progress
- `POST /api/progress/enroll` - Enroll in skill
- `GET /api/progress` - Get user progress

### Submissions
- `POST /api/submissions` - Submit challenge
- `GET /api/submissions` - Get user submissions
- `GET /api/admin/submissions` - Get all submissions (admin)
- `PATCH /api/submissions/:id/review` - Review submission (admin)

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard

### Profile
- `PATCH /api/profile` - Update profile
- `GET /api/users/:id` - Get user by ID

## 🌟 Future Enhancements

- Email notifications for submission reviews
- Real-time chat/forums for learners
- Certificate generation upon skill completion
- Integration with external learning resources
- Mobile apps (iOS/Android)
- Social sharing features
- Advanced analytics dashboard

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

Built with ❤️ using React, Node.js, and modern web technologies.
