# SmartSeason - Quick Start Guide

## 30-Second Setup

### Windows
```bash
cd SmartSeason
setup.bat
```

### macOS/Linux
```bash
cd SmartSeason
chmod +x setup.sh
./setup.sh
```

## Running the Application

**Terminal 1 - Start Backend (port 5000):**
```bash
cd SmartSeason/backend
npm start
```
Expected output: `SmartSeason server running on port 5000`

**Terminal 2 - Start Frontend (port 3000):**
```bash
cd SmartSeason/frontend
npm start
```
Expected output: Browser opens to http://localhost:3000

## First Login

1. Navigate to http://localhost:3000
2. Click "Login"
3. Use demo credentials:
   - **Email:** admin@smartseason.com
   - **Password:** admin123
4. Click Login

## Admin First Steps

1. **View Dashboard**: See stats and field overview
2. **Create a Field**: Click "Create New Field", fill details, create
3. **Manage Fields**: Click "Manage Fields" to see all fields in a table
4. **View Field Details**: Click "View Details" on any field

## Agent First Steps

1. After login, you'll see only your assigned fields
2. Click on a field to update it
3. Change the stage and add observations
4. Submit the update

## Common Tasks

### Create a Field (Admin)
1. Dashboard → "Create New Field"
2. Enter field name, crop type, planting date
3. Select an agent
4. Click "Create Field"

### Update Field Progress (Agent)
1. Dashboard → Click on a field
2. Select new stage from dropdown
3. Add observations in Notes field
4. Click "Update Field"
5. See the update in history

### Reassign a Field (Admin)
1. Go to field details
2. In the update form, change the agent dropdown
3. Click reassign

### View All Updates (Admin)
1. Open any field details
2. See complete update history on the right

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5000 in use | Change PORT in backend/.env |
| Port 3000 in use | Kill other process or use npx react-scripts start --port 3001 |
| Login fails | Verify backend is running, check console errors |
| No fields shown | Login as admin and create a field, or login as the assigned agent |
| "Cannot GET /" | Make sure you're on http://localhost:3000, not backend port |

## Architecture Overview

```
┌─────────────────────────────────────────┐
│        React Frontend (Port 3000)       │
│  - Login/Register pages                 │
│  - Admin Dashboard                      │
│  - Agent Dashboard                      │
│  - Field Detail & Update forms          │
└────────────────┬────────────────────────┘
                 │ HTTP Requests (JWT auth)
┌────────────────▼────────────────────────┐
│      Express Backend (Port 5000)        │
│  - Auth API (register/login)            │
│  - Field API (CRUD + updates)           │
│  - User API (stats/dashboard)           │
└────────────────┬────────────────────────┘
                 │ SQL Queries
┌────────────────▼────────────────────────┐
│    SQLite Database (smartseason.db)     │
│  - users (id, email, role, ...)         │
│  - fields (id, name, stage, ...)        │
│  - field_updates (id, field_id, ...)    │
└─────────────────────────────────────────┘
```

## API Quick Reference

All endpoints require JWT token in Authorization header (except auth endpoints):
```
Authorization: Bearer {token_from_login}
```

### Get Dashboard Stats
```bash
curl http://localhost:5000/api/users/dashboard/stats \
  -H "Authorization: Bearer {token}"
```

### Create Field
```bash
curl -X POST http://localhost:5000/api/fields \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "name": "North Field",
    "cropType": "Maize",
    "plantingDate": "2026-01-15",
    "agentId": 2
  }'
```

### Update Field Stage
```bash
curl -X PUT http://localhost:5000/api/fields/1/stage \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "newStage": "Growing",
    "notes": "Plants looking healthy"
  }'
```

## Next Steps

- **Test as both admin and agent** - Experience different role perspectives
- **Create multiple fields** - Test filtering and dashboard updates
- **Update fields** - See how status changes based on stage progression
- **Try reassigning** - Change which agent manages a field
- **Review code** - Check backend/src for architecture patterns
- **Deploy** - See deployment guide for live setup

## Demo Data Legend

- **Field Status**:
  - 🟢 Active: On schedule
  - 🟡 At Risk: Behind schedule (>20% over expected duration)
  - 🔵 Completed: Already harvested

- **Crop Types**: Any text (Maize, Wheat, Rice, Tomato, etc.)

- **Stages**: Planted → Growing → Ready → Harvested

---

**Need help?** Check the main README.md for detailed documentation.
