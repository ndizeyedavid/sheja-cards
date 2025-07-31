# Navigate to your project root first
cd "frontend"

# Create core folders
mkdir src\components\ui, src\components\layout, src\components\nav
mkdir src\app\(dashboard|auth|settings|students|staff|classes|templates)\(components|page)
mkdir src\lib
mkdir src\hooks
mkdir src\utils
mkdir src\types
mkdir src\constants
mkdir public\assets\images\logos

# Create layout and nav components
ni src\components\layout\dashboard-layout.tsx
ni src\components\layout\topbar.tsx
ni src\components\nav\sidebar.tsx
ni src\components\nav\sidebar-link.tsx

# Create dashboard entry point
ni src\app\dashboard\page.tsx
ni src\app\dashboard\components\overview-cards.tsx

# Create placeholder pages and components
foreach ($section in "students", "staff", "classes", "templates", "settings") {
    ni "src\app\$section\page.tsx"
    ni "src\app\$section\components\$section-table.tsx"
}

# Auth pages
ni src\app\auth\login\page.tsx
ni src\app\auth\register\page.tsx
ni src\app\auth\reset-password\page.tsx

# Lib, hooks, utils, constants
ni src\lib\auth.ts
ni src\lib\api.ts
ni src\hooks\useSidebar.ts
ni src\utils\formatDate.ts
ni src\constants\navLinks.ts
ni src\types\index.ts

# Logo placeholder
ni public\assets\images\logos\logo.svg
