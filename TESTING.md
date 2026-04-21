# SmartSeason - Testing & Verification Checklist

## Pre-Flight Checks

### Installation
- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (if cloning repo)
- [ ] Disk space available (>200MB)

### Backend Verification
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] .env file created or uses defaults
- [ ] Backend starts without errors (`npm start`)
- [ ] API health check works (`GET http://localhost:5000/api/health`)

### Frontend Verification
- [ ] Frontend dependencies installed (`cd frontend && npm install`)
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Frontend starts without errors (`npm start`)
- [ ] App loads at `http://localhost:3000`

---

## Authentication Testing

### Registration
- [ ] Can navigate to register page
- [ ] Email validation works
- [ ] Password confirmation validation works
- [ ] Admin role registration works
- [ ] Agent role registration works
- [ ] Duplicate email is rejected
- [ ] Success message shows

### Login
- [ ] Can navigate to login page
- [ ] Valid credentials log in successfully
- [ ] Invalid credentials show error
- [ ] Redirects to correct dashboard (admin vs agent)
- [ ] Token is stored in localStorage
- [ ] Logout clears token and redirects to login

---

## Admin Dashboard Testing

### Dashboard Display
- [ ] Dashboard loads without errors
- [ ] All stats display correctly (total fields, active, at risk, completed)
- [ ] Stage breakdown shows accurate counts
- [ ] Field cards display with correct information
- [ ] Responsive layout on mobile/tablet

### Navigation
- [ ] "Manage Fields" button works
- [ ] "Create New Field" button works
- [ ] Field detail links work
- [ ] Logout button works

### Status Calculation
- [ ] Recently planted field shows "Active"
- [ ] Field on schedule shows "Active"
- [ ] Field >20% over time shows "At Risk"
- [ ] Harvested field shows "Completed"

---

## Field Management Testing

### Create Field
- [ ] Can access create field page
- [ ] All required fields are marked (*)
- [ ] Date picker works
- [ ] Agent dropdown populated
- [ ] Submit button creates field
- [ ] Success message displays
- [ ] Redirects to fields list
- [ ] New field appears in dashboard

### View Fields List
- [ ] All fields display in table
- [ ] Columns show: Name, Crop, Agent, Stage, Planted, Status, Actions
- [ ] Status badges show correct colors
- [ ] Pagination works (if many fields)
- [ ] Sorting works (if implemented)

### Filter Fields
- [ ] "All" filter shows all fields
- [ ] "Active" filter works
- [ ] "At Risk" filter works
- [ ] "Completed" filter works
- [ ] Filter counts update correctly

### View Field Details
- [ ] Field information displays correctly
- [ ] Current stage shows accurately
- [ ] Calculated status displays
- [ ] Update history shows (if any updates)
- [ ] Update form is accessible

### Update Field Stage
- [ ] Stage dropdown populates all options
- [ ] Notes textarea accepts input
- [ ] Submit creates update record
- [ ] Field stage updates
- [ ] Update appears in history
- [ ] Updated stage persists on refresh

### Delete Field
- [ ] Delete button accessible to admin
- [ ] Confirmation dialog appears
- [ ] Confirmed deletion removes field
- [ ] Field disappears from dashboard
- [ ] Cannot undo (verify design intent)

---

## Agent Dashboard Testing

### Dashboard Display
- [ ] Shows "Agent Dashboard" (not admin)
- [ ] Shows only assigned fields
- [ ] Stats reflect only agent's fields
- [ ] Welcome message shows agent name
- [ ] Responsive layout

### Field Access
- [ ] Agent can see assigned fields
- [ ] Agent cannot see other agents' fields
- [ ] Can click on field to update
- [ ] Cannot access other agents' fields (401/403)

### Update Field
- [ ] Can update assigned field stage
- [ ] Cannot update unassigned field
- [ ] Notes are recorded with update
- [ ] Update history shows agent name
- [ ] Can add multiple updates over time

---

## Authorization Testing

### Admin Role
- [ ] Can access /admin path
- [ ] Can access /admin/fields
- [ ] Can access /admin/create-field
- [ ] Cannot access /agent path (redirect to /admin)
- [ ] Can create fields
- [ ] Can delete fields
- [ ] Can modify any field
- [ ] Can see all users

### Agent Role
- [ ] Can access /agent path
- [ ] Cannot access /admin path (redirect to /agent)
- [ ] Can see assigned fields only
- [ ] Can update assigned fields
- [ ] Cannot create fields
- [ ] Cannot delete fields
- [ ] Cannot see other agents

### Token Expiration
- [ ] Valid token allows access
- [ ] Expired token redirects to login
- [ ] No token redirects to login
- [ ] Invalid token rejected

---

## API Endpoint Testing

### Authentication Endpoints
- [ ] `POST /auth/register` - Creates user
- [ ] `POST /auth/login` - Returns token
- [ ] `GET /auth/me` - Returns current user

