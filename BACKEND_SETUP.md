# 🔧 Backend Architecture Setup

This document explains the backend architecture that matches the reference repository structure.

## 📁 API Routes Structure

The backend is organized using Next.js App Router API routes:

```
app/api/
├── courses/
│   ├── route.js                    # GET (list), POST (create)
│   └── [courseId]/
│       ├── route.js                # GET, PUT, DELETE specific course
│       └── by-id/
│           └── route.js            # PUT (update by database ID)
├── chapters/
│   ├── route.js                     # GET, POST chapters
│   └── [courseId]/
│       └── route.js                 # DELETE all chapters for a course
├── youtube/
│   └── route.js                     # GET (search videos)
└── ai/
    ├── generate-layout/
    │   └── route.js                 # POST (generate course layout)
    └── generate-content/
        └── route.js                 # POST (generate chapter content)
```

## 🔌 API Endpoints

### Courses API

#### `GET /api/courses`
- **Description**: Get all courses for authenticated user
- **Query Params**: 
  - `published=true` - Get all published courses (for showcase)
- **Response**: Array of course objects
- **Auth**: Required (except for published=true)

#### `POST /api/courses`
- **Description**: Create a new course
- **Body**: 
  ```json
  {
    "courseId": "uuid",
    "name": "string",
    "level": "string",
    "category": "string",
    "courseOutput": {},
    "includeVideo": "Yes|No",
    "userName": "string",
    "userProfileImage": "string",
    "courseBanner": "string"
  }
  ```
- **Response**: Created course object
- **Auth**: Required

#### `GET /api/courses/[courseId]`
- **Description**: Get a specific course
- **Response**: Course object
- **Auth**: Required (for user's own courses)

#### `PUT /api/courses/[courseId]`
- **Description**: Update a course
- **Body**: Partial course object
- **Response**: Updated course object
- **Auth**: Required

#### `DELETE /api/courses/[courseId]`
- **Description**: Delete a course and its chapters
- **Response**: Success message
- **Auth**: Required

### Chapters API

#### `GET /api/chapters`
- **Description**: Get chapters for a course
- **Query Params**:
  - `courseId` (required) - Course ID
  - `chapterId` (optional) - Specific chapter ID
- **Response**: Array of chapter objects
- **Auth**: Not required (public courses)

#### `POST /api/chapters`
- **Description**: Create a new chapter
- **Body**:
  ```json
  {
    "courseId": "string",
    "chapterId": "number",
    "content": {},
    "videoId": []
  }
  ```
- **Response**: Created chapter object
- **Auth**: Required

#### `DELETE /api/chapters/[courseId]`
- **Description**: Delete all chapters for a course
- **Response**: Success message
- **Auth**: Required

### YouTube API

#### `GET /api/youtube`
- **Description**: Search for YouTube videos
- **Query Params**:
  - `q` (required) - Search query
  - `maxResults` (optional) - Number of results (default: 3)
- **Response**: Array of video objects
- **Auth**: Not required

### AI API

#### `POST /api/ai/generate-layout`
- **Description**: Generate course layout using Gemini AI
- **Body**:
  ```json
  {
    "prompt": "string"
  }
  ```
- **Response**: Course layout JSON object
- **Auth**: Not required (but should be rate-limited)

#### `POST /api/ai/generate-content`
- **Description**: Generate chapter content using Gemini AI
- **Body**:
  ```json
  {
    "prompt": "string"
  }
  ```
- **Response**: Chapter content JSON object
- **Auth**: Not required (but should be rate-limited)

## 🔐 Authentication

All protected routes use Clerk authentication:

```javascript
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

## 🗄️ Database

- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (Neon recommended)
- **Connection**: Lazy-loaded to prevent build-time errors
- **Schema**: Defined in `integrations/schema.ts`

## 🔄 Data Flow

### Course Creation Flow:
1. Client → `POST /api/ai/generate-layout` → AI generates layout
2. Client → `POST /api/courses` → Course saved to database
3. Client → `POST /api/ai/generate-content` (for each chapter) → AI generates content
4. Client → `GET /api/youtube?q=...` → Videos fetched
5. Client → `POST /api/chapters` → Chapter saved with content and videos

### Course Viewing Flow:
1. Client → `GET /api/courses/[courseId]` → Course data fetched
2. Client → `GET /api/chapters?courseId=...` → Chapters fetched
3. Client displays course content

## 🛡️ Security Features

1. **Server-Side API Keys**: Gemini and YouTube API keys are server-side only
2. **Authentication**: All write operations require Clerk authentication
3. **User Isolation**: Users can only access/modify their own courses
4. **Input Validation**: All inputs validated before database operations

## 📊 Error Handling

All API routes follow consistent error handling:

```javascript
try {
  // Operation
  return NextResponse.json(data, { status: 200 });
} catch (error) {
  console.error("Error:", error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
```

## 🚀 Performance Optimizations

1. **Lazy Database Connection**: Database only connects when needed
2. **Efficient Queries**: Using Drizzle ORM for optimized queries
3. **Server-Side Rendering**: API routes run on server for better performance
4. **Caching**: Consider adding caching for published courses

## 📝 Environment Variables

All backend operations use server-side environment variables:

- `DATABASE_URL` - PostgreSQL connection
- `CLERK_SECRET_KEY` - Clerk authentication
- `GEMINI_API_KEY` - AI generation
- `YOUTUBE_API_KEY` - Video search

See `.env.example` for complete list.

---

This backend architecture matches the reference repository and is optimized for Vercel deployment.

