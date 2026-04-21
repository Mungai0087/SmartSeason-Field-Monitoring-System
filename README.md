# SmartSeason Field Monitoring System

A full-stack web application for tracking crop progress across multiple fields during a growing season. Built to demonstrate clean system design, reliable functionality, and intuitive UI.

## Features

### User Roles
- **Admin (Coordinator)**: Manage all fields, assign fields to agents, monitor updates
- **Field Agent**: View assigned fields, update field progress, add observations

### Core Functionality
- **Field Management**: Create and manage fields with crop type, planting date, and current stage
- **Field Stages**: Planted → Growing → Ready → Harvested
- **Field Status**: Automatically calculated based on field data:
  - **Active**: Field is progressing on schedule
  - **At Risk**: Field is behind schedule (>20% over expected time for current stage)
  - **Completed**: Field has been harvested
- **Update Tracking**: Field agents can update stages and add notes; admins can view all updates
- **Role-Based Access**: Agents only see assigned fields; admins see all fields

### Dashboards
- **Admin Dashboard**: Overview of all fields with status breakdown, create/manage fields
- **Agent Dashboard**: Overview of assigned fields with status metrics

## Design Decisions

### Technology Stack
- **Backend**: Node.js + Express (fast development, simple API)
- **Frontend**: React (modular components, client-side routing)
- **Database**: SQLite (zero-dependency, perfect for demo; can swap to PostgreSQL)
- **Authentication**: JWT tokens (stateless, scalable)

### Status Calculation Logic
Each field has an expected duration per stage (Planted: 7 days, Growing: 60 days, Ready: 14 days). If a field exceeds its expected duration by more than 20%, it's marked "At Risk". This allows admins to identify fields that need attention without requiring manual input.

### Architecture
- **Clean Separation**: Controllers handle business logic, models manage data, middleware handles auth
- **Reusable Components**: React components are modular and self-contained
- **Protected Routes**: Role-based access control ensures users only see relevant data

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd SmartSeason/backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Update .env if needed (defaults work fine for demo)
   ```

3. **Start Server**
   ```bash
   npm start
   # Server runs on http://localhost:5000
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd SmartSeason/frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   # App runs on http://localhost:3000
   ```

## Demo Credentials

### Admin Account
- **Email**: admin@smartseason.com
- **Password**: admin123
- **Role**: Admin (Coordinator)

### Field Agent Account
- **Email**: agent@smartseason.com
- **Password**: agent123
- **Role**: Field Agent

### Demo Setup Script
Run this to populate the database with demo data:

```javascript
// Run this in the backend directory after starting the server
// POST to http://localhost:5000/api/auth/register

// Create admin
{
  "name": "Admin Coordinator",
  "email": "admin@smartseason.com",
  "password": "admin123",
  "role": "admin"
}

// Create agents
{
  "name": "John Agent",
  "email": "agent@smartseason.com",
  "password": "agent123",
  "role": "agent"
}

{
  "name": "Jane Agent",
  "email": "jane.agent@smartseason.com",
  "password": "agent123",
  "role": "agent"
}
```

Then as admin, create fields:
```javascript
// POST to http://localhost:5000/api/fields
// Headers: Authorization: Bearer {token}

{
  "name": "North Field A",
  "cropType": "Maize",
  "plantingDate": "2026-01-15",
  "agentId": 2
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Fields
- `POST /api/fields` - Create field (admin)
- `GET /api/fields` - Get all fields
- `GET /api/fields/my-fields` - Get agent's assigned fields
- `GET /api/fields/:id` - Get field details
- `PUT /api/fields/:id/stage` - Update field stage
- `PUT /api/fields/:id/reassign` - Reassign to different agent (admin)
- `DELETE /api/fields/:id` - Delete field (admin)

### Users & Dashboard
- `GET /api/users` - Get all users (admin)
- `GET /api/users/agents` - Get all agents
- `GET /api/users/dashboard/stats` - Get dashboard statistics

## Project Structure

```
SmartSeason/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, error handling
│   │   ├── utils/           # Database, auth utilities
│   │   └── app.js           # Express app
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/           # Page components
    │   ├── styles/          # CSS files
    │   ├── api.js           # API client
    │   ├── App.js           # Route config
    │   └── index.js         # Entry point
    ├── public/
    │   └── index.html
    ├── package.json
    └── .gitignore
```

## Key Files

- **Backend**: [backend/src/app.js](backend/src/app.js) - Express server
- **Frontend**: [frontend/src/App.js](frontend/src/App.js) - React routing
- **Auth Logic**: [backend/src/utils/auth.js](backend/src/utils/auth.js)
- **Status Calculation**: [backend/src/controllers/fieldController.js](backend/src/controllers/fieldController.js#L6)
- **Database Schema**: [backend/src/utils/database.js](backend/src/utils/database.js#L4)

## Assumptions & Trade-Offs

1. **SQLite for Demo**: Using SQLite for easy setup. Production would use PostgreSQL with connection pooling.

2. **Simple Status Logic**: Using time-based thresholds (20% over expected duration) for "At Risk" status. Real systems might use weather data, pest reports, soil conditions, etc.

3. **JWT Expiry**: Tokens expire in 7 days. No refresh token mechanism for simplicity.

4. **No Field Photos**: Focused on core functionality. Photos could be added via file upload service.

5. **Minimal Validation**: Client and server validation is basic. Production needs stricter validation.

6. **No Real-time Updates**: Using REST API. Real-time updates would need WebSockets.

7. **Single Server**: Frontend and backend run separately. For production, consider a monorepo setup or separate deployments.

## Testing the Application

### Admin Workflow
1. Login as admin
2. View dashboard with all fields and status breakdown
3. Click "Create New Field"
4. Fill in field details and assign to an agent
5. View all fields in the table
6. Click on a field to see details and update history

### Agent Workflow
1. Login as field agent
2. View dashboard with only assigned fields
3. Click on a field to update
4. Change the stage and add observations
5. See update history

## Future Enhancements

- Weather API integration for better "At Risk" determination
- Photo upload for field updates
- Export reports (PDF/CSV)
- Real-time notifications via WebSockets
- Mobile app for field agents
- Advanced analytics and charts
- Multi-language support
- Field mapping/GPS coordinates

## Performance Notes

- Database queries are basic. Add indexes for large datasets.
- Frontend lists use React keys for efficient rendering.
- Consider pagination for large field lists.
- Add caching headers for static assets.

## Security Notes

- Passwords are hashed with bcryptjs (10 rounds)
- JWT tokens are signed and verified
- CORS is enabled (configure for production)
- Input validation is minimal - enhance for production
- No SQL injection risk (using parameterized queries)

## Troubleshooting

**"Cannot find module" errors**
```bash
npm install
```

**Port already in use**
- Backend: Change PORT in .env
- Frontend: Set REACT_APP_PORT environment variable

**Database locked**
- Delete `smartseason.db` and restart backend

**Login fails**
- Verify demo accounts exist (check network tab for 401/403 errors)
- Check token is being stored in localStorage

## Development Tips

- Backend hot-reload: Install nodemon (`npm install -D nodemon`)
- Frontend hot-reload: Already included with react-scripts
- Debug: Check browser console (frontend) and server terminal (backend)
- API Testing: Use Postman or curl

---

**Deadline**: 25/04/2026
**Status**: Ready for submission ✓
