# Smart Hospitality Operating System Architecture

This repo currently contains a Vite React prototype. The target production shape is a split SaaS platform:

- `apps/web`: Next.js App Router frontend for guest, hotel, staff, and super admin experiences.
- `apps/api`: Express.js API with Prisma, PostgreSQL, JWT auth, RBAC, Socket.io, and rate limiting.
- `packages/ui`: shared Tailwind component system.
- `packages/config`: shared TypeScript, ESLint, environment, and tenant config.

## Phase 1: Core Platform

- Tenant resolution from `host` subdomain or `/hotel/:slug`.
- JWT auth with roles: super admin, hotel owner, hotel manager, waiter, kitchen staff, receptionist, guest.
- Hotel, branch, staff, room, table, QR token, menu, cart, order, and payment models.
- Hotel data isolation through `hotelId` on operational tables.
- Guest QR experience with tenant branding and PWA offline menu cache.

## Phase 2: Realtime Operations

Socket.io namespaces:

- `/hotel/:hotelId/orders`: order creation and kitchen status.
- `/hotel/:hotelId/service`: waiter calls and room/table service requests.
- `/hotel/:hotelId/analytics`: live platform and hotel metrics.
- `/hotel/:hotelId/notifications`: push-ready guest and staff notifications.

Events:

- `order.created`
- `order.status.updated`
- `service.requested`
- `service.resolved`
- `payment.updated`
- `analytics.snapshot`

## Phase 3: AI Features

- Recommendation service using menu metadata, guest history, time, weather, and inventory.
- AI chat assistant with hotel policies, menu information, and booking/service actions.
- Demand forecasting for prep planning and dynamic promotions.
- AI insights for super admins and hotel owners.

## REST API Layout

Use controller/service/repository boundaries:

- `auth`: login, refresh, logout, invite staff.
- `tenants`: resolve tenant, load theme, validate QR token.
- `hotels`: profile, branding, subscription, onboarding.
- `menus`: categories, items, modifiers, availability.
- `orders`: cart checkout, order status, order history.
- `service-requests`: waiter calls, water, bill, cleaning.
- `payments`: Chapa, Telebirr, CBE Birr, Stripe, PayPal webhooks.
- `analytics`: revenue, retention, peak hours, best sellers, staff performance.
- `ai`: recommendations, chat, insights, promotions.

## Security Baseline

- Validate every request with schema validators before controller logic.
- Resolve tenant before hitting repositories.
- Require `hotelId` in repository filters for hotel-scoped data.
- Use signed JWT access tokens and rotating refresh tokens.
- Add rate limiting to auth, public QR, payment, and AI endpoints.
- Use Helmet, CORS allowlists, HTTP-only cookies where possible, and webhook signature verification.

## Environment Variables

```bash
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
FRONTEND_ORIGIN=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
CHAPA_SECRET_KEY=
TELEBIRR_MERCHANT_ID=
CBE_BIRR_MERCHANT_ID=
STRIPE_SECRET_KEY=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
OPENAI_API_KEY=
```

## Deployment

- Frontend: Vercel.
- Backend: Render web service.
- Database: Supabase PostgreSQL.
- Realtime: Socket.io on the API service with Redis adapter when horizontally scaled.
- CI/CD: run lint, typecheck, unit tests, Prisma migration checks, and production build on every pull request.
