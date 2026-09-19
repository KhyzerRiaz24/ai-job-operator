# AI Job Operator — Project Instructions

## 1. Product

We are building an AI Job Operator for small UK trade businesses.

The initial target businesses are trades such as:

- plumbers
- electricians
- heating engineers
- roofers
- locksmiths
- appliance repair businesses
- builders
- landscapers

The initial target customer is a small trade business with approximately 1–10 employees.

The product sits on top of the business's existing software and automates operational work.

The initial workflow is:

Customer enquiry
→ qualification
→ service-area validation
→ job classification
→ availability check
→ booking
→ confirmation
→ CRM update
→ follow-up
→ human exception handling

The product is NOT intended to initially be:

- a generic chatbot
- a generic AI receptionist
- a replacement CRM
- a customer portal
- a general-purpose AI assistant

The product should automate real operational outcomes rather than simply generate text.

---

# 2. Product Principles

The system follows this pattern:

Human objective
→ AI reasoning
→ controlled tool call
→ business rule validation
→ external system
→ verification
→ workflow state update
→ customer communication or human escalation

AI reasoning must never bypass application business logic.

The AI can recommend or request an action.

The application decides whether that action is allowed.

---

# 3. Initial MVP

The MVP should support:

1. inbound customer enquiry
2. customer identification
3. enquiry qualification
4. service-area validation
5. job classification
6. availability checking
7. appointment booking
8. customer confirmation
9. CRM update
10. follow-up
11. rescheduling
12. cancellation
13. human escalation
14. exception handling
15. audit logging

The MVP should initially integrate with:

- Twilio
- Google Calendar
- HubSpot
- OpenAI

Potential future integrations include:

- Outlook Calendar
- Calendly
- Jobber
- ServiceM8
- Tradify
- WhatsApp
- Xero

Do not build future integrations unless specifically requested.

---

# 4. Technology Stack

Preferred stack:

Frontend:

- Next.js
- React
- TypeScript

Backend:

- TypeScript
- Next.js server-side functionality where appropriate

Database:

- PostgreSQL
- Supabase

Authentication:

- Supabase Auth

AI:

- OpenAI API
- structured outputs
- tool/function calling

Telephony and SMS:

- Twilio

Calendar:

- Google Calendar API

CRM:

- HubSpot API

Hosting:

- Vercel

Monitoring:

- Sentry
- structured application logging

Source control:

- GitHub
- Git

Optional workflow/integration tooling:

- n8n

n8n may be used for experimentation and integration prototyping but should not become the core source of truth for business logic.

---

# 5. Architecture Principles

Separate the following concerns:

1. AI reasoning
2. business rules
3. workflow/state management
4. tool execution
5. external integrations
6. database persistence
7. user interface
8. audit logging

Do not put business-critical logic inside prompts.

Do not make prompts responsible for enforcing permissions, pricing rules, service areas, booking restrictions, or authorization.

Business rules must be implemented deterministically in application code.

---

# 6. AI Architecture

The LLM must NOT directly access:

- PostgreSQL
- Supabase
- Twilio
- Google Calendar
- HubSpot
- arbitrary HTTP endpoints
- production infrastructure

The LLM interacts with the application through explicitly defined typed tools.

Example tools include:

- find_customer
- create_customer
- update_customer
- create_job
- update_job
- check_service_area
- find_available_slots
- hold_slot
- confirm_booking
- cancel_booking
- reschedule_booking
- send_sms
- create_crm_activity
- escalate_to_human

Every tool must:

1. validate its input
2. verify authorization
3. verify business ownership / tenant
4. apply relevant business rules
5. perform the external or database operation
6. verify the result where possible
7. log the action
8. return structured output
9. return a structured error when unsuccessful

The AI must never claim an action succeeded unless the application has confirmed that it succeeded.

The AI must never invent:

- appointment availability
- prices
- discounts
- customer information
- job status
- CRM updates
- booking confirmations

---

# 7. Workflow Architecture

Workflows must use explicit persisted states.

Initial states include:

- NEW
- QUALIFYING
- QUALIFIED
- AVAILABILITY_CHECK
- SLOT_OFFERED
- BOOKING_PENDING
- BOOKED
- CONFIRMED
- JOB_PENDING
- JOB_COMPLETED
- FOLLOW_UP
- CLOSED

Exception states include:

- WAITING_FOR_CUSTOMER
- WAITING_FOR_CONTRACTOR
- WAITING_FOR_HUMAN
- OUTSIDE_SERVICE_AREA
- NO_AVAILABILITY
- EMERGENCY
- UNKNOWN_REQUEST
- INTEGRATION_FAILURE
- BOOKING_FAILED
- CUSTOMER_DECLINED

Do not allow arbitrary workflow state transitions.

Transitions must be explicitly defined and validated.

Every meaningful transition should generate an audit/event record.

Long-running workflows must persist their state and next action rather than relying on an in-memory process.

---

# 8. Business Rules

Business rules must be configurable per business.

Potential rules include:

- service area
- postcode coverage
- opening hours
- emergency availability
- minimum callout
- emergency surcharge
- appointment duration
- appointment buffer
- maximum advance booking period
- required customer information
- human escalation rules

Never invent a business rule.

If a required rule is missing, the system should escalate or ask for configuration rather than guessing.

---

# 9. Emergency Handling

The system must recognise potentially dangerous enquiries.

Examples include:

- gas smell
- fire
- major flooding
- electrical danger
- exposed live electrical wires
- other potentially dangerous situations

Emergency handling must use predefined business-approved flows.

The AI must not invent safety instructions.

