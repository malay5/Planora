# Startup OS

## Credentials
**Database**: Supabase
**Status**: TEST (Credentials visible on Login)

### Test Accounts
- **Tech Lead**: `malay@startup.os` / `password123`
- **Ops Lead**: `yougesh@startup.os` / `password123`

### Database Access
- **Connection String**: `postgresql://postgres:Blackcoat_password897@db.hboerklcnkmdehpodemx.supabase.co:5432/postgres`


## Architecture & Decisions

### Database Connection Strategy
**Decision**: Use Supabase Transactional Pooler (Port 6543) for serverless environments.
**Context**: Next.js runs in a serverless environment (Vercel/Checkly), where managing persistent connections is difficult.
- **Attempt 1**: Direct Connection (IPv4). **Failed**: Supabase project does not have IPv4 addon / DNS unresolvable.
- **Attempt 2**: Transactional Pooler (Port 6543). **Failed**: Network Timeout (Firewall/ISP).
- **Attempt 3**: Session Pooler (Port 5432). **Failed**: Network Timeout.

**Trade-offs**:
- **Pooler vs Direct**: Poolers (PgBouncer) allow supporting thousands of temporary connections but introduce some limitations with Prepared Statements. We chose Transactional mode for best compatibility with Next.js server actions.
- **Revisiting**: Current status is BLOCKED due to network connectivity. Functional verification of the UI is complete, but data persistence is currently unavailable.

### Tech Stack Choices
- **Next.js 14 App Router**: Chosen for modern React features (RSC) and SEO capabilities.
- **Tailwind CSS (v4)**: For rapid, utility-first styling with minimal CSS bundle size.
- **Supabase**: Chosen for "Backend-as-a-Service" speed (Auth + DB + Realtime).
- **Shadcn/UI**: For accessible, high-quality component primitives that we can fully customize ("Dark Luxury" theme).

### Folder Structure
- `startup-os/`: Subdirectory to avoid npm naming conflicts with parent folder.
- `app/`: App Router structure.
- `components/ui/`: Reusable UI components.

