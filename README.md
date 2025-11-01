# Chinese Learning Flip Card Application

A full-stack web application for learning Chinese vocabulary using flip cards. Built with React + TypeScript (frontend) and NestJS + PostgreSQL (backend).

## Features

- 🎴 Interactive flip cards for Chinese-Vietnamese vocabulary
- 👤 User authentication (JWT-based)
- 👑 Admin panel for card management
- 🏷️ Category/tag system for organizing cards
- 📱 Responsive design
- ✨ Pre-loaded system cards + user-contributed cards

## Tech Stack

**Frontend:**
- React + TypeScript
- Vite
- TanStack Query (React Query)
- Ant Design (UI components)
- React Router

**Backend:**
- NestJS + TypeScript
- PostgreSQL + TypeORM
- JWT Authentication
- Passport.js

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v12+)
- npm or yarn

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/chinese_learning_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**Note:** Replace the database credentials with your PostgreSQL connection string.

#### Running PostgreSQL with Docker (Optional)

```bash
docker run --name postgres-chinese -e POSTGRES_PASSWORD=password -e POSTGRES_DB=chinese_learning_db -p 5432:5432 -d postgres
```

Then update `DATABASE_URL`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/chinese_learning_db
```

#### Run Backend

```bash
npm run start:dev
```

#### Seed Database

```bash
npm run seed
```

This will populate the database with sample Chinese-Vietnamese vocabulary cards.

### 2. Frontend Setup

```bash
cd frontend  # or cd backend/frontend if the folder is there
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000
```

#### Run Frontend

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

1. **Register/Login**: Create an account or login
   - The first user to register automatically becomes an admin

2. **Study Cards**: 
   - View flip cards one at a time
   - Click to flip between Chinese and Vietnamese
   - Navigate with Previous/Next buttons
   - Filter by category
   - Shuffle cards

3. **Add Cards**: 
   - Click "Thêm thẻ mới" (Add new card) button
   - Fill in Chinese text, Vietnamese translation, and optional categories

4. **Admin Panel** (Admin only):
   - Access via "Quản trị" (Admin) button
   - View all cards in a table
   - Edit any card
   - Delete cards

## Project Structure

```
chinese-learning-flip-card-for-bae/
├── backend/
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── cards/           # Cards CRUD
│   │   ├── users/           # User management
│   │   ├── guards/          # Auth guards
│   │   └── database/        # Seed scripts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # TanStack Query hooks
│   │   ├── services/       # API client
│   │   └── contexts/      # Auth context
│   └── package.json
└── README.md
```

## Development

### Backend Development

- Watch mode: `npm run start:dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Format: `npm run format`

### Frontend Development

- Dev server: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`

## Environment Variables

### Backend (.env)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3000)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `NODE_ENV` - Environment (development/production)

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:3000)

## Deployment

### Frontend: Vercel
1. Connect your Git repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL` (your backend URL)

### Backend: Railway
1. Connect your Git repository
2. Add PostgreSQL service
3. Set start command: `npm run start:prod`
4. Add environment variables from backend `.env`

## License

Private project - Personal use only
