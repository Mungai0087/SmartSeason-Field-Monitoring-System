# SmartSeason - File & Code Navigation Guide

## Quick Navigation

This guide helps you find key files and understand the codebase structure.

---

## 📚 Documentation Files (Read First!)

### Getting Started
1. **[README.md](README.md)** - Start here! Complete documentation
   - Project overview
   - Setup instructions
   - Design decisions
   - API endpoints list
   - Assumptions & trade-offs
   - Troubleshooting

2. **[QUICKSTART.md](QUICKSTART.md)** - Fast 5-minute setup
   - Quick start commands
   - First login steps
   - Common tasks
   - Troubleshooting table

3. **[SUBMISSION_SUMMARY.md](SUBMISSION_SUMMARY.md)** - Project summary
   - What's included
   - Key features
   - File statistics
   - Evaluation criteria met

### Reference Documentation
- **[API.md](API.md)** - Complete API documentation
  - All endpoints
  - Request/response examples
  - Status codes
  - Example workflows
  
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment
  - Local setup
  - Heroku deployment
  - AWS EC2 deployment
  - Docker deployment
  - Database migration
  - Monitoring setup

- **[TESTING.md](TESTING.md)** - QA checklist
  - Pre-flight checks
  - Feature testing
  - Authorization testing
  - Security testing
  - Browser compatibility

---

## 🔧 Backend Code

### Entry Point
```
backend/src/app.js
├── Express server setup
├── Database initialization
├── Middleware configuration
├── Route mounting
└── Error handling
```

**What to look for**: Main server startup, CORS config, route registration

### Controllers (Business Logic)

```
backend/src/controllers/
├── authController.js        [120+ LOC]
│   ├── register()
│   ├── login()
│   └── getCurrentUser()
│
├── fieldController.js       [200+ LOC]
│   ├── createField()
│   ├── getAllFields()
│   ├── getMyFields()
│   ├── getField()
│   ├── updateFieldStage()
│   ├── calculateStatus()   ← KEY LOGIC FOR STATUS
│   ├── reassignField()
│   └── deleteField()
│
└── userController.js        [100+ LOC]
    ├── getAllUsers()
    ├── getAgents()
    └── getDashboardStats()
```

**Key feature: Status Calculation** - See `fieldController.js` lines 6-30 for the automated status logic.

### Models (Data Access Layer)

```
backend/src/models/
├── User.js
│   ├── create()
│   ├── findByEmail()
│   ├── findById()
│   ├── getAll()
│   └── getAgents()
│
├── Field.js
│   ├── create()
│   ├── findById()
│   ├── getAll()
│   ├── getByAgentId()
│   ├── updateStage()
│   ├── updateAssignedAgent()
│   └── delete()
│
└── FieldUpdate.js
    ├── create()
    ├── getByFieldId()
    └── getAll()
```

**What to look for**: Database queries, data access patterns, foreign key handling

### Routes (API Endpoints)

```
backend/src/routes/
├── auth.js                  [15 LOC]
│   ├── POST /register
│   ├── POST /login
│   └── GET /me
│
├── fields.js                [25 LOC]
│   ├── POST / (create)
│   ├── GET / (all fields)
│   ├── GET /my-fields
│   ├── GET /:id
│   ├── PUT /:id/stage
│   ├── PUT /:id/reassign
│   └── DELETE /:id
│
└── users.js                 [20 LOC]
    ├── GET / (all users)
    ├── GET /agents
    └── GET /dashboard/stats
```

**What to look for**: REST API design, route organization, middleware usage

### Middleware (Authentication & Authorization)

```
backend/src/middleware/auth.js [30+ LOC]
├── authenticateToken()     ← Verifies JWT on protected routes
└── authorizeRole()         ← Restricts to specific roles
```

**What to look for**: JWT verification, role-based access control

### Utilities

```
backend/src/utils/
├── database.js              [100+ LOC]
│   ├── Database initialization
│   ├── Schema creation
│   ├── Promise wrappers
│   └── Connection management
│
└── auth.js                  [50+ LOC]
    ├── hashPassword()
    ├── comparePassword()
    ├── generateToken()
    └── verifyToken()
```

**What to look for**: SQLite schema, password hashing, JWT operations

### Configuration Files

```
backend/
├── package.json             ← Dependencies list
├── .env.example             ← Environment template
└── .gitignore               ← Git ignore rules
```

---

## 🎨 Frontend Code

### Entry Point
```
frontend/src/
├── index.js                 [5 LOC]
│   └── React app initialization
│
├── App.js                   [50+ LOC]
│   ├── Route configuration
│   ├── Protected routes
│   └── Role-based redirects
│
└── index.html               [HTML Template]
```

**What to look for**: Routing setup, authentication flow

