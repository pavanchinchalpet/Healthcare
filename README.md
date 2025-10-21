# 🏥 Healthcare Management System

A modern healthcare management application with role-based access control, built with NestJS, GraphQL, and Next.js. Features patient registration, staff access control, and appointment management.

## 🚀 Live Demo

- **Frontend**: [https://healthcare-eight-bay.vercel.app/](https://healthcare-eight-bay.vercel.app/)
- **Backend API**: [https://healthcare-backend-gap2.onrender.com/](https://healthcare-backend-gap2.onrender.com/)
- **GraphQL Playground**: [https://healthcare-backend-gap2.onrender.com/graphql](https://healthcare-backend-gap2.onrender.com/graphql)

## 👥 User Roles & Access

### 🏠 Landing Page
Clean, minimal interface with three access options:
- **Staff Access**: Enter access code to manage doctors, patients, and appointments
- **Patient Login**: Existing patients sign in with email and password
- **Patient Register**: New patients create an account to book appointments

### 👨‍⚕️ Staff (Doctors & Admins)
- Access via `/staff` with configured access code
- Full CRUD access to doctors, patients, and appointments
- Manage appointment statuses and schedules
- View comprehensive system data

### 👤 Patients
- Register at `/register` with personal details
- Login at `/login` with email and password
- Browse available doctors
- Book and manage appointments
- View appointment history

## ⚡ Performance Features

- **Lightning Fast Loading**: Optimized queries and caching
- **Professional Skeleton Loading**: No blank screens during data loading
- **Role-Based Navigation**: Context-aware UI based on user role
- **Client-Side Authentication**: Persistent session management
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Apollo Client
- **Backend**: NestJS, GraphQL, TypeORM, PostgreSQL (Neon)
- **Authentication**: Client-side role management with localStorage
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
Create a `.env` file in the backend directory with your Neon database credentials:

```env
DATABASE_URL=postgresql://username:password@ep-example.us-east-1.aws.neon.tech/healthcare?sslmode=require&options=endpoint%3Dep-example-pooler
PORT=4000
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Start the backend server
```bash
npm run start:dev
```

The GraphQL playground will be available at: http://localhost:4000/graphql

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
Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
```

### 4. Start the frontend development server
```bash
npm run dev
```

The application will be available at: http://localhost:3000

## 🎯 User Workflows

### Patient Registration & Booking
1. Visit landing page (`/`)
2. Click "Register" to create patient account
3. Fill in personal details (name, email, phone, address)
4. Account created and automatically logged in
5. Browse doctors and book appointments
6. View and manage appointments in "My Appointments"

### Patient Login
1. Visit landing page (`/`)
2. Click "Login" 
3. Select "Patient" role
4. Enter email and password
5. Access patient dashboard and booking features

### Staff Access
1. Visit landing page (`/`)
2. Click "Staff"
3. Enter configured access code
4. Choose role (Doctor/Admin)
5. Access full management interface:
   - Manage doctors (add, edit, delete)
   - Manage patients (view, edit, delete)
   - Manage appointments (schedule, update status, cancel)

## 🔧 Available GraphQL Operations

### Queries
- `getPatients` - Get all patients
- `getPatientById(id: ID!)` - Get a specific patient
- `getDoctors` - Get all doctors
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

## 🏗️ Project Structure

### Frontend Structure
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with auth provider
│   │   ├── page.tsx            # Landing page (no nav)
│   │   ├── login/              # Patient login page
│   │   ├── register/           # Patient registration page
│   │   ├── staff/              # Staff access page
│   │   ├── patients/           # Patient management (staff only)
│   │   ├── doctors/            # Doctor management (staff only)
│   │   └── appointments/       # Appointment management
│   ├── components/             # Reusable components
│   │   ├── ui/                 # UI components (Button, Card, etc.)
│   │   ├── healthcare/         # Healthcare-specific components
│   │   │   └── header-nav.tsx  # Role-aware navigation
│   │   └── [role]/             # Role-specific components
│   ├── lib/                    # Utilities
│   │   ├── auth.tsx            # Client-side auth context
│   │   └── apollo-client.ts    # GraphQL client setup
│   └── graphql/                # GraphQL operations
│       ├── queries/            # GraphQL queries
│       └── mutations/          # GraphQL mutations
```

### Backend Structure
```
backend/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   ├── database/              # Database configuration
│   ├── graphql/               # GraphQL configuration
│   └── modules/               # Feature modules
│       ├── patients/          # Patient management
│       ├── doctors/           # Doctor management
│       └── appointments/      # Appointment management
```

## 🔐 Authentication & Security

### Client-Side Authentication
- Role-based access control (Patient, Doctor, Admin)
- Session persistence with localStorage
- Route protection based on user role
- Automatic logout functionality

### Staff Access Control
- Configurable access codes via `src/config/access-codes.ts`
- No individual staff accounts required
- Multiple role codes (Admin, Doctor, Staff)
- Role selection after code verification

### Patient Authentication
- Email-based login system
- Password protection (backend implementation pending)
- Automatic login after registration
- Session management for appointment booking

## 🚀 Deployment

### Backend Deployment (Render)
- **Live URL**: [https://healthcare-backend-gap2.onrender.com/](https://healthcare-backend-gap2.onrender.com/)
- **GraphQL Playground**: [https://healthcare-backend-gap2.onrender.com/graphql](https://healthcare-backend-gap2.onrender.com/graphql)

### Frontend Deployment (Vercel)
- **Live URL**: [https://healthcare-eight-bay.vercel.app/](https://healthcare-eight-bay.vercel.app/)

### CI/CD Pipeline
- **GitHub Actions**: Automated testing and building on push/PR
- **Security Scanning**: Automated npm audit for both frontend and backend
- **Multi-environment**: Supports main and develop branches
- **Build Verification**: Ensures both applications build successfully

### Environment Variables

**Backend (.env):**
```env
DATABASE_URL=postgresql://username:password@ep-example.us-east-1.aws.neon.tech/healthcare?sslmode=require&options=endpoint%3Dep-example-pooler
PORT=4000
CORS_ORIGIN=https://your-frontend-app.vercel.app
FRONTEND_URL=https://your-frontend-app.vercel.app
NODE_ENV=production
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-backend-app.onrender.com/graphql
```

## 🧪 Testing the Setup

1. Start both backend and frontend servers
2. Visit http://localhost:3000 to see the landing page
3. Test patient registration and login flows
4. Test staff access with configured code
5. Verify role-based navigation and permissions
6. Test appointment booking and management

## 📈 Recent Updates

### Authentication & UI (Latest)
- ✅ Implemented role-based authentication system
- ✅ Created clean landing page with three access options
- ✅ Added staff access control with configurable code
- ✅ Built patient registration and login flows
- ✅ Implemented role-aware navigation and route protection
- ✅ Added client-side session management

### Technical Improvements
- ✅ Converted header navigation to client component
- ✅ Added auth context with localStorage persistence
- ✅ Created responsive card-based landing design
- ✅ Implemented role-specific UI components
- ✅ Added environment variable configuration for access codes

## 🔧 Troubleshooting

### Common Issues
- **Access Code Not Working**: Verify access codes in `src/config/access-codes.ts`
- **Login Issues**: Check if patient exists in database with correct email
- **Role Navigation**: Ensure user is properly logged in with correct role
- **GraphQL Errors**: Verify `NEXT_PUBLIC_GRAPHQL_ENDPOINT` is correct
- **CORS Errors**: Check `CORS_ORIGIN` and `FRONTEND_URL` in backend environment

### Development Tips
- Use browser DevTools to inspect localStorage auth state
- Check network tab for GraphQL query responses
- Verify environment variables are properly set
- Test role-based access on different pages

## 🎯 Next Steps

### Backend Enhancements (Planned)
- [ ] Add password hashing for patient authentication
- [ ] Implement `patientLogin` GraphQL mutation
- [ ] Add server-side staff access verification
- [ ] Enhance appointment status management

### Frontend Enhancements (Planned)
- [ ] Add patient appointment filtering
- [ ] Implement doctor availability management
- [ ] Add appointment rescheduling functionality
- [ ] Create admin dashboard with statistics
=======
- ✅ Added error boundaries and better error handling
- ✅ Implemented memoization for loading states
- ✅ Optimized database queries with proper indexing
- ✅ Added real-time performance monitoring
- ✅ Enhanced Apollo Client caching strategies.
