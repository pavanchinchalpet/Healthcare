# 🏥 Healthcare Management System

A modern healthcare management application with role-based access control, built with NestJS, GraphQL, and Next.js. Features patient registration, staff access control, and appointment management.

## 📑 Table of Contents

- [Live Demo](#-live-demo)
- [User Roles & Access](#-user-roles--access)
- [Tech Stack](#️-tech-stack)
- [Quick Start](#-quick-start)
- [Setup Guide](#-setup-guide)
- [Authentication](#-authentication)
- [Key Features](#-key-features)

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


## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Apollo Client
- **Backend**: NestJS, GraphQL, TypeORM, PostgreSQL (Neon)
- **Authentication**: Client-side role management with localStorage
- **Deployment**: Vercel (Frontend), Render (Backend)
- **Database**: Neon PostgreSQL with connection pooling

## 🧪 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd healthcare

# Setup Backend
cd backend && npm install
cp .env.example .env  # Configure your database URL
npm run start:dev

# Setup Frontend (in a new terminal)
cd frontend && npm install
cp .env.local.example .env.local  # Configure GraphQL endpoint
npm run dev
```

Visit http://localhost:3000

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Neon PostgreSQL database account

## 🔧 Setup Guide

### Backend Setup (NestJS + GraphQL + Neon)

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

### Staff Access
1. Visit `/staff`
2. Enter access code
3. Select role (Admin, Doctor, or Staff)
4. Access full management interface

### Patient Access
1. **Register**: Visit `/register` to create account
2. **Login**: Visit `/login` with email and password
3. Browse doctors and book appointments
4. View and manage appointments


## 🏗️ Project Structure

```
healthcare/
├── frontend/          # Next.js frontend application
├── backend/           # NestJS backend application
└── README.md          # This file
```

## 🔐 Authentication

**Staff Access**: Use access codes via `/staff`  
**Patient Access**: Register/Login with email and password via `/register` or `/login`

All pages are protected with role-based access control.

> **Note**: Access codes are configured in `frontend/src/config/access-codes.ts`

## ✨ Key Features

- 🔐 **Role-Based Access Control**: Patient, Doctor, Admin, and Staff roles
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- ⚡ **Real-time Updates**: GraphQL subscriptions for live data
- 🎨 **Modern UI**: Clean, professional healthcare interface
- 🔒 **Secure Authentication**: Client-side session management
- 📊 **Dashboard Analytics**: View system statistics and metrics
- 💾 **Data Persistence**: PostgreSQL database with connection pooling

