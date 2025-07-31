app/
├── (landing)/
│ ├── page.tsx --> Landing Page (public)
│ ├── components/
│ │ ├── HeroSection.tsx
│ │ ├── Features.tsx
│ │ └── CTASection.tsx
│ └── layout.tsx --> Public layout (no auth)

├── auth/
│ ├── login/page.tsx
│ ├── register/page.tsx
│ ├── otp-verification/page.tsx
│ ├── reset-password/page.tsx
│ └── layout.tsx --> Auth layout

├── dashboard/
│ ├── layout.tsx --> Protected layout with sidebar/header
│ ├── page.tsx --> Dashboard home (analytics)
│ ├── students/page.tsx --> Manage students
│ ├── classes/page.tsx --> Manage classes
│ ├── staff/page.tsx --> Admin staff
│ ├── settings/page.tsx --> School settings
│ └── cards/page.tsx --> Student card layouts

├── not-found.tsx
├── globals.css
└── layout.tsx --> Root layout

lib/
├── auth.ts --> Auth helpers (e.g. getSession, token check)
├── api.ts --> Axios or fetch wrapper
├── utils.ts --> Reusable frontend utilities

components/
├── ui/ --> Shadcn components
├── layout/ --> Header, Sidebar, Footer
└── shared/ --> Reusable elements like buttons, avatars

constants/
├── routes.ts
└── roles.ts

hooks/
├── useAuth.ts
└── useSidebar.ts

middlewares/
└── authGuard.tsx --> Protect dashboard pages

store/
└── authStore.ts (zustand or context-based if needed)

types/
└── index.ts (frontend types shared across pages)
