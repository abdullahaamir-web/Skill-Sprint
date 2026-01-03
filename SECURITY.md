# SkillSprint Security Documentation

## 🔐 Security Measures Implemented

### 1. **Admin Role Protection** ✅

**Problem:** Initially, users could select "Admin" role during signup, allowing anyone to become an administrator.

**Solution:**
- **Frontend:** Removed role selector from signup form
- **Backend:** Hardcoded all new registrations to `'student'` role
- **Result:** Only existing admins can create new admin accounts

#### Code Changes:

**Frontend (`Signup.jsx`):**
```javascript
// Removed role from form state
const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
  // role: 'student' ❌ REMOVED
});

// Hardcoded student role in registration
await register(formData.email, formData.password, formData.name, 'student');

// Removed role selector UI
// <select name="role">... ❌ REMOVED
```

**Backend (`server.js`):**
```javascript
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body; // role removed from destructuring
  
  const newUser = {
    // ...
    role: 'student', // ✅ Always student for public registration
    // ...
  };
});
```

---

### 2. **How to Create Admin Accounts**

Since public signup is restricted to students only, here are the ways to create admin accounts:

#### Option 1: Direct Database Modification (Development Only)
1. Stop the server
2. Open `server/database/users.json`
3. Find the user you want to make admin
4. Change `"role": "student"` to `"role": "admin"`
5. Save and restart the server

#### Option 2: Create Admin Endpoint (Recommended for Production)
Add an admin-only endpoint to create new admins:

```javascript
// Add this to server.js
app.post('/api/admin/create-admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const users = await readDB(USERS_DB);
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = {
      id: String(users.length + 1),
      email,
      password: hashedPassword,
      name,
      role: 'admin', // Admin role
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      bio: 'Administrator',
      createdAt: new Date().toISOString(),
      streak: 0,
      points: 0
    };

    users.push(newAdmin);
    await writeDB(USERS_DB, users);

    const { password: _, ...adminWithoutPassword } = newAdmin;
    res.json(adminWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create admin' });
  }
});
```

Then add UI in Admin Panel to use this endpoint.

---

### 3. **Authentication & Authorization**

#### JWT Token-Based Authentication
- **Token Generation:** On login/signup, JWT token created with user ID, email, and role
- **Token Storage:** Stored in browser localStorage
- **Token Expiration:** 7 days
- **Token Validation:** Every protected API call validates token

#### Role-Based Access Control (RBAC)
```javascript
// Middleware to check authentication
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Middleware to check admin role
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}
```

#### Protected Routes
- **Student Routes:** Require authentication
  - `/api/progress/*`
  - `/api/submissions` (own submissions)
  - `/api/profile`

- **Admin Routes:** Require authentication + admin role
  - `/api/admin/submissions`
  - `/api/submissions/:id/review`
  - `/api/skills` (POST)
  - `/api/challenges` (POST)

---

### 4. **Password Security**

- **Hashing Algorithm:** bcrypt with salt rounds = 10
- **Password Requirements:** Minimum 6 characters (enforced in frontend)
- **Password Storage:** Never stored in plain text
- **Password Transmission:** Sent over HTTPS in production

```javascript
// Password hashing on registration
const hashedPassword = await bcrypt.hash(password, 10);

// Password verification on login
const validPassword = await bcrypt.compare(password, user.password);
```

---

### 5. **Frontend Route Protection**

```javascript
// ProtectedRoute component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" />;

  return children;
};

// Usage
<Route path="/admin" element={
  <ProtectedRoute adminOnly>
    <Admin />
  </ProtectedRoute>
} />
```

---

### 6. **API Security Best Practices**

#### Input Validation
- Email format validation
- Password length validation
- Required field checks

#### Error Handling
- Generic error messages (don't reveal system details)
- Proper HTTP status codes
- Consistent error format

#### CORS Configuration
```javascript
app.use(cors()); // Allow frontend to access API
```

For production, restrict to specific origin:
```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

---

### 7. **Data Privacy**

#### Password Exclusion
Always exclude password from API responses:
```javascript
const { password: _, ...userWithoutPassword } = user;
res.json(userWithoutPassword);
```

#### User Data Access
- Users can only view/edit their own data
- Admins can view all data for moderation

---

### 8. **Session Management**

- **Token Refresh:** Currently 7-day expiration (can add refresh tokens)
- **Logout:** Client-side token removal
- **Auto-login:** Token validated on page load

---

### 9. **Production Security Checklist**

Before deploying to production:

- [ ] Change JWT_SECRET to a strong, random value
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS/SSL
- [ ] Restrict CORS to specific domain
- [ ] Add rate limiting to prevent brute force
- [ ] Implement password strength requirements
- [ ] Add email verification
- [ ] Implement refresh tokens
- [ ] Add request logging
- [ ] Set up monitoring and alerts
- [ ] Use a real database (MongoDB, PostgreSQL)
- [ ] Implement backup strategy
- [ ] Add CSRF protection
- [ ] Sanitize user inputs
- [ ] Add security headers (helmet.js)

---

### 10. **Current Security Status**

✅ **Implemented:**
- Password hashing with bcrypt
- JWT authentication
- Role-based access control
- Protected routes (frontend & backend)
- Admin role protection
- Password exclusion from responses
- Input validation

⚠️ **For Production:**
- Use environment variables for secrets
- Implement HTTPS
- Add rate limiting
- Add email verification
- Use production database
- Implement refresh tokens
- Add security headers

---

## 🔒 Summary

The SkillSprint platform now has robust security measures:

1. **No one can self-assign admin role** - All public signups are students
2. **Only admins can review submissions** - Protected by middleware
3. **Only admins can create skills/challenges** - Protected by middleware
4. **Passwords are securely hashed** - Never stored in plain text
5. **Routes are protected** - Both frontend and backend validation
6. **Tokens expire** - 7-day expiration for security

The platform is secure for development and testing. For production deployment, follow the production security checklist above.
