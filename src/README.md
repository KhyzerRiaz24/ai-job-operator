/**
 * Modular monolith layout (approved architecture).
 *
 * Layers are reserved here so later phases have a stable home.
 * Do not put vendor SDKs or workflow logic in this Phase 1 spine.
 *
 *   config/         typed environment boundary
 *   health/         process health (no vendors)
 *   domain/         channel-agnostic business entities
 *   workflow/       persisted state machine
 *   rules/          deterministic business rules
 *   tools/          typed tool registry (LLM cannot call vendors directly)
 *   ai/             prompts + orchestrator
 *   auth/           session → tenant context
 *   db/             persistence / repositories
 *   audit/          audit logging
 *   integrations/   provider adapters (calendar, crm, messaging, telephony)
 *
 * Inbound channels (SMS, later voice/WhatsApp/web) are adapters under
 * integrations/, not the core domain.
 */