If the situation falls outside configured handling, escalate to a human.

---

# 10. Human Approval

The system should distinguish between:

### Fully automated actions

Examples:

- create customer
- update customer
- create job
- routine confirmation
- routine reminder
- CRM update
- booking within configured rules
- standard reschedule
- standard cancellation

### AI recommendation + human approval

Examples:

- unusual discount
- unusual travel charge
- non-standard job
- unusual quote
- customer complaint requiring judgement

### Always human

Examples:

- dangerous situations
- serious complaints
- legal threats
- refunds/disputes
- major pricing exceptions
- safeguarding issues
- anything outside configured business policy

---

# 11. Integrations

External integrations must be isolated behind provider interfaces/adapters.

Examples:

CalendarProvider
CRMProvider
MessagingProvider
TelephonyProvider

Initial implementations:

GoogleCalendarProvider
HubSpotProvider
TwilioMessagingProvider
TwilioTelephonyProvider

The rest of the application should depend on interfaces rather than provider-specific implementation details.

This allows future providers to be added without rewriting the core workflow.

---

# 12. Database

The application database should eventually include entities such as:

- businesses
- users
- customers
- jobs
- conversations
- messages
- appointments
- workflows
- workflow_events
- workflow_tasks
- tool_calls
- approvals
- integrations
- business_rules
- audit_logs

Every tenant-specific record must be associated with the appropriate business/tenant.

Tenant isolation is mandatory.

Never allow one business to access another business's data.

Use:

- foreign keys
- indexes
- constraints
- timestamps
- appropriate unique constraints
- database-level protection where appropriate

---

# 13. Security

Never commit secrets to Git.

Never hard-code:

- API keys
- passwords
- OAuth tokens
- database credentials
- Twilio credentials
- OpenAI API keys
- HubSpot tokens

Use environment variables.

Maintain `.env.example` containing variable names but never real credentials.

Production credentials must never appear in source code, tests, logs, error messages, or prompts.

All external actions must be authorized.

All tenant-specific data access must be tenant-scoped.

---

# 14. Reliability

External APIs can fail.

The application must handle:

- timeouts
- rate limits
- authentication failures
- malformed responses
- duplicate webhooks
- duplicate events
- booking conflicts
- partial failures
- network failures

Retries must only be used where they are safe.

Mutating operations should use idempotency where appropriate.

Never blindly retry an operation that could create a duplicate booking, message, payment, or customer.

---

# 15. Booking Safety

A booking must never be considered successful until the calendar/provider confirms success.

The system must account for race conditions.

Example:

Two customers request the same appointment.

The system must not assume the slot is available merely because a previous availability check returned it.

The final booking operation must verify the slot before confirming the booking.

---

# 16. Auditability

Important actions must be auditable.

Record relevant information such as:

- timestamp
- business
- user/system actor
- workflow
- action
- tool
- input
- result
- error
- state transition

Do not log secrets or sensitive credentials.

---

# 17. Testing

Testing is mandatory.

Use:

- unit tests
- integration tests
- workflow/state tests
- validation tests
- API adapter tests
- error-path tests
- authorization tests
- tenant-isolation tests

Important scenarios include:

- normal enquiry
- missing postcode
- outside service area
- no availability
- emergency enquiry
- ambiguous enquiry
- customer cancellation
- customer reschedule
- duplicate webhook
- booking conflict
- external API failure
- invalid AI structured output
- tool failure
- human escalation

Tests must test actual expected behaviour.

Never weaken or remove tests merely to make the test suite pass.

---

# 18. Development Process

Before implementing a significant feature:

1. inspect the existing codebase
2. understand the current architecture
3. identify affected files
4. identify dependencies
5. identify security/reliability risks
6. propose an implementation plan
7. wait for approval when the change is architectural or high-risk
8. implement incrementally
9. run tests
10. run type checking
11. run linting
12. inspect the Git diff
13. update relevant documentation
14. summarise what changed

Do not rewrite unrelated files.

Do not introduce unnecessary dependencies.

Do not change the architecture without explaining why.

Prefer simple solutions over premature abstraction.

---

# 19. Git Discipline

Keep commits focused.

Use descriptive commit messages.

Examples:

- feat: add initial database schema
- feat: add workflow state machine
- feat: add calendar provider
- feat: add Twilio messaging
- feat: add AI enquiry extraction
- test: add booking conflict tests
- fix: prevent duplicate booking

Do not commit secrets.

Do not commit generated build artefacts unless explicitly required.

---

# 20. Definition of Done

A feature is not complete merely because the code compiles.

Before considering a feature complete, verify:

- code implemented
- types pass
- tests pass
- lint passes
- error handling exists
- authorization exists
- tenant isolation is preserved
- important actions are logged
- external actions are verified
- no secrets are present
- no unrelated files were changed
- documentation is updated where appropriate
- Git diff has been reviewed

---

# 21. Cursor Behaviour

Act as a senior software engineering team working with the product owner.

Do not blindly implement ambiguous requirements.

When requirements are unclear:

1. identify the ambiguity
2. explain the relevant architectural choices
3. recommend the simplest safe approach
4. ask for a decision when necessary

For significant work, use this sequence:

INSPECT
→ PLAN
→ REVIEW
→ IMPLEMENT
→ TEST
→ TYPECHECK
→ LINT
→ REVIEW DIFF
→ DOCUMENT

Do not generate the entire product in one step.

Build the system incrementally.

The product owner wants a production-oriented MVP, not a throwaway prototype.

Prioritise:

1. correctness
2. reliability
3. security
4. simplicity
5. maintainability
6. speed of development
