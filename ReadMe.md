# Sheja - Multi-Tenant Student Card Platform

Sheja is a modern multi-tenant platform designed to help schools manage student records and generate custom student ID cards. It includes full authentication, role-based access, class and student management, and PDF export features, all backed by a robust Express API and a beautiful Next.js dashboard.

---

# Features

- Email-based OTP verification
- First-time login password setup
- JWT-based session management
- Role-based access control:
- School creation with branding (name, logo, colors, contact)
- Headmaster adds school staff with role-specific permissions
- Staff onboarding via email invitation
- Register classes with names & combinations
- View and manage class lists
- Customize cards with school branding

### Backend

- Built with **Node.js**, **Express**, and **TypeScript**
- JWT **authentication** with OTP support
- **Role-based access control** (Headmaster, DOS, Bursar, etc.)
- Multi-tenant data isolation per school
- RESTful API for:
  - School Registration & Login
  - Staff Onboarding with Role Assignments
  - Class & Student CRUD
  - Card Template Selection
  - Student ID PDF Generation (by class/year)

### Frontend

- **Next.js App Router** with TypeScript
- UI powered by **shadcn/ui + TailwindCSS**
- Pages:
  - Public Landing Page
  - Auth (Login, OTP verification, Setup password)
  - Admin Dashboard:
    - Overview & Stats
    - Class Management
    - Student List & Creation
    - Card Design Selection
    - PDF Export of ID Cards

---

## Project Structure

### Backend (`/server`)
```structure
/server
├── src
│ ├── app.ts
│ ├── index.ts
│ ├── routes/
│ ├── controllers/
│ ├── middlewares/
│ ├── utils/
│ ├── models/
│ ├── config/
│ └── types/
```
### Frontend

```structure
/app
├── app/
│ ├── (landing pages)
│ ├── auth/
│ ├── dashboard/
│ │ ├── overview/
│ │ ├── students/
│ │ ├── classes/
│ │ ├── settings/
│ │ └── card-templates/
│ └── layout.tsx
├── components/
├── lib/
├── hooks/
├── utils/
└── styles/
```
---

## 🧪 Tech Stack

### Backend

- `Express.js` + `TypeScript`
- `MongoDB` + `Mongoose`
- `Zod` for validation
- `bcrypt` for hashing
- `jsonwebtoken` for access tokens
- `nodemailer` for OTP emails

### Frontend

- `Next.js 14` (App Router)
- `TailwindCSS` + `shadcn/ui`
- `React Hook Form` + `Zod`
- `axios` for API calls
- `Lucide Icons` for UI
- `@react-pdf/renderer` (coming soon)

## In Progress

- PDF Export for ID cards
- Staff audit logs
- Class statistics chart
- Image uploads (S3)
- School customization (logo, colors, etc.)

---
