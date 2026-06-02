# Hospitality OS Backend

Production-oriented Node.js backend for the Smart Hospitality Operating System.

## Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT authentication
- Tenant middleware
- RBAC middleware
- Socket.io realtime events

## Local Setup

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Default API URL:

```text
http://localhost:4000/api/v1
```

## Request Tenant Resolution

Tenant is resolved from one of:

- `x-tenant-slug` header
- `/:hotelSlug` route in future frontend routing
- request hostname subdomain

Every hotel-scoped repository query must include `hotelId`.
