# Baker's Suite API Documentation

**Base URL:** `http://localhost:3001/api/v1` (development)

**Production:** `https://api.bakerssuite.com/api/v1`

## Authentication

All endpoints except `/health` require authentication via Clerk.

Include the Clerk session token in the Authorization header:

```http
Authorization: Bearer <clerk_session_token>
```

## Response Format

### Success Response

```json
{
  "data": {
    // Response data
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional error details
    }
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `FORBIDDEN` | 403 | User lacks permission |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |

## Endpoints

### Health Check

#### GET /health

Check API health status.

**Authentication:** Not required

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123456
}
```

---

### Recipes

#### GET /recipes

Get all recipes for the authenticated user.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20, max: 100)
- `tags` (string[], optional): Filter by tags
- `search` (string, optional): Search by name

**Example Request:**
```http
GET /api/v1/recipes?page=1&limit=20&tags=sourdough,bread
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "clx123abc",
      "userId": "user_123",
      "name": "Sourdough Boule",
      "description": "Classic sourdough bread",
      "ingredients": [
        {
          "name": "bread flour",
          "quantity": 500,
          "unit": "g",
          "percentage": 100
        },
        {
          "name": "water",
          "quantity": 350,
          "unit": "g",
          "percentage": 70
        }
      ],
      "instructions": [
        "Mix flour and water",
        "Add starter and salt"
      ],
      "tags": ["sourdough", "bread"],
      "ratios": {
        "flour": 100,
        "water": 70,
        "salt": 2,
        "starter": 20
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

#### GET /recipes/:id

Get a single recipe by ID.

**Response:**
```json
{
  "data": {
    "id": "clx123abc",
    "name": "Sourdough Boule",
    // ... recipe fields
  }
}
```

**Errors:**
- `404 NOT_FOUND` - Recipe not found
- `403 FORBIDDEN` - Recipe belongs to another user

#### POST /recipes

Create a new recipe.

**Request Body:**
```json
{
  "name": "My Recipe",
  "description": "Optional description",
  "ingredients": [
    {
      "name": "flour",
      "quantity": 500,
      "unit": "g"
    }
  ],
  "instructions": [
    "Step 1",
    "Step 2"
  ],
  "tags": ["sourdough"]
}
```

**Response:**
```json
{
  "data": {
    "id": "clx123abc",
    "name": "My Recipe",
    // ... full recipe object
  }
}
```

**Errors:**
- `400 VALIDATION_ERROR` - Invalid input
- `403 FORBIDDEN` - Free tier limit reached (10 recipes)

#### PUT /recipes/:id

Update an existing recipe.

**Request Body:** Same as POST /recipes

**Response:** Updated recipe object

**Errors:**
- `404 NOT_FOUND` - Recipe not found
- `403 FORBIDDEN` - Recipe belongs to another user

#### DELETE /recipes/:id

Delete a recipe.

**Response:**
```json
{
  "data": {
    "message": "Recipe deleted successfully"
  }
}
```

---

### Bakes

#### GET /bakes

Get all bakes for the authenticated user.

**Query Parameters:**
- `page`, `limit` - Pagination
- `recipeId` (string, optional) - Filter by recipe

**Response:**
```json
{
  "data": [
    {
      "id": "clx456def",
      "userId": "user_123",
      "recipeId": "clx123abc",
      "rating": 4,
      "notes": "Turned out great!",
      "photos": ["https://..."],
      "issues": ["slightly-over-proofed"],
      "weather": {
        "temperature": 22,
        "humidity": 65,
        "pressure": 1013
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 30
  }
}
```

#### POST /bakes

Create a new bake log.

**Request Body:**
```json
{
  "recipeId": "clx123abc",
  "rating": 4,
  "notes": "Optional notes",
  "photos": ["https://..."],
  "issues": ["dense-crumb"]
}
```

---

### Starters

#### GET /starters

Get all sourdough starters.

**Response:**
```json
{
  "data": [
    {
      "id": "clx789ghi",
      "userId": "user_123",
      "name": "My Starter",
      "flourType": "Whole wheat",
      "createdDate": "2023-01-01T00:00:00.000Z",
      "feedingRatio": "1:1:1",
      "lastFed": "2024-01-01T08:00:00.000Z",
      "health": 5,
      "notes": "Very active"
    }
  ]
}
```

#### POST /starters

Create a new starter.

**Request Body:**
```json
{
  "name": "My Starter",
  "flourType": "All-purpose",
  "createdDate": "2023-01-01",
  "feedingRatio": "1:1:1"
}
```

#### POST /starters/:id/feedings

Log a starter feeding.

**Request Body:**
```json
{
  "ratio": "1:1:1",
  "observations": "Doubled in 4 hours",
  "riseHeight": 12.5
}
```

---

### Timelines

#### GET /timelines

Get all baking timelines.

**Query Parameters:**
- `status` (string, optional): Filter by status (ACTIVE, PAUSED, COMPLETED, CANCELLED)

**Response:**
```json
{
  "data": [
    {
      "id": "clx101jkl",
      "userId": "user_123",
      "recipeId": "clx123abc",
      "targetTime": "2024-01-02T08:00:00.000Z",
      "steps": [
        {
          "id": "step_1",
          "name": "Mix dough",
          "description": "Combine all ingredients",
          "startTime": "2024-01-01T20:00:00.000Z",
          "duration": 30,
          "temperature": 22,
          "completed": false
        }
      ],
      "status": "ACTIVE",
      "weather": {
        "temperature": 22,
        "humidity": 65
      },
      "createdAt": "2024-01-01T20:00:00.000Z"
    }
  ]
}
```

#### POST /timelines

Create a new baking timeline.

**Request Body:**
```json
{
  "recipeId": "clx123abc",
  "targetTime": "2024-01-02T08:00:00.000Z"
}
```

The API will automatically:
1. Fetch current weather data
2. Calculate optimal proofing times based on temperature
3. Generate timeline steps

#### PUT /timelines/:id/steps/:stepId

Mark a timeline step as completed.

**Request Body:**
```json
{
  "completed": true
}
```

---

### Weather

#### GET /weather/current

Get current weather data for the user's location.

**Query Parameters:**
- `lat` (number): Latitude
- `lon` (number): Longitude

**Response:**
```json
{
  "data": {
    "temperature": 22,
    "humidity": 65,
    "pressure": 1013,
    "location": "New York, NY",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Flavor Pairings

#### GET /flavor-pairings

Search for flavor pairings.

**Query Parameters:**
- `ingredient` (string, required): Search by ingredient name
- `category` (string, optional): Filter by category (sweet/savory)

**Response:**
```json
{
  "data": [
    {
      "id": "clx202mno",
      "ingredient1": "chocolate",
      "ingredient2": "orange",
      "confidence": 0.92,
      "compounds": ["limonene", "linalool"],
      "cuisine": ["french", "italian"],
      "category": "sweet"
    }
  ]
}
```

---

## Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **User Limit:** 1000 requests per hour per user

When rate limited, you'll receive a `429` error:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests, please try again later"
  }
}
```

Response headers:
- `X-RateLimit-Limit`: Total allowed requests
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)

## Pagination

All list endpoints support pagination:

**Request:**
```http
GET /api/v1/recipes?page=2&limit=20
```

**Response:**
```json
{
  "data": [...],
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": true
  }
}
```

## Webhooks

*Coming soon*

## SDKs

*JavaScript/TypeScript SDK coming soon*

## Support

For API support:
- Check this documentation
- Open an issue on GitHub
- Contact: api-support@bakerssuite.com
