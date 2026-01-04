import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const JWT_SECRET = 'skillsprint-secret-key-2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database file paths
const DB_DIR = path.join(__dirname, 'database');
const USERS_DB = path.join(DB_DIR, 'users.json');
const SKILLS_DB = path.join(DB_DIR, 'skills.json');
const CHALLENGES_DB = path.join(DB_DIR, 'challenges.json');
const SUBMISSIONS_DB = path.join(DB_DIR, 'submissions.json');
const PROGRESS_DB = path.join(DB_DIR, 'progress.json');
const BADGES_DB = path.join(DB_DIR, 'badges.json');
const SUBSCRIPTIONS_DB = path.join(DB_DIR, 'subscriptions.json');

// Initialize database
async function initDatabase() {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
    await fs.mkdir(path.join(__dirname, 'uploads'), { recursive: true });

    // Initialize users
    try {
      await fs.access(USERS_DB);
    } catch {
      const userPassword = await bcrypt.hash('user123', 10);

      const users = [
        {
          id: '1',
          email: 'noorshah@example.com',
          password: "$2a$10$znJyGTBAu1IP/O4wIgnzT.4i5U5ZosWF8YKyHjuSK/vN2LMGnSYIG",
          name: 'Syed Noor Ul Hassan',
          role: 'admin',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noorshah',
          bio: 'Platform Administrator',
          createdAt: "2026-01-03T20:21:10.351Z",
          streak: 0,
          points: 0
        },
        {
          id: '2',
          email: 'user@skillsprint.com',
          password: userPassword,
          name: 'Demo Student',
          role: 'student',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
          bio: 'Passionate learner',
          createdAt: new Date().toISOString(),
          streak: 5,
          points: 450
        }
      ];
      await fs.writeFile(USERS_DB, JSON.stringify(users, null, 2));
    }

    // Initialize skills
    try {
      await fs.access(SKILLS_DB);
    } catch {
      const skills = [
        {
          id: '1',
          title: 'Web Design',
          description: 'Master the fundamentals of modern web design, including layout, typography, color theory, and responsive design principles.',
          difficulty: 'Beginner',
          estimatedTime: '4 weeks',
          icon: '🎨',
          totalChallenges: 5,
          enrolledCount: 234,
          category: 'Design'
        },
        {
          id: '2',
          title: 'WordPress Development',
          description: 'Learn to build professional websites using WordPress, from basic setup to custom theme development.',
          difficulty: 'Intermediate',
          estimatedTime: '6 weeks',
          icon: '📝',
          totalChallenges: 6,
          enrolledCount: 189,
          category: 'Development'
        },
        {
          id: '3',
          title: 'Graphic Design',
          description: 'Create stunning visual content using industry-standard design principles and tools.',
          difficulty: 'Beginner',
          estimatedTime: '5 weeks',
          icon: '🖼️',
          totalChallenges: 5,
          enrolledCount: 312,
          category: 'Design'
        },
        {
          id: '4',
          title: 'Video Editing',
          description: 'Learn professional video editing techniques, transitions, effects, and storytelling through video.',
          difficulty: 'Intermediate',
          estimatedTime: '7 weeks',
          icon: '🎬',
          totalChallenges: 6,
          enrolledCount: 156,
          category: 'Media'
        },
        {
          id: '5',
          title: 'JavaScript Programming',
          description: 'Master JavaScript from basics to advanced concepts including ES6+, async programming, and modern frameworks.',
          difficulty: 'Advanced',
          estimatedTime: '8 weeks',
          icon: '💻',
          totalChallenges: 8,
          enrolledCount: 421,
          category: 'Development'
        }
      ];
      await fs.writeFile(SKILLS_DB, JSON.stringify(skills, null, 2));
    }

    // Initialize challenges
    try {
      await fs.access(CHALLENGES_DB);
    } catch {
      const challenges = [
        // Web Design Challenges
        { id: '1', skillId: '1', order: 1, title: 'Understanding Design Principles', description: 'Learn about balance, contrast, hierarchy, and white space in web design.', instructions: 'Read the provided resources and create a mood board with examples of good design principles.', resources: ['https://www.interaction-design.org/literature/article/the-building-blocks-of-visual-design'] },
        { id: '2', skillId: '1', order: 2, title: 'Color Theory Basics', description: 'Master color combinations and psychology in web design.', instructions: 'Create 3 color palettes for different website types (corporate, creative, e-commerce).', resources: ['https://color.adobe.com'] },
        { id: '3', skillId: '1', order: 3, title: 'Typography Fundamentals', description: 'Learn to choose and pair fonts effectively.', instructions: 'Design a typography system with heading and body font combinations.', resources: ['https://fonts.google.com'] },
        { id: '4', skillId: '1', order: 4, title: 'Responsive Layout Design', description: 'Create layouts that work on all devices.', instructions: 'Design a responsive homepage layout for mobile, tablet, and desktop.', resources: [] },
        { id: '5', skillId: '1', order: 5, title: 'Complete Website Mockup', description: 'Design a full website mockup applying all learned principles.', instructions: 'Create a complete 3-page website design in Figma or Adobe XD.', resources: [] },

        // WordPress Challenges
        { id: '6', skillId: '2', order: 1, title: 'Install WordPress Locally', description: 'Set up a local WordPress development environment.', instructions: 'Install WordPress using XAMPP or Local by Flywheel and access the admin dashboard.', resources: ['https://wordpress.org/download/'] },
        { id: '7', skillId: '2', order: 2, title: 'Create Your First Page', description: 'Build a homepage using the WordPress editor.', instructions: 'Create a homepage with header, hero section, and footer using Gutenberg blocks.', resources: [] },
        { id: '8', skillId: '2', order: 3, title: 'Install and Configure Elementor', description: 'Learn to use the Elementor page builder.', instructions: 'Install Elementor plugin and recreate your homepage using Elementor widgets.', resources: ['https://elementor.com/'] },
        { id: '9', skillId: '2', order: 4, title: 'Build a Landing Page', description: 'Create a conversion-focused landing page.', instructions: 'Design and build a product landing page with CTA buttons and contact form.', resources: [] },
        { id: '10', skillId: '2', order: 5, title: 'Customize Theme Settings', description: 'Learn theme customization and branding.', instructions: 'Customize colors, fonts, and layout settings in your WordPress theme.', resources: [] },
        { id: '11', skillId: '2', order: 6, title: 'Create a Blog Section', description: 'Set up and style a blog with posts and categories.', instructions: 'Create 5 blog posts with featured images, categories, and tags.', resources: [] },

        // Graphic Design Challenges
        { id: '12', skillId: '3', order: 1, title: 'Logo Design Basics', description: 'Learn the principles of effective logo design.', instructions: 'Create 3 logo concepts for a fictional company.', resources: [] },
        { id: '13', skillId: '3', order: 2, title: 'Social Media Graphics', description: 'Design engaging social media posts.', instructions: 'Create a set of 5 Instagram posts with consistent branding.', resources: [] },
        { id: '14', skillId: '3', order: 3, title: 'Poster Design', description: 'Create an eye-catching event poster.', instructions: 'Design a poster for a music festival or conference.', resources: [] },
        { id: '15', skillId: '3', order: 4, title: 'Brand Identity Package', description: 'Develop a complete brand identity system.', instructions: 'Create a brand guide with logo, colors, typography, and usage examples.', resources: [] },
        { id: '16', skillId: '3', order: 5, title: 'Marketing Materials', description: 'Design professional marketing collateral.', instructions: 'Create a business card, flyer, and email signature.', resources: [] },

        // Video Editing Challenges
        { id: '17', skillId: '4', order: 1, title: 'Basic Cuts and Transitions', description: 'Learn fundamental editing techniques.', instructions: 'Edit a 1-minute video using basic cuts and 3 different transitions.', resources: [] },
        { id: '18', skillId: '4', order: 2, title: 'Color Grading Basics', description: 'Enhance your videos with color correction.', instructions: 'Apply color grading to create 3 different moods (warm, cool, cinematic).', resources: [] },
        { id: '19', skillId: '4', order: 3, title: 'Audio Mixing', description: 'Balance dialogue, music, and sound effects.', instructions: 'Edit a video with background music, voiceover, and sound effects properly mixed.', resources: [] },
        { id: '20', skillId: '4', order: 4, title: 'Motion Graphics', description: 'Add animated text and graphics to videos.', instructions: 'Create a 30-second intro with animated text and logo.', resources: [] },
        { id: '21', skillId: '4', order: 5, title: 'Short Film Project', description: 'Create a complete short video project.', instructions: 'Edit a 2-3 minute short film or promotional video with all learned techniques.', resources: [] },
        { id: '22', skillId: '4', order: 6, title: 'YouTube Video Production', description: 'Learn YouTube-specific editing techniques.', instructions: 'Create a YouTube video with intro, outro, lower thirds, and end screen.', resources: [] },

        // JavaScript Challenges
        { id: '23', skillId: '5', order: 1, title: 'JavaScript Fundamentals', description: 'Master variables, data types, and operators.', instructions: 'Complete 10 coding exercises covering JS basics.', resources: ['https://javascript.info/'] },
        { id: '24', skillId: '5', order: 2, title: 'Functions and Scope', description: 'Understand functions, closures, and scope.', instructions: 'Build a calculator using functions and proper scope management.', resources: [] },
        { id: '25', skillId: '5', order: 3, title: 'DOM Manipulation', description: 'Learn to interact with HTML elements using JavaScript.', instructions: 'Create an interactive to-do list with add, delete, and mark complete features.', resources: [] },
        { id: '26', skillId: '5', order: 4, title: 'ES6+ Features', description: 'Master modern JavaScript syntax and features.', instructions: 'Refactor old code using arrow functions, destructuring, and template literals.', resources: [] },
        { id: '27', skillId: '5', order: 5, title: 'Async JavaScript', description: 'Work with promises, async/await, and APIs.', instructions: 'Build a weather app that fetches data from an API.', resources: [] },
        { id: '28', skillId: '5', order: 6, title: 'Object-Oriented Programming', description: 'Learn classes, inheritance, and OOP principles.', instructions: 'Create a game using OOP concepts (e.g., a simple RPG character system).', resources: [] },
        { id: '29', skillId: '5', order: 7, title: 'Error Handling', description: 'Implement proper error handling and debugging.', instructions: 'Add comprehensive error handling to your previous projects.', resources: [] },
        { id: '30', skillId: '5', order: 8, title: 'Final Project', description: 'Build a complete JavaScript application.', instructions: 'Create a full-featured web application combining all learned concepts.', resources: [] }
      ];
      await fs.writeFile(CHALLENGES_DB, JSON.stringify(challenges, null, 2));
    }

    // Initialize other databases
    if (!await fileExists(SUBMISSIONS_DB)) {
      await fs.writeFile(SUBMISSIONS_DB, JSON.stringify([], null, 2));
    }
    if (!await fileExists(PROGRESS_DB)) {
      await fs.writeFile(PROGRESS_DB, JSON.stringify([], null, 2));
    }
    if (!await fileExists(BADGES_DB)) {
      const badges = [
        { id: '1', name: 'First Steps', description: 'Complete your first challenge', icon: '🎯', requirement: 'complete_1_challenge' },
        { id: '2', name: 'Quick Learner', description: 'Complete 5 challenges', icon: '⚡', requirement: 'complete_5_challenges' },
        { id: '3', name: 'Dedicated', description: 'Maintain a 7-day streak', icon: '🔥', requirement: '7_day_streak' },
        { id: '4', name: 'Skill Master', description: 'Complete an entire skill', icon: '🏆', requirement: 'complete_skill' },
        { id: '5', name: 'Overachiever', description: 'Complete 3 skills', icon: '⭐', requirement: 'complete_3_skills' },
        { id: '6', name: 'Top Performer', description: 'Reach top 10 on leaderboard', icon: '👑', requirement: 'top_10_leaderboard' }
      ];
      await fs.writeFile(BADGES_DB, JSON.stringify(badges, null, 2));
    }

    // Initialize subscriptions
    if (!await fileExists(SUBSCRIPTIONS_DB)) {
      await fs.writeFile(SUBSCRIPTIONS_DB, JSON.stringify([], null, 2));
    }

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Helper functions
async function readDB(filePath) {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

async function writeDB(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Middleware: Verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Middleware: Check admin role
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// ============ AUTH ROUTES ============

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const users = await readDB(USERS_DB);

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // SECURITY: Force all new registrations to be 'student' role
    // Only existing admins can create new admin accounts through admin panel
    const newUser = {
      id: String(users.length + 1),
      email,
      password: hashedPassword,
      name,
      role: 'student', // Always student for public registration
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      bio: '',
      createdAt: new Date().toISOString(),
      streak: 0,
      points: 0
    };

    users.push(newUser);
    await writeDB(USERS_DB, users);

    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await readDB(USERS_DB);
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const users = await readDB(USERS_DB);
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ============ SKILLS ROUTES ============

// Get all skills
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await readDB(SKILLS_DB);
    const { search, difficulty, sort } = req.query;

    let filtered = skills;

    if (search) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (difficulty) {
      filtered = filtered.filter(s => s.difficulty === difficulty);
    }

    if (sort === 'popular') {
      filtered.sort((a, b) => b.enrolledCount - a.enrolledCount);
    }

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// Get skill by ID
app.get('/api/skills/:id', async (req, res) => {
  try {
    const skills = await readDB(SKILLS_DB);
    const skill = skills.find(s => s.id === req.params.id);

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    const challenges = await readDB(CHALLENGES_DB);
    const skillChallenges = challenges.filter(c => c.skillId === req.params.id);

    res.json({ ...skill, challenges: skillChallenges });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skill' });
  }
});

// Create skill (admin only)
app.post('/api/skills', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const skills = await readDB(SKILLS_DB);
    const newSkill = {
      id: String(skills.length + 1),
      ...req.body,
      enrolledCount: 0
    };
    skills.push(newSkill);
    await writeDB(SKILLS_DB, skills);
    res.json(newSkill);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

// ============ CHALLENGES ROUTES ============

// Get challenges for a skill
app.get('/api/skills/:skillId/challenges', async (req, res) => {
  try {
    const challenges = await readDB(CHALLENGES_DB);
    const skillChallenges = challenges.filter(c => c.skillId === req.params.skillId);
    res.json(skillChallenges);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

// Create challenge (admin only)
app.post('/api/challenges', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const challenges = await readDB(CHALLENGES_DB);
    const newChallenge = {
      id: String(challenges.length + 1),
      ...req.body
    };
    challenges.push(newChallenge);
    await writeDB(CHALLENGES_DB, challenges);
    res.json(newChallenge);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create challenge' });
  }
});

// ============ PROGRESS ROUTES ============

// Enroll in skill
app.post('/api/progress/enroll', authenticateToken, async (req, res) => {
  try {
    const { skillId } = req.body;
    const progress = await readDB(PROGRESS_DB);

    const existing = progress.find(p => p.userId === req.user.id && p.skillId === skillId);
    if (existing) {
      return res.status(400).json({ error: 'Already enrolled' });
    }

    const newProgress = {
      id: String(progress.length + 1),
      userId: req.user.id,
      skillId,
      enrolledAt: new Date().toISOString(),
      completedChallenges: [],
      currentChallenge: 1
    };

    progress.push(newProgress);
    await writeDB(PROGRESS_DB, progress);

    // Update skill enrolled count
    const skills = await readDB(SKILLS_DB);
    const skill = skills.find(s => s.id === skillId);
    if (skill) {
      skill.enrolledCount++;
      await writeDB(SKILLS_DB, skills);
    }

    res.json(newProgress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to enroll' });
  }
});

// Get user progress
app.get('/api/progress', authenticateToken, async (req, res) => {
  try {
    const progress = await readDB(PROGRESS_DB);
    const userProgress = progress.filter(p => p.userId === req.user.id);

    const skills = await readDB(SKILLS_DB);
    const challenges = await readDB(CHALLENGES_DB);

    const enrichedProgress = userProgress.map(p => {
      const skill = skills.find(s => s.id === p.skillId);
      const skillChallenges = challenges.filter(c => c.skillId === p.skillId);
      return {
        ...p,
        skill,
        totalChallenges: skillChallenges.length,
        completionPercentage: (p.completedChallenges.length / skillChallenges.length) * 100
      };
    });

    res.json(enrichedProgress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// ============ SUBMISSIONS ROUTES ============

// Submit challenge
app.post('/api/submissions', authenticateToken, async (req, res) => {
  try {
    const { challengeId, skillId, submissionType, content } = req.body;

    const submissions = await readDB(SUBMISSIONS_DB);
    const newSubmission = {
      id: String(submissions.length + 1),
      userId: req.user.id,
      challengeId,
      skillId,
      submissionType,
      content,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    submissions.push(newSubmission);
    await writeDB(SUBMISSIONS_DB, submissions);

    res.json(newSubmission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit challenge' });
  }
});

// Get user submissions
app.get('/api/submissions', authenticateToken, async (req, res) => {
  try {
    const submissions = await readDB(SUBMISSIONS_DB);
    const userSubmissions = submissions.filter(s => s.userId === req.user.id);
    res.json(userSubmissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Get all submissions (admin only)
app.get('/api/admin/submissions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const submissions = await readDB(SUBMISSIONS_DB);
    const users = await readDB(USERS_DB);
    const challenges = await readDB(CHALLENGES_DB);

    const enriched = submissions.map(s => {
      const user = users.find(u => u.id === s.userId);
      const challenge = challenges.find(c => c.id === s.challengeId);
      return { ...s, user, challenge };
    });

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Review submission (admin only)
app.patch('/api/submissions/:id/review', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const submissions = await readDB(SUBMISSIONS_DB);
    const submission = submissions.find(s => s.id === req.params.id);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    submission.status = status;
    submission.feedback = feedback;
    submission.reviewedAt = new Date().toISOString();

    await writeDB(SUBMISSIONS_DB, submissions);

    // If approved, update progress
    if (status === 'approved') {
      const progress = await readDB(PROGRESS_DB);
      const userProgress = progress.find(p =>
        p.userId === submission.userId && p.skillId === submission.skillId
      );

      if (userProgress && !userProgress.completedChallenges.includes(submission.challengeId)) {
        userProgress.completedChallenges.push(submission.challengeId);
        userProgress.currentChallenge++;
        await writeDB(PROGRESS_DB, progress);

        // Update user points
        const users = await readDB(USERS_DB);
        const user = users.find(u => u.id === submission.userId);
        if (user) {
          user.points += 50;
          await writeDB(USERS_DB, users);
        }
      }
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to review submission' });
  }
});

// ============ LEADERBOARD ROUTES ============

app.get('/api/leaderboard', async (req, res) => {
  try {
    const users = await readDB(USERS_DB);
    const progress = await readDB(PROGRESS_DB);

    const leaderboard = users
      .filter(u => u.role === 'student')
      .map(user => {
        const userProgress = progress.filter(p => p.userId === user.id);
        const totalChallenges = userProgress.reduce((sum, p) => sum + p.completedChallenges.length, 0);

        return {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          points: user.points,
          streak: user.streak,
          challengesCompleted: totalChallenges
        };
      })
      .sort((a, b) => b.points - a.points);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// ============ BADGES ROUTES ============

app.get('/api/badges', async (req, res) => {
  try {
    const badges = await readDB(BADGES_DB);
    res.json(badges);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch badges' });
  }
});

// ============ PROFILE ROUTES ============

app.patch('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const users = await readDB(USERS_DB);
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await writeDB(USERS_DB, users);

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user profile by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const users = await readDB(USERS_DB);
    const user = users.find(u => u.id === req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const progress = await readDB(PROGRESS_DB);
    const userProgress = progress.filter(p => p.userId === req.params.id);

    const { password: _, ...userWithoutPassword } = user;
    res.json({ ...userWithoutPassword, progress: userProgress });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ============ STATS ROUTES ============

app.get('/api/stats', async (req, res) => {
  try {
    const users = await readDB(USERS_DB);
    const skills = await readDB(SKILLS_DB);
    const submissions = await readDB(SUBMISSIONS_DB);

    const stats = {
      totalUsers: users.filter(u => u.role === 'student').length,
      totalSkills: skills.length,
      totalChallenges: submissions.filter(s => s.status === 'approved').length,
      activeToday: Math.floor(users.length * 0.3) // Mock data
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ============ NEWSLETTER ROUTES ============

app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const subscriptions = await readDB(SUBSCRIPTIONS_DB);
    if (subscriptions.find(s => s.email === email)) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }

    subscriptions.push({
      email,
      subscribedAt: new Date().toISOString()
    });

    await writeDB(SUBSCRIPTIONS_DB, subscriptions);
    res.json({ message: 'Subscribed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Subscription failed' });
  }
});

// Start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