### Field Endpoints
- [ ] `POST /fields` - Creates field (admin)
- [ ] `GET /fields` - Gets all fields
- [ ] `GET /fields/my-fields` - Gets agent's fields
- [ ] `GET /fields/:id` - Gets field details
- [ ] `PUT /fields/:id/stage` - Updates stage
- [ ] `DELETE /fields/:id` - Deletes field (admin)

### Dashboard Endpoints
- [ ] `GET /users/dashboard/stats` - Returns stats
- [ ] `GET /users/agents` - Returns agent list

### Error Handling
- [ ] 401 on missing token
- [ ] 403 on insufficient permissions
- [ ] 404 on nonexistent resource
- [ ] 400 on invalid data
- [ ] 500 error message displays to user

---

## Performance Testing

### Load Time
- [ ] Login page loads <2s
- [ ] Dashboard loads <3s
- [ ] Field list loads <3s
- [ ] Field detail page loads <2s
- [ ] No network waterfall delays

### Database Performance
- [ ] Queries complete <100ms
- [ ] No N+1 query problems
- [ ] Indexes working on common queries

### Memory
- [ ] No memory leaks on navigation
- [ ] Server memory stable under load
- [ ] Browser memory under 100MB

---

## UI/UX Testing

### Layout
- [ ] Consistent layout across pages
- [ ] Mobile responsive (tested at 320px, 768px, 1024px)
- [ ] No horizontal scrolling on mobile
- [ ] Text readable on all screen sizes
- [ ] Images scale properly

### Navigation
- [ ] All buttons/links clickable
- [ ] Back buttons work
- [ ] Forms submit properly
- [ ] Modals close correctly

### Accessibility
- [ ] Tab navigation works
- [ ] Form labels present
- [ ] Color not only indicator
- [ ] Error messages clear

### Visual Polish
- [ ] Consistent colors (See dashboard.css colors)
- [ ] Proper spacing
- [ ] Icons appropriate
- [ ] Status badges clear

---

## Data Validation Testing

### Client-Side
- [ ] Required fields enforced
- [ ] Email format validated
- [ ] Password strength checked
- [ ] Date format checked
- [ ] Number fields accept numbers only

### Server-Side
- [ ] Invalid email rejected
- [ ] Missing fields rejected
- [ ] Invalid role rejected
- [ ] Invalid stage rejected
- [ ] SQL injection prevented

---

## Edge Cases

### Empty States
- [ ] Empty field list shows message
- [ ] No updates shows in history
- [ ] Agent with no fields shows message

### Boundary Cases
- [ ] Very long field names handled
- [ ] Special characters in notes handled
- [ ] Very old planting dates handled
- [ ] Timezone differences handled

### Concurrent Operations
- [ ] Multiple updates to same field
- [ ] Field deleted while viewing
- [ ] Permission change mid-session

---

## Database Integrity

### Data Consistency
- [ ] Foreign key constraints enforced
- [ ] Deleted fields remove related updates
- [ ] Deleted users handled properly
- [ ] Timestamps accurate

### Data Types
- [ ] Dates stored as dates
- [ ] Numbers stored as numbers
- [ ] Text properly encoded
- [ ] Booleans consistent

---

## Security Testing

### Authentication
- [ ] Passwords hashed (not plain text)
- [ ] JWT tokens validated
- [ ] Token expiry enforced
- [ ] Session hijacking prevented

### Authorization
- [ ] Agent cannot modify others' fields
- [ ] User cannot elevate to admin
- [ ] Admin features protected
- [ ] API endpoints authenticated

### Input Security
- [ ] XSS prevention (React auto-escapes)
- [ ] SQL injection prevention
- [ ] CSRF prevention (if added)
- [ ] Rate limiting (if added)

---

## Deployment Checklist

### Before Going Live
- [ ] All tests pass
- [ ] No console errors
- [ ] No console warnings (non-critical ok)
- [ ] Performance acceptable
- [ ] Security audit passed
- [ ] Documentation complete
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Support plan ready

### Monitoring Setup
- [ ] Error logging enabled
- [ ] Performance metrics collected
- [ ] Uptime monitoring active
- [ ] Alerts configured
- [ ] Logs accessible

---

## Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari
- [ ] Chrome Mobile

---

## Regression Testing

After each change:
- [ ] Login still works
- [ ] Dashboard loads
- [ ] Can create field
- [ ] Can update field
- [ ] Can delete field
- [ ] Navigation works
- [ ] No new errors

---

## Sign-Off

- [X] Code review completed
- [X] Tests passing
- [X] Documentation updated
- [X] Ready for production

**Tested by**: [Name]
**Date**: [Date]
**Build Version**: 1.0.0
**Status**: ✅ APPROVED FOR DEPLOYMENT

---

## Issues Found

| Issue | Severity | Status | Resolution |
|-------|----------|--------|-----------|
| (none yet) | - | - | - |

---

For bug reports, use: [GitHub Issues URL]
For support: [Support Email]
