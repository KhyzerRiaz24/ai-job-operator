# AI Job Operator

Operational automation for small UK trade businesses (roughly 1–10 people): inbound enquiry through qualification, service-area check, job classification, availability, booking, confirmation, CRM update, follow-up, and human exception handling.

This is **not** a generic chatbot, AI receptionist, replacement CRM, customer portal, or general-purpose assistant. It sits on top of the business’s existing tools and produces real operational outcomes.

## Approved architecture

Modular monolith (Next.js App Router + TypeScript). PostgreSQL via Supabase will be the system of record in a later phase. The LLM never talks to the database or vendor APIs; it will only request typed application tools.

Separated layers (see `src/`):

1. AI reasoning  
2. Business rules  
3. Workflow / state management  
4. Typed tool execution  
5. External integrations (provider adapters)  
6. Database persistence  
7. UI  
8. Audit logging  

The **domain is channel-agnostic**. SMS is the first live customer channel (later: voice, WhatsApp, web). Channel adapters feed the same workflow; SMS is not the core model.

Locked MVP integrations (not in this phase): OpenAI, Twilio SMS (`MessagingProvider`), one Google Calendar per business, HubSpot Contact + Activity/Note. `TelephonyProvider` remains a future interface only.

## Phase 1 scope (current)

Project spine only:

- Next.js App Router + strict TypeScript  
- Lint (ESLint)  
- Vitest  
- Typed environment boundary (server vs public; no vendor secrets)  
- Process health check at `GET /api/health`  
- Reserved `src/` layout for later phases  

## Current non-goals

Do **not** expect these yet (later phases or out of MVP):

- Supabase / schema / auth / RLS  
- OpenAI, Twilio, Google Calendar, HubSpot  
- n8n as workflow engine  
- Workflow state machine, tools, AI orchestrator  
- Operator inbox  
- SMS or any customer channel  
- Pricing, quoting, discounts, callout fees  
- Payments, customer portal, WhatsApp, voice, Outlook, Jobber, ServiceM8, Tradify  
- Multi-calendar / multi-engineer dispatch  
- Fake vendor adapters (except test shims for `server-only`)  

## Development commands

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # Vitest (no network)
npm run typecheck
npm run lint
npm run build
```

Health: `GET /api/health` → `{ "status": "ok", "timestamp": "<ISO-8601>" }`. No env dumps, secrets, or vendor checks.

Copy `.env.example` if you need a local env file. Do not commit real credentials.
