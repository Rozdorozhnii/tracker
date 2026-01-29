Project Setup Instructions

Overview

This project is a Time Tracker with a backend (Express.js + Prisma ORM + SQLite) and a frontend (Next.js).
• Node.js: v18 LTS (for stability)
• Next.js: pinned version for compatibility
• Prisma: pinned version for compatibility

⸻
!!! You need Node.js v18 already installed

1. Install dependencies

Install all dependencies for backend, frontend and concurrently:

```
npm install --prefix backend
npm install --prefix frontend
npm install
```

2. Run Prisma migrations

Prisma manages the SQLite database. To create the database and apply migrations:

```
npx prisma migrate deploy --schema=backend/prisma/schema.prisma
```

3. Start backend and frontend concurrently

To run both backend and frontend in development mode:

```
npm run dev
```

!!! Or you can give permissions for using script and run it

```
chmod +x bootstrap.sh
./bootstrap.sh
```
