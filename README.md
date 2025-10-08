# Healthcare SPA Setup Instructions

This project consists of a NestJS backend with GraphQL and a Next.js frontend.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Neon PostgreSQL database account

## Backend Setup (NestJS + GraphQL + Neon)

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `env.example` to `.env` and update with your Neon database credentials:
```bash
cp env.example .env
```

Update the `.env` file with your actual Neon database URL:
```
DATABASE_URL=postgresql://username:password@ep-example.us-east-1.aws.neon.tech/healthcare?sslmode=require
PORT=3001
```

### 4. Start the backend server
```bash
npm run start:dev
```

The GraphQL playground will be available at: http://localhost:3001/graphql

## Frontend Setup (Next.js + Apollo Client)

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `env.local.example` to `.env.local`:
```bash
cp env.local.example .env.local
```

The `.env.local` file should contain:
```
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:3001/graphql
```

### 4. Start the frontend development server
```bash
npm run dev
```

The application will be available at: http://localhost:3000

## Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   ├── database/              # Database configuration
│   │   ├── database.module.ts
│   │   └── database.service.ts
│   ├── graphql/                # GraphQL configuration
│   │   └── schema.gql         # Auto-generated schema
│   └── modules/                # Feature modules
│       └── patients/           # Patient management
│           ├── patient.entity.ts
│           ├── patient.service.ts
│           ├── patient.resolver.ts
│           ├── patient.module.ts
│           └── dto/
│               └── patient.input.ts
├── package.json
├── tsconfig.json
└── env.example
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── apollo-wrapper.tsx  # Apollo Client setup
│   │   ├── globals.css         # Global styles
│   │   ├── patients/           # Patient pages
│   │   ├── doctors/            # Doctor pages
│   │   └── appointments/       # Appointment pages
│   ├── components/             # Reusable components
│   │   └── Navbar.tsx
│   └── graphql/                # GraphQL operations
│       ├── queries/
│       │   └── patients.ts
│       └── mutations/
│           └── patients.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── env.local.example
```

## Available GraphQL Operations

### Queries
- `patients` - Get all patients
- `patient(id: Int!)` - Get a specific patient

### Mutations
- `createPatient(createPatientInput: CreatePatientInput!)` - Create a new patient
- `updatePatient(updatePatientInput: UpdatePatientInput!)` - Update a patient
- `removePatient(id: Int!)` - Delete a patient

## Testing the Setup

1. Start both backend and frontend servers
2. Visit http://localhost:3000 to see the frontend
3. Visit http://localhost:3001/graphql to access the GraphQL playground
4. Test the patient queries and mutations in the playground

## Deployment

### Backend Deployment (Render/Heroku)
1. Connect your repository to Render
2. Set environment variables in Render dashboard
3. Deploy with build command: `npm run build`
4. Start command: `npm run start:prod`

### Frontend Deployment (Vercel)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Update `NEXT_PUBLIC_GRAPHQL_ENDPOINT` to your deployed backend URL
4. Deploy automatically on push

## Troubleshooting

- Ensure both servers are running on different ports (3000 for frontend, 3001 for backend)
- Check that your Neon database URL is correct and accessible
- Verify CORS settings in the backend allow requests from the frontend
- Check browser console for any GraphQL connection errors
