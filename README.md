# 🏥 Healthcare Management System

A high-performance healthcare management application built with NestJS, GraphQL, and Next.js. Features professional skeleton loading, optimized data fetching, and sub-second page load times.

## 🚀 Live Demo

- **Frontend**: [https://healthcare-eight-bay.vercel.app/](https://healthcare-eight-bay.vercel.app/)
- **Backend API**: [https://healthcare-backend-gap2.onrender.com/](https://healthcare-backend-gap2.onrender.com/)
- **GraphQL Playground**: [https://healthcare-backend-gap2.onrender.com/graphql](https://healthcare-backend-gap2.onrender.com/graphql)

## ⚡ Performance Features

- **Lightning Fast Loading**: Home page loads in 0.19s LCP
- **Professional Skeleton Loading**: No more blank screens during data loading
- **Optimized GraphQL Queries**: Lightweight queries with cache-first policies
- **Database Performance**: Connection pooling and query optimization
- **Zero Layout Shift**: Consistent CLS score of 0 across all pages

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Apollo Client
- **Backend**: NestJS, GraphQL, TypeORM, PostgreSQL (Neon)
- **Deployment**: Vercel (Frontend), Render (Backend)
- **Database**: Neon PostgreSQL with connection pooling

## 📋 Prerequisites

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

The GraphQL playground will be available at: http://localhost:4000/graphql

**Performance Features:**
- Database connection pooling for faster queries
- Query performance monitoring with timing logs
- Optimized database queries with proper indexing

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
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
```

**Performance Features:**
- Professional skeleton loading components
- Lightweight GraphQL queries for faster data loading
- Apollo Client cache-first policies
- Memoized loading states to prevent unnecessary re-renders

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
│   │   ├── page.tsx            # Home page (0.19s LCP)
│   │   ├── apollo-wrapper.tsx  # Apollo Client setup
│   │   ├── globals.css         # Global styles
│   │   ├── patients/           # Patient pages (optimized)
│   │   ├── doctors/            # Doctor pages (optimized)
│   │   └── appointments/       # Appointment pages (optimized)
│   ├── components/             # Reusable components
│   │   ├── ui/                 # UI components
│   │   │   ├── skeleton.tsx    # Skeleton loading component
│   │   │   └── error-boundary.tsx # Error handling
│   │   ├── patients/           # Patient-specific components
│   │   │   └── patients-skeleton.tsx
│   │   ├── doctors/            # Doctor-specific components
│   │   │   └── doctors-skeleton.tsx
│   │   └── appointments/       # Appointment-specific components
│   │       └── appointments-skeleton.tsx
│   ├── graphql/                # GraphQL operations
│   │   ├── queries/
│   │   │   ├── patients.ts     # Original queries
│   │   │   ├── doctors.ts      # Original queries
│   │   │   └── appointments-optimized.ts # Lightweight queries
│   │   └── mutations/
│   │       ├── patients.ts
│   │       ├── doctors.ts
│   │       └── appointments.ts
│   └── styles/
│       └── critical.css        # Critical CSS for faster loading
├── package.json
├── next.config.js              # Performance optimizations
├── tailwind.config.ts
├── tsconfig.json
└── env.local.example
```

## 🔧 Available GraphQL Operations

### Queries
- `getPatients` - Get all patients (optimized with performance monitoring)
- `getPatientById(id: ID!)` - Get a specific patient
- `getDoctors` - Get all doctors (optimized with performance monitoring)
- `getDoctorById(id: ID!)` - Get a specific doctor
- `getAppointments` - Get all appointments with patient/doctor relations
- `getAppointmentById(id: ID!)` - Get a specific appointment

### Mutations
- `createPatient(createPatientInput: CreatePatientInput!)` - Create a new patient
- `updatePatient(updatePatientInput: UpdatePatientInput!)` - Update a patient
- `deletePatient(id: ID!)` - Delete a patient
- `createDoctor(createDoctorInput: CreateDoctorInput!)` - Create a new doctor
- `updateDoctor(updateDoctorInput: UpdateDoctorInput!)` - Update a doctor
- `deleteDoctor(id: ID!)` - Delete a doctor
- `createAppointment(createAppointmentInput: CreateAppointmentInput!)` - Create an appointment
- `updateAppointment(updateAppointmentInput: UpdateAppointmentInput!)` - Update an appointment
- `deleteAppointment(id: ID!)` - Delete an appointment

## ⚡ Performance Optimizations

### Frontend Optimizations
- **Skeleton Loading**: Professional loading states for all pages
- **Lightweight Queries**: Reduced payload size with essential fields only
- **Apollo Client Caching**: Cache-first policies for faster subsequent loads
- **Memoization**: Prevent unnecessary re-renders with useMemo
- **Code Splitting**: Dynamic imports for better bundle optimization

### Backend Optimizations
- **Database Connection Pooling**: Efficient connection management
- **Query Performance Monitoring**: Real-time performance tracking
- **Optimized Queries**: Proper indexing and query optimization
- **Error Handling**: Comprehensive error tracking with timing
- **Logging Optimization**: Disabled verbose logging for production performance

## 🧪 Testing the Setup

1. Start both backend and frontend servers
2. Visit http://localhost:3000 to see the frontend
3. Visit http://localhost:4000/graphql to access the GraphQL playground
4. Test the queries and mutations in the playground
5. Check browser DevTools for performance metrics:
   - **LCP (Largest Contentful Paint)**: Should be <0.5s
   - **CLS (Cumulative Layout Shift)**: Should be 0
   - **Skeleton Loading**: Professional loading states visible

## 📊 Performance Metrics

### Current Performance (Live Demo)
- **Home Page**: 0.19s LCP, 0 CLS ✅
- **Patients Page**: <0.5s LCP with skeleton loading ✅
- **Doctors Page**: <0.5s LCP with skeleton loading ✅
- **Appointments Page**: <0.5s LCP (improved from 3.72s) ✅

### Performance Monitoring
- Backend services log query execution times
- Frontend Apollo Client tracks cache performance
- Real-time performance metrics in browser DevTools

## 🚀 Deployment

### Backend Deployment (Render)
- **Live URL**: [https://healthcare-backend-gap2.onrender.com/](https://healthcare-backend-gap2.onrender.com/)
- **GraphQL Playground**: [https://healthcare-backend-gap2.onrender.com/graphql](https://healthcare-backend-gap2.onrender.com/graphql)

**Deployment Steps:**
1. Connect repository to Render
2. Set environment variables (DATABASE_URL, PORT)
3. Build command: `npm run build`
4. Start command: `npm run start:prod`

### Frontend Deployment (Vercel)
- **Live URL**: [https://healthcare-eight-bay.vercel.app/](https://healthcare-eight-bay.vercel.app/)

**Deployment Steps:**
1. Connect repository to Vercel
2. Set environment variable: `NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://healthcare-backend-gap2.onrender.com/graphql`
3. Automatic deployment on push to main branch

### Environment Variables

**Backend (.env):**
```env
DATABASE_URL=postgresql://username:password@ep-example.us-east-1.aws.neon.tech/healthcare?sslmode=require
PORT=4000
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://healthcare-backend-gap2.onrender.com/graphql
```

## 🔧 Troubleshooting

### Common Issues
- **Slow Loading**: Check if backend is running and database is accessible
- **GraphQL Errors**: Verify `NEXT_PUBLIC_GRAPHQL_ENDPOINT` is correct
- **CORS Issues**: Backend CORS is configured for localhost:3000 and Vercel domain
- **Database Connection**: Ensure Neon database URL is correct and accessible

### Performance Issues
- **High LCP**: Check network tab for slow GraphQL queries
- **Layout Shifts**: Skeleton components should prevent CLS issues
- **Slow Backend**: Check Render logs for database connection issues

### Development Tips
- Use browser DevTools Performance tab to monitor LCP/CLS
- Check backend console for query performance logs
- Apollo Client DevTools show cache performance
- Network tab reveals actual query execution times

## 📈 Recent Updates

### Performance Optimization (Latest)
- ✅ Implemented professional skeleton loading across all pages
- ✅ Optimized GraphQL queries with lightweight payloads
- ✅ Added database connection pooling and performance monitoring
- ✅ Fixed Apollo Client deprecation warnings
- ✅ Reduced appointments page LCP from 3.72s to <0.5s
- ✅ Achieved consistent 0 CLS across all pages

### Technical Improvements
- ✅ Added error boundaries and better error handling
- ✅ Implemented memoization for loading states
- ✅ Optimized database queries with proper indexing
- ✅ Added real-time performance monitoring
- ✅ Enhanced Apollo Client caching strategies
