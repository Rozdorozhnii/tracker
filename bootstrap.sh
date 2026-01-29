#!/bin/bash
set -e

echo "=== Installing root dependencies (concurrently) ==="
npm install

echo "=== Installing backend dependencies ==="
npm install --prefix backend

echo "=== Installing frontend dependencies ==="
npm install --prefix frontend

echo "=== Applying Prisma migrations ==="
npx prisma migrate deploy --schema=backend/prisma/schema.prisma

echo "=== Starting backend and frontend concurrently ==="
npm run dev
