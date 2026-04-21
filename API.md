# SmartSeason API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer {token}
```

Tokens are obtained from the `/auth/login` endpoint.

---

## Endpoints

### Authentication

#### Register User
Create a new account.

**Request:**
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "agent"
}
```

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "agent"
  }
}
```

#### Login
Authenticate and get JWT token.

**Request:**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "agent"
  }
}
```

#### Get Current User
Retrieve authenticated user information.

**Request:**
```http
GET /auth/me
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "agent",
  "created_at": "2026-04-20T10:30:00Z"
}
```

---

### Fields

#### Create Field (Admin Only)
Create a new field and assign to an agent.

**Request:**
```http
POST /fields
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "North Field A",
  "cropType": "Maize",
  "plantingDate": "2026-01-15",
  "agentId": 2
}
```

**Response (201 Created):**
```json
{
  "message": "Field created successfully",
  "field": {
    "id": 1,
    "name": "North Field A",
    "cropType": "Maize",
    "plantingDate": "2026-01-15",
    "currentStage": "Planted",
    "agentId": 2,
    "createdBy": 1
  }
}
```

#### Get All Fields
Retrieve all fields with calculated status. (Admin sees all, Agent might see filtered results).

**Request:**
```http
GET /fields
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "North Field A",
    "crop_type": "Maize",
    "planting_date": "2026-01-15",
    "current_stage": "Growing",
    "agent_name": "John Doe",
    "status": "Active",
    "created_at": "2026-04-20T10:30:00Z",
    "updated_at": "2026-04-22T14:15:00Z"
  }
]
```

#### Get Agent's Fields
Retrieve only fields assigned to the current agent.

**Request:**
```http
GET /fields/my-fields
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "North Field A",
    "crop_type": "Maize",
    "current_stage": "Growing",
    "status": "Active"
  }
]
```

#### Get Field Details
Retrieve detailed information about a specific field including update history.

**Request:**
```http
GET /fields/{id}
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "North Field A",
  "crop_type": "Maize",
  "planting_date": "2026-01-15",
  "current_stage": "Growing",
  "status": "Active",
  "updates": [
    {
      "id": 1,
      "field_id": 1,
      "updated_stage": "Growing",
      "notes": "Plants are growing well",
      "updated_by_name": "John Doe",
      "created_at": "2026-04-22T14:15:00Z"
    }
  ]
}
```

#### Update Field Stage
Update a field's current stage and add notes.

**Request:**
```http
PUT /fields/{id}/stage
Authorization: Bearer {token}
Content-Type: application/json

{
  "newStage": "Ready",
  "notes": "Field is ready for harvest"
}
```

**Response (200 OK):**
```json
{
  "message": "Field updated successfully",
  "field": {
    "id": 1,
    "current_stage": "Ready",
    "status": "Active"
  }
}
```

#### Reassign Field (Admin Only)
Assign a field to a different agent.

**Request:**
```http
PUT /fields/{id}/reassign
Authorization: Bearer {token}
Content-Type: application/json

{
  "agentId": 3
}
```

**Response (200 OK):**
```json
{
  "message": "Field reassigned successfully",
  "field": {
    "id": 1,
    "agent_id": 3
  }
}
```

#### Delete Field (Admin Only)
Remove a field from the system.

**Request:**
```http
DELETE /fields/{id}
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Field deleted successfully"
}
```

#### Get Field Updates
Retrieve the update history for a specific field.

**Request:**
```http
GET /fields/{id}/updates
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "field_id": 1,
    "updated_stage": "Growing",
    "notes": "Plants are healthy, no pests observed",
    "updated_by_name": "John Doe",
    "created_at": "2026-04-22T14:15:00Z"
  },
  {
    "id": 2,
    "field_id": 1,
    "updated_stage": "Ready",
    "notes": "Ready for harvest",
    "updated_by_name": "John Doe",
    "created_at": "2026-04-23T09:30:00Z"
  }
]
```

---

### Users & Dashboard

#### Get All Users (Admin Only)
List all users in the system.

**Request:**
```http
GET /users
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin",
    "created_at": "2026-04-20T10:00:00Z"
  },
  {
    "id": 2,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "agent",
    "created_at": "2026-04-20T10:30:00Z"
  }
]
```

#### Get All Agents
List all field agents.

**Request:**
```http
GET /users/agents
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": 2,
    "name": "John Doe",
    "email": "john@example.com"
  },
  {
    "id": 3,
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
]
```

#### Get Dashboard Statistics
Get dashboard data including field counts and status breakdown.

**Request:**
```http
GET /users/dashboard/stats
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "totalFields": 5,
  "statusBreakdown": {
    "active": 3,
    "atRisk": 1,
    "completed": 1
  },
  "stageBreakdown": {
    "planted": 1,
    "growing": 2,
    "ready": 1,
    "harvested": 1
  },
  "fields": [
    {
      "id": 1,
      "name": "North Field A",
      "current_stage": "Growing",
      "status": "Active"
    }
  ]
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (no token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Server Error |

---

## Error Response Format

All errors follow this format:

```json
{
  "error": "Description of the error"
}
```

Examples:
- `{"error": "Invalid credentials"}`
- `{"error": "Field not found"}`
- `{"error": "Insufficient permissions"}`

---

## Example Workflow

### 1. Register as Admin
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Coordinator",
    "email": "admin@smartseason.com",
    "password": "admin123",
    "role": "admin"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@smartseason.com",
    "password": "admin123"
  }'
# Save the returned token
```

### 3. Create a Field
```bash
curl -X POST http://localhost:5000/api/fields \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "name": "Field 1",
    "cropType": "Maize",
    "plantingDate": "2026-01-15",
    "agentId": 2
  }'
```

### 4. Get Dashboard Stats
```bash
curl http://localhost:5000/api/users/dashboard/stats \
  -H "Authorization: Bearer {token}"
```

---

## Field Status Calculation

Status is calculated based on:
- **Current Stage**: Planted, Growing, Ready, Harvested
- **Days Since Planting**: Current date - planting date
- **Expected Duration**: Each stage has an expected timeline

```
Field Status Rules:
├─ If stage == "Harvested" → Status = "Completed"
├─ If days > (expected_days * 1.2) → Status = "At Risk"
└─ Otherwise → Status = "Active"

Expected Days per Stage:
├─ Planted: 7 days
├─ Growing: 60 days
├─ Ready: 14 days
└─ Harvested: 0 days (field completed)
```

For example, a "Growing" stage field typically lasts 60 days. If it goes beyond 72 days (60 * 1.2), it's marked "At Risk".

---

## Rate Limiting

Currently no rate limiting is implemented. For production, add:
- 100 requests per hour per IP
- 1000 requests per day per user
- Exponential backoff on 429 responses

---

## Pagination

Currently not implemented. For large datasets, add query parameters:
- `?page=1` - Page number
- `?limit=20` - Results per page

---

**API Version**: 1.0
**Last Updated**: 2026-04-20