### Pages (React Components)

```
frontend/src/pages/
├── Login.js                 [50+ LOC]
│   └── Login form & authentication
│
├── Register.js              [70+ LOC]
│   └── Registration with role selection
│
├── AdminDashboard.js        [120+ LOC]
│   ├── Admin overview
│   ├── Stats display
│   └── Field grid
│
├── AgentDashboard.js        [120+ LOC]
│   ├── Agent overview
│   ├── Field statistics
│   └── Assigned fields only
│
├── FieldDetail.js           [140+ LOC]
│   ├── Field information
│   ├── Update form
│   └── Update history
│
├── CreateField.js           [120+ LOC]
│   ├── Field creation form
│   ├── Agent selection
│   └── Form validation
│
└── AdminFieldsList.js       [120+ LOC]
    ├── All fields table
    ├── Filtering
    ├── Sorting
    └── Delete functionality
```

**Key components**: 
- AdminDashboard - Shows global statistics
- AgentDashboard - Shows only assigned fields
- FieldDetail - Core update workflow

### Styles

```
frontend/src/styles/
├── Auth.css                 [Auth page styling]
├── Dashboard.css            [Dashboard layouts & cards]
├── FieldDetail.css          [Detail page layout]
├── CreateField.css          [Form styling]
├── FieldsList.css           [Table & list styling]
└── index.css                [Global styles]
```

**Color scheme**:
- Primary: #667eea (purple)
- Secondary: #764ba2 (dark purple)
- Active: #4CAF50 (green)
- At Risk: #ff9800 (orange)
- Completed: #2196F3 (blue)

### API Client

```
frontend/src/api.js         [150+ LOC]
├── authAPI
│   ├── register()
│   ├── login()
│   └── getCurrentUser()
├── fieldAPI
│   ├── createField()
│   ├── getAllFields()
│   ├── getMyFields()
│   ├── getField()
│   ├── updateFieldStage()
│   ├── reassignField()
│   └── deleteField()
└── userAPI
    ├── getAllUsers()
    ├── getAgents()
    └── getDashboardStats()
```

**What to look for**: HTTP requests, token handling, API layer abstraction

### Configuration

```
frontend/
├── package.json             ← Dependencies
├── public/index.html        ← HTML template
└── .gitignore               ← Git rules
```

---

## 🏗️ Data Model (Database Schema)

Located in: `backend/src/utils/database.js` (lines 4-60)

### users table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,          -- Unique identifier
  name TEXT NOT NULL,              -- User full name
  email TEXT UNIQUE NOT NULL,      -- Unique email
  password TEXT NOT NULL,          -- Hashed password
  role TEXT NOT NULL,              -- 'admin' or 'agent'
  created_at DATETIME DEFAULT NOW  -- Registration timestamp
)
```

### fields table
```sql
CREATE TABLE fields (
  id INTEGER PRIMARY KEY,                  -- Unique identifier
  name TEXT NOT NULL,                      -- Field name
  crop_type TEXT NOT NULL,                 -- Crop type
  planting_date DATE NOT NULL,             -- When planted
  current_stage TEXT NOT NULL,             -- Planted|Growing|Ready|Harvested
  agent_id INTEGER NOT NULL,               -- Assigned agent
  created_by INTEGER NOT NULL,             -- Admin who created
  created_at DATETIME DEFAULT NOW,         -- Creation time
  updated_at DATETIME DEFAULT NOW,         -- Last update time
  FOREIGN KEY(agent_id) REFERENCES users(id),
  FOREIGN KEY(created_by) REFERENCES users(id)
)
```

### field_updates table
```sql
CREATE TABLE field_updates (
  id INTEGER PRIMARY KEY,                  -- Unique identifier
  field_id INTEGER NOT NULL,               -- Which field
  updated_stage TEXT NOT NULL,             -- New stage
  notes TEXT,                              -- Agent observations
  updated_by INTEGER NOT NULL,             -- Who updated
  created_at DATETIME DEFAULT NOW,         -- Update timestamp
  FOREIGN KEY(field_id) REFERENCES fields(id),
  FOREIGN KEY(updated_by) REFERENCES users(id)
)
```

---

## 🔐 Authentication Flow

1. **Registration** (`authController.js`)
   - Validate input
   - Hash password with bcryptjs
   - Store in database
   - Confirm success

2. **Login** (`authController.js`)
   - Validate credentials
   - Compare hashed password
   - Generate JWT token
   - Return token to client

3. **Protected Requests**
   - Client sends token in Authorization header
   - `authenticateToken` middleware verifies
   - `authorizeRole` middleware checks permissions
   - Request proceeds or rejected 401/403

4. **Token Structure**
   - Payload: `{ id, email, role }`
   - Expiry: 7 days
   - Secret: `JWT_SECRET` env variable

---

## 📊 Status Calculation Logic

**Location**: `backend/src/controllers/fieldController.js` (lines 6-30)

**Algorithm**:
```javascript
if (stage === "Harvested") {
  status = "Completed"
} else if (daysElapsed > expectedDays * 1.2) {
  status = "At Risk"        // >20% over time
} else {
  status = "Active"
}
```

**Expected Days**:
- Planted: 7 days
- Growing: 60 days
- Ready: 14 days
- Harvested: Done

**Example**: A "Growing" field planted on day 1 would be:
- Active: Days 1-72
- At Risk: Days 72+

---

## 🚀 Key Workflows

### Admin Creates Field
```
AdminDashboard → "Create Field" 
  → CreateField page 
  → Form submission 
  → fieldAPI.createField() 
  → POST /fields 
  → Create in DB 
  → Redirect to AdminFieldsList
