/backend
├── /src
│ ├── /config # DB, mail, OTP configs
│ ├── /controllers # Business logic per resource
│ ├── /routes # Express routers
│ ├── /models # Mongoose schemas
│ ├── /schemas # Zod validations
│ ├── /middlewares # Auth, error, file, role, OTP guard
│ ├── /utils # OTP, PDF generation, template engine
│ ├── /services # Reusable logic (e.g., send email, generate PDFs)
│ ├── /types # Global TypeScript interfaces
│ ├── index.ts # Entry point
│ └── app.ts # Express app setup
├── .env
├── package.json
├── tsconfig.json