```

### Agent Updates Field
```
AgentDashboard → Click field 
  → FieldDetail page 
  → Select new stage + notes 
  → fieldAPI.updateFieldStage() 
  → PUT /fields/:id/stage 
  → Update field & create record 
  → Show in history
```

### Admin Views Dashboard
```
Login → AdminDashboard 
  → Load userAPI.getDashboardStats() 
  → GET /users/dashboard/stats 
  → Calculate stats 
  → Render cards + grid
```

---

## 📝 Code Quality Features

### Error Handling
- Try-catch blocks in all controllers
- Meaningful error messages
- Proper HTTP status codes
- Client-side validation

### Security
- Password hashing: bcryptjs (10 rounds)
- JWT validation: Verified on every protected request
- SQL injection prevention: Parameterized queries
- Role authorization: Checked before operations

### Performance
- Efficient database queries
- Foreign key relationships prevent orphaned data
- Dashboard stats can be cached
- React components optimize with keys

### Maintainability
- Modular architecture
- Clear naming conventions
- Separation of concerns
- Strategic comments

---

## 🧪 Testing

See **[TESTING.md](TESTING.md)** for comprehensive test checklist.

Quick smoke test:
1. Login as admin
2. Create field
3. Logout
4. Login as agent
5. Update field
6. Verify update appears

---

## 📚 Reading Path

**For Quick Understanding (15 min)**:
1. Read this file
2. Read QUICKSTART.md
3. Look at README.md design decisions section

**For Complete Understanding (1 hour)**:
1. Read all documentation files
2. Run the project
3. Review backend/src/ structure
4. Review frontend/src/ structure

**For Deep Dive (2-3 hours)**:
1. Review all code files
2. Trace through a complete workflow
3. Check API.md for all endpoints
4. Review DEPLOYMENT.md options

---

## 🎯 File Purpose Matrix

| File | Purpose | Importance |
|------|---------|-----------|
| app.js | Server startup | 🟥 Critical |
| authController.js | Login/auth logic | 🟥 Critical |
| fieldController.js | Field operations | 🟥 Critical |
| Field.js model | Field data access | 🟥 Critical |
| auth.js middleware | Request authentication | 🟥 Critical |
| App.js | React routing | 🟥 Critical |
| AdminDashboard.js | Admin UI | 🟧 Important |
| FieldDetail.js | Update interface | 🟧 Important |
| api.js | API client | 🟧 Important |
| Dashboard.css | UI styling | 🟨 Useful |

---

## 💡 Pro Tips for Code Review

1. **Start with README.md** - Understand the project first
2. **Check app.js** - See all routes and setup
3. **Review fieldController.js** - Key business logic
4. **Trace an API call** - Follow from React component → API → backend
5. **Check auth.js middleware** - See authorization pattern
6. **Review database.js** - Understand data model
7. **Check FieldDetail.js** - See complete React workflow
8. **Read tests** - TESTING.md shows all features

---

## 🔗 Quick Links

### Launch Commands
- Backend: `cd backend && npm start`
- Frontend: `cd frontend && npm start`

### Demo Credentials
- Admin: `admin@smartseason.com` / `admin123`
- Agent: `agent@smartseason.com` / `agent123`

### Documentation
- Setup: [QUICKSTART.md](QUICKSTART.md) (5 min)
- Full: [README.md](README.md) (15 min)
- API: [API.md](API.md) (reference)
- Deploy: [DEPLOYMENT.md](DEPLOYMENT.md) (advanced)
- Test: [TESTING.md](TESTING.md) (verification)

---

## 📞 Questions?

1. Check README.md troubleshooting section
2. Review relevant documentation file
3. Look at code comments
4. Check git commit history (when available)

---

**Happy code reviewing!** 🎉

This guide helps you navigate ~3000 lines of clean, well-organized code in about 15 minutes.
