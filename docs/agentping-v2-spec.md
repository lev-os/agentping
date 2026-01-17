# AgentPing v2: Agent-Human Interaction Protocol

## Core Philosophy

**This is not a notification center. This is an interaction protocol.**

The insight: 80% of agent-human interactions are quick dispatches:
- "look more here"
- "deep research this"  
- "approve steps 1, 3, 5"
- "skip this, do that instead"

The problem with current agent UIs: they give you a text box and "approve/deny". That's like giving someone a CLI when they need a GUI.

**AgentPing is a protocol + parsers that turn agent output into rich action surfaces.**

---

## Architecture: Hexagonal (Ports & Adapters)

```
                                    ┌─────────────────────────────────┐
                                    │         OUTPUT ADAPTERS         │
                                    │  (where humans see & respond)   │
                                    ├─────────────────────────────────┤
                                    │  • Default Web UI               │
                                    │  • Slack App                    │
                                    │  • Discord Bot                  │
                                    │  • Telegram Bot                 │
                                    │  • VS Code Extension            │
                                    │  • Custom UI (BYOU)             │
                                    │  • CLI (for terminal lovers)    │
                                    │  • Webhook (roll your own)      │
                                    └───────────────▲─────────────────┘
                                                    │
                                                    │ Output Port
                                                    │ (INotificationChannel)
                                                    │
┌─────────────────────────────────┐     ┌──────────┴──────────┐     ┌─────────────────────────────────┐
│        INPUT ADAPTERS           │     │                     │     │       INTERACTION PARSERS       │
│  (how agents send requests)     │     │        CORE         │     │   (turn output → action UIs)    │
├─────────────────────────────────┤     │                     │     ├─────────────────────────────────┤
│  • CLI Tool                     │────▶│  • Ping Queue       │────▶│  • StepApprovalParser           │
│  • MCP Server                   │     │  • Session Manager  │     │  • ResearchDirectiveParser      │
│  • Python SDK                   │     │  • Response Router  │     │  • CodeReviewParser             │
│  • TypeScript SDK               │     │  • Audit Log        │     │  • FileSelectionParser          │
│  • HTTP API                     │     │                     │     │  • ConfirmationParser           │
│  • WebSocket                    │◀────│                     │◀────│  • FreeformParser (fallback)    │
└─────────────────────────────────┘     └─────────────────────┘     └─────────────────────────────────┘
          │                                       │                               │
          │ Input Port                            │ Storage Port                  │ Parser Port
          │ (IPingSubmitter)                      │ (IPingStore)                  │ (IInteractionParser)
          │                                       │                               │
          ▼                                       ▼                               ▼
   Agents call these                        SQLite/Postgres                 You can add custom
   to reach humans                          or any DB                       parsers for your use case
```

---

## Core Domain (The Hexagon Center)

### Prompt 1: Core Domain Models

```
Create the core domain for AgentPing. This is framework-agnostic, pure business logic.

Directory: packages/core/

Key principle: NO DEPENDENCIES on specific frameworks, databases, or UIs. Only ports (interfaces).

1. **Domain Models** (packages/core/src/domain/)

```typescript
// The fundamental unit of agent-human communication
interface Ping {
  id: string;
  
  // Who's talking
  agentId: string;
  agentName: string;
  sessionId: string;
  
  // What they're saying
  type: PingType;
  payload: PingPayload;  // Structured data the agent sends
  
  // Lifecycle
  status: 'pending' | 'responded' | 'expired' | 'dismissed';
  response: HumanResponse | null;
  
  // Metadata
  createdAt: Date;
  respondedAt: Date | null;
  expiresAt: Date | null;
  
  // For parsers to attach parsed UI hints
  parsedInteraction: ParsedInteraction | null;
}

// Different ping types have different payloads
type PingType = 
  | 'notification'      // FYI, no response needed
  | 'question'          // Need an answer
  | 'approval'          // Yes/no for an action
  | 'step_approval'     // Approve N of M steps
  | 'research_request'  // Agent wants direction on research
  | 'review_request'    // Agent wants feedback on output
  | 'selection'         // Pick from options (files, approaches, etc.)
  | 'custom';           // Extensible

// The payload is type-specific structured data
interface StepApprovalPayload {
  type: 'step_approval';
  title: string;
  context: string;
  steps: Array<{
    id: string;
    description: string;
    risk: 'low' | 'medium' | 'high';
    reversible: boolean;
    details?: string;
    estimatedImpact?: string;
  }>;
  allowPartial: boolean;  // Can they approve some but not others?
  defaultApproved: string[];  // Pre-selected steps
}

interface ResearchRequestPayload {
  type: 'research_request';
  title: string;
  currentFindings: string;
  proposedDirections: Array<{
    id: string;
    direction: string;
    rationale: string;
    estimatedEffort: 'quick' | 'medium' | 'deep';
  }>;
  allowCustomDirection: boolean;
}

interface SelectionPayload {
  type: 'selection';
  title: string;
  context: string;
  options: Array<{
    id: string;
    label: string;
    description?: string;
    preview?: string;  // Could be code, file path, URL, etc.
    metadata?: Record<string, unknown>;
  }>;
  allowMultiple: boolean;
  allowCustom: boolean;
  minSelections?: number;
  maxSelections?: number;
}

// Human's response - also structured
interface HumanResponse {
  // What they did
  action: 'approved' | 'denied' | 'selected' | 'answered' | 'dismissed' | 'custom';
  
  // Structured response data (matches the ping type)
  data: ResponseData;
  
  // Optional enrichment - this is the magic
  enrichment?: ResponseEnrichment;
  
  respondedAt: Date;
  respondedVia: string;  // 'web-ui' | 'slack' | 'cli' | etc.
}

// The enrichment is where humans add value beyond yes/no
interface ResponseEnrichment {
  // Quick directives they can attach
  directives: Directive[];
  
  // Freeform notes
  notes?: string;
  
  // Attachments (files, links, context)
  attachments?: Attachment[];
}

type Directive = 
  | { type: 'focus_on'; target: string }           // "look more here"
  | { type: 'skip'; target: string; reason?: string }  // "don't bother with this"
  | { type: 'deep_research'; topic: string }       // "dig deeper on this"
  | { type: 'simplify' }                           // "this is too complex"
  | { type: 'expand'; section: string }            // "tell me more about X"
  | { type: 'prioritize'; items: string[] }        // "do these first"
  | { type: 'constraint'; rule: string }           // "but don't touch the auth code"
  | { type: 'reference'; url: string }             // "check this resource"
  | { type: 'custom'; key: string; value: unknown };
```

2. **Ports (Interfaces)** (packages/core/src/ports/)

```typescript
// Input Port - how pings enter the system
interface IPingSubmitter {
  submit(ping: CreatePingRequest): Promise<Ping>;
  getStatus(pingId: string): Promise<Ping | null>;
  waitForResponse(pingId: string, timeoutMs: number): Promise<HumanResponse | null>;
  cancel(pingId: string): Promise<void>;
}

// Output Port - how humans get notified
interface INotificationChannel {
  name: string;
  notify(ping: Ping, parsedInteraction: ParsedInteraction): Promise<void>;
  supportsInlineResponse: boolean;  // Can respond without leaving the channel?
  supportedInteractionTypes: string[];  // What UI patterns it can render
}

// Storage Port
interface IPingStore {
  save(ping: Ping): Promise<void>;
  findById(id: string): Promise<Ping | null>;
  findPending(filters?: PingFilters): Promise<Ping[]>;
  findBySession(sessionId: string): Promise<Ping[]>;
  update(id: string, updates: Partial<Ping>): Promise<void>;
  
  // Audit log
  appendAuditLog(entry: AuditEntry): Promise<void>;
  getAuditLog(filters?: AuditFilters): Promise<AuditEntry[]>;
}

// Parser Port - turns payloads into interaction hints
interface IInteractionParser {
  name: string;
  canParse(ping: Ping): boolean;
  parse(ping: Ping): ParsedInteraction;
  priority: number;  // Higher = tried first
}

// What parsers produce - hints for UIs to render
interface ParsedInteraction {
  // What kind of UI to render
  interactionType: string;  // 'step-checklist' | 'direction-picker' | 'code-review' | etc.
  
  // Quick actions to show (the 80% case)
  quickActions: QuickAction[];
  
  // Structured UI hints
  uiHints: Record<string, unknown>;
  
  // Fallback for channels that can't render rich UI
  fallbackText: string;
  fallbackOptions: string[];
}

interface QuickAction {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;  // Keyboard shortcut
  style: 'primary' | 'secondary' | 'danger' | 'ghost';
  
  // What this action does
  action: 
    | { type: 'approve_all' }
    | { type: 'deny_all' }
    | { type: 'approve_selected'; ids: string[] }
    | { type: 'select'; ids: string[] }
    | { type: 'directive'; directive: Directive }
    | { type: 'open_detail' }  // Expand for more nuanced response
    | { type: 'custom'; handler: string; payload: unknown };
}
```

3. **Core Services** (packages/core/src/services/)

```typescript
class PingService {
  constructor(
    private store: IPingStore,
    private channels: INotificationChannel[],
    private parsers: IInteractionParser[],
    private eventBus: IEventBus
  ) {}

  async submitPing(request: CreatePingRequest): Promise<Ping> {
    // 1. Create the ping
    const ping = this.createPing(request);
    
    // 2. Run through parsers to get interaction hints
    const parser = this.parsers
      .sort((a, b) => b.priority - a.priority)
      .find(p => p.canParse(ping));
    
    if (parser) {
      ping.parsedInteraction = parser.parse(ping);
    }
    
    // 3. Save to store
    await this.store.save(ping);
    
    // 4. Notify all registered channels
    await Promise.all(
      this.channels.map(ch => ch.notify(ping, ping.parsedInteraction))
    );
    
    // 5. Emit event
    this.eventBus.emit('ping:created', ping);
    
    return ping;
  }

  async respond(pingId: string, response: HumanResponse): Promise<Ping> {
    // Update ping, emit events, etc.
  }
}
```

This is the entire core - no HTTP, no SQLite, no React. Just pure domain logic.
```

---

## Input Adapters

### Prompt 2: HTTP API Adapter

```
Create the HTTP API input adapter for AgentPing.

Directory: packages/adapters/http-api/

This adapter exposes the core via HTTP. It implements IPingSubmitter.

Tech: Use Hono (lightweight, works everywhere) or Express.

Endpoints:

POST /api/v1/pings
  - Create a new ping
  - Body: CreatePingRequest (typed payload)
  - Returns: { ping: Ping }

GET /api/v1/pings/:id
  - Get ping status
  - Returns: { ping: Ping }

GET /api/v1/pings/:id/wait
  - Long-poll for response
  - Query: ?timeout=30
  - Returns: { response: HumanResponse } or 408 timeout

POST /api/v1/pings/:id/respond
  - Submit human response
  - Body: HumanResponse
  - Returns: { ping: Ping }

GET /api/v1/pings
  - List pings
  - Query: ?status=pending&session=xxx&limit=50
  
WebSocket /api/v1/ws
  - Real-time events
  - Messages: { type: 'ping:created' | 'ping:responded', data: Ping }

The adapter should:
1. Validate request bodies against TypeScript types (use zod or typebox)
2. Transform HTTP requests into domain calls
3. Transform domain responses into HTTP responses
4. Handle errors gracefully with proper status codes
5. Be completely stateless - all state is in the core

Example:
```typescript
import { Hono } from 'hono';
import { PingService } from '@agentping/core';

export function createHttpAdapter(pingService: PingService) {
  const app = new Hono();
  
  app.post('/api/v1/pings', async (c) => {
    const body = await c.req.json();
    const validated = CreatePingRequestSchema.parse(body);
    const ping = await pingService.submitPing(validated);
    return c.json({ ping });
  });
  
  // ... etc
  
  return app;
}
```
```

### Prompt 3: CLI Input Adapter

```
Create the CLI input adapter for AgentPing.

Directory: packages/adapters/cli/

This is what agents call from shell scripts or command line.

Commands map to ping types:

1. agentping notify <message>
   → Creates a 'notification' type ping
   
2. agentping ask <question> [--options a,b,c]
   → Creates a 'question' type ping, waits for response
   
3. agentping approve <action>
   → Creates a 'approval' type ping, waits for response
   
4. agentping approve-steps --file steps.json
   → Creates a 'step_approval' type ping with structured steps
   → JSON format:
   {
     "title": "Deployment Plan",
     "steps": [
       { "id": "1", "description": "Run migrations", "risk": "medium" },
       { "id": "2", "description": "Deploy to staging", "risk": "low" }
     ]
   }
   → Returns which steps were approved: {"approved": ["1"], "denied": ["2"]}

5. agentping research --file research.json
   → Creates a 'research_request' type ping
   → Returns chosen direction + any enrichments

6. agentping select --file options.json [--multi]
   → Creates a 'selection' type ping
   → Returns selected option IDs

Output modes:
  --json           Output raw JSON (for parsing in scripts)
  --quiet          Only output the response value
  --verbose        Full details including enrichments

The CLI should:
1. Connect to daemon via HTTP (configurable URL)
2. Submit the ping
3. Wait for response (with timeout, --timeout flag)
4. Parse the response and output appropriately
5. Exit codes: 0=responded, 1=denied, 2=timeout, 3=error

Example usage in a script:
```bash
# Simple
APPROVED=$(agentping approve "Delete /tmp/cache?" --quiet)
if [ "$APPROVED" = "approved" ]; then
  rm -rf /tmp/cache
fi

# Complex with enrichments
RESPONSE=$(agentping approve-steps --file deploy-plan.json --json)
APPROVED_STEPS=$(echo $RESPONSE | jq -r '.approved[]')
DIRECTIVES=$(echo $RESPONSE | jq -r '.enrichment.directives[]')

for step in $APPROVED_STEPS; do
  run_step $step
done
```
```

### Prompt 4: MCP Server Adapter

```
Create an MCP (Model Context Protocol) server adapter for AgentPing.

Directory: packages/adapters/mcp/

This lets Claude, Cursor, and other MCP-compatible agents use AgentPing natively.

MCP Tools:

1. notify_human
   Simple notification, fire and forget.
   
2. ask_human  
   Freeform question, returns string response.

3. request_approval
   Yes/no approval, returns { approved: boolean, notes?: string }

4. request_step_approval
   THE KEY TOOL - structured multi-step approval.
   
   Parameters:
   - title: string
   - context: string (what's the overall goal)
   - steps: array of { id, description, risk, reversible, details }
   - allow_partial: boolean (can they approve some but not all?)
   
   Returns:
   {
     approved_steps: string[],     // IDs of approved steps
     denied_steps: string[],       // IDs of denied steps  
     enrichment: {
       directives: [...],          // "focus on X", "skip Y", etc.
       notes: "...",               // Freeform human notes
       constraints: [...]          // "don't touch auth code"
     }
   }

5. request_research_direction
   When agent has done initial research and needs direction.
   
   Parameters:
   - title: string
   - current_findings: string
   - proposed_directions: array of { id, direction, rationale, effort }
   - allow_custom: boolean
   
   Returns:
   {
     selected_directions: string[],
     custom_direction?: string,
     enrichment: {
       focus_areas: [...],
       skip_areas: [...],
       references: [...]
     }
   }

6. request_selection
   Generic selection from options.
   
   Parameters:
   - title: string
   - options: array of { id, label, description, preview }
   - allow_multiple: boolean
   - allow_custom: boolean
   
   Returns:
   {
     selected: string[],
     custom?: string,
     enrichment: {...}
   }

7. get_pending_responses
   Check if there are responses waiting (for async patterns).

The MCP server should:
1. Properly describe each tool so the LLM knows when to use them
2. Handle the long-poll internally (don't let the MCP connection timeout)
3. Format responses so the LLM can easily use them
4. Include examples in tool descriptions

Critical: The tool descriptions should guide the LLM to use STRUCTURED tools
(like request_step_approval) instead of freeform ask_human when appropriate.
```

---

## Output Adapters (Notification Channels)

### Prompt 5: Default Web UI Adapter

```
Create the default Web UI notification channel for AgentPing.

Directory: packages/adapters/web-ui/

This is a MINIMAL UI focused entirely on agent-human interaction.

Tech: React + Vite + Tailwind. Keep it simple.

NOT a dashboard. NOT settings pages. Just:

1. **The Queue** (main view)
   - List of pending pings
   - Each ping rendered by its interaction type
   - Keyboard navigable (j/k, enter, etc.)

2. **Interaction Renderers** (one per interaction type)
   
   Each interaction type gets a specialized renderer:

   a) StepApprovalRenderer
      - Checklist of steps with checkboxes
      - Risk indicators (color coded)
      - "Approve Selected" / "Approve All" / "Deny All" buttons
      - Quick directives sidebar: + Focus on... + Skip... + Constraint...
      - Keyboard: space to toggle, a=approve all, d=deny all

   b) ResearchDirectionRenderer  
      - Cards for each proposed direction
      - Effort indicators
      - Select one or more
      - "Add custom direction" option
      - Quick: "go deeper on..." "skip..." 

   c) SelectionRenderer
      - Options as cards or list
      - Preview pane for selected option
      - Multi-select if allowed
      - Quick filter/search

   d) CodeReviewRenderer
      - Syntax-highlighted code display
      - Inline comment ability
      - Approve / Request Changes / Comment
      - Quick: "simplify this" "explain this" "alternative approach"

   e) SimpleQuestionRenderer
      - Text input
      - Previous context shown
      - Suggested responses (if any)

   f) ApprovalRenderer
      - Big Approve / Deny buttons
      - Details expandable
      - Quick: "approved but..." "denied because..."

3. **Enrichment Panel** (sidebar or bottom)
   - Always visible when responding
   - Add directives via buttons or typing
   - Common directives as quick-add buttons:
     [+ Focus on...] [+ Skip...] [+ Deep research...] [+ Constraint...]
   - Freeform notes area
   - Attach links/references

4. **History** (secondary view)
   - Past interactions
   - Searchable
   - Reusable responses

UI Principles:
- ONE column, no sidebar navigation
- Keyboard-first (show shortcuts on hover)
- Dark mode only (it's for devs)
- Respond in <3 seconds for common actions
- Mobile responsive (respond from phone)

No:
- User settings page
- Analytics dashboard  
- Agent management
- Anything that isn't "see ping, respond to ping"
```

### Prompt 6: Slack Adapter

```
Create a Slack notification channel adapter for AgentPing.

Directory: packages/adapters/slack/

This adapter sends pings to Slack and receives responses via Slack interactivity.

Setup:
- Slack App with Bot Token
- Slash command: /agentping
- Interactivity enabled for buttons/menus
- Incoming webhook OR direct channel posting

How it works:

1. When a ping is created, post a message to configured channel(s)
2. Message uses Slack Block Kit to render the interaction
3. User clicks buttons / uses menus to respond
4. Slack sends interaction payload to our webhook
5. We update the ping with the response

Rendering different ping types:

a) StepApproval → Slack checkboxes + buttons
```json
{
  "blocks": [
    { "type": "header", "text": "🤖 Agent requests approval" },
    { "type": "section", "text": "Deployment to production" },
    { "type": "checkboxes", "options": [...steps...] },
    { "type": "actions", "elements": [
      { "type": "button", "text": "Approve Selected", "style": "primary" },
      { "type": "button", "text": "Deny All", "style": "danger" }
    ]}
  ]
}
```

b) Selection → Slack select menu or buttons

c) Approval → Two buttons: Approve / Deny

d) Question → Button that opens modal with text input

Enrichment in Slack:
- "Add notes" button opens modal
- Overflow menu with directive options
- Thread replies captured as freeform notes

Limitations doc:
- Slack Block Kit can't do everything the web UI can
- Document what's supported vs falls back to "open in web"
- For complex interactions, include "Respond in full UI →" link

Config:
```json
{
  "slack": {
    "bot_token": "xoxb-...",
    "channels": {
      "default": "#agent-requests",
      "urgent": "#agent-urgent"
    },
    "mention_users": ["U123"],  // @mention these users
    "routing": {
      "high_risk": "#agent-urgent",
      "research": "#agent-research"
    }
  }
}
```
```

### Prompt 7: Webhook Adapter (BYOU - Bring Your Own UI)

```
Create a generic webhook adapter for AgentPing.

Directory: packages/adapters/webhook/

This is for people who want to build their own UI or integrate with their own systems.

When a ping is created:
1. POST to configured webhook URL(s)
2. Include full ping data + parsed interaction hints
3. Optionally wait for synchronous response

Webhook payload:
```json
{
  "event": "ping.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "ping": {
    "id": "...",
    "type": "step_approval",
    "payload": { ... },
    "parsedInteraction": {
      "interactionType": "step-checklist",
      "quickActions": [...],
      "uiHints": {...},
      "fallbackText": "...",
      "fallbackOptions": [...]
    }
  },
  "response_url": "https://your-agentping/api/v1/pings/xxx/respond"
}
```

The receiver can:
a) Respond synchronously in the webhook response
b) POST back to the response_url later
c) Ignore (for notification-only integrations)

Config:
```json
{
  "webhooks": [
    {
      "url": "https://my-system.com/agentping-hook",
      "events": ["ping.created", "ping.expired"],
      "secret": "...",  // For signature verification
      "filters": {
        "types": ["approval", "step_approval"],  // Only these types
        "agents": ["prod-*"]  // Only these agents
      }
    }
  ]
}
```

Also provide:
- Signature verification (HMAC)
- Retry logic with exponential backoff
- Event types: ping.created, ping.responded, ping.expired, ping.dismissed
```

---

## Interaction Parsers

### Prompt 8: Core Interaction Parsers

```
Create the interaction parsers that turn ping payloads into UI hints.

Directory: packages/core/src/parsers/

These implement IInteractionParser and produce ParsedInteraction objects.

1. **StepApprovalParser**
   Handles: step_approval type pings
   
   Produces:
   ```typescript
   {
     interactionType: 'step-checklist',
     quickActions: [
       { id: 'approve-all', label: 'Approve All', shortcut: 'a', style: 'primary', action: { type: 'approve_all' }},
       { id: 'approve-low-risk', label: 'Approve Low Risk', style: 'secondary', action: { type: 'approve_selected', ids: [...lowRiskStepIds] }},
       { id: 'deny-all', label: 'Deny All', shortcut: 'd', style: 'danger', action: { type: 'deny_all' }},
     ],
     uiHints: {
       groupByRisk: true,
       showReversibleBadge: true,
       defaultExpanded: payload.steps.length < 5,
       suggestedDirectives: ['constraint', 'skip', 'prioritize']
     },
     fallbackText: `Approve ${payload.steps.length} steps for: ${payload.title}`,
     fallbackOptions: ['Approve all', 'Deny all', 'Open in UI']
   }
   ```

2. **ResearchDirectiveParser**
   Handles: research_request type pings
   
   Produces:
   ```typescript
   {
     interactionType: 'direction-picker',
     quickActions: [
       // One quick action per proposed direction
       ...payload.proposedDirections.map(d => ({
         id: `select-${d.id}`,
         label: d.direction,
         style: 'secondary',
         action: { type: 'select', ids: [d.id] }
       })),
       { id: 'all', label: 'All Directions', action: { type: 'select', ids: payload.proposedDirections.map(d => d.id) }},
       { id: 'custom', label: 'Custom Direction...', action: { type: 'open_detail' }}
     ],
     uiHints: {
       showEffortBadges: true,
       showRationale: true,
       suggestedDirectives: ['focus_on', 'skip', 'deep_research', 'reference']
     },
     fallbackText: `Choose research direction: ${payload.proposedDirections.map(d => d.direction).join(', ')}`,
     fallbackOptions: payload.proposedDirections.map(d => d.direction)
   }
   ```

3. **SelectionParser**
   Handles: selection type pings
   
   Smart quick actions based on options:
   - If <4 options: each option is a quick action button
   - If >4 options: "Select in UI" quick action
   - If allowMultiple: "Select all" quick action

4. **ApprovalParser**
   Handles: approval type pings
   
   Simple: Approve / Deny buttons
   Suggests relevant directives based on content

5. **QuestionParser**
   Handles: question type pings
   
   If options provided: quick action per option
   If freeform: "Answer in UI" quick action
   
6. **NotificationParser**
   Handles: notification type pings
   
   Just: "Dismiss" quick action
   No response needed

7. **FallbackParser** (lowest priority, always matches)
   Handles: anything else
   
   Generic quick actions: Open in UI, Dismiss

Each parser should:
- Analyze the payload to determine smart defaults
- Generate contextual quick actions
- Suggest relevant directive types
- Produce good fallback text for simple channels (Slack, SMS, etc.)
```

### Prompt 9: Custom Parser Registration

```
Create a system for registering custom interaction parsers.

Users should be able to:
1. Create their own parser
2. Register it with the system
3. Have it handle specific ping types or patterns

Example custom parser:
```typescript
// my-parsers/deployment-parser.ts
import { IInteractionParser, Ping, ParsedInteraction } from '@agentping/core';

export const deploymentParser: IInteractionParser = {
  name: 'deployment-approval',
  priority: 100,  // Higher than default parsers
  
  canParse(ping: Ping): boolean {
    // Match pings from deployment agents
    return ping.agentId.startsWith('deploy-') && ping.type === 'approval';
  },
  
  parse(ping: Ping): ParsedInteraction {
    return {
      interactionType: 'deployment-approval',
      quickActions: [
        { id: 'approve', label: '🚀 Ship It', style: 'primary', action: { type: 'approve_all' }},
        { id: 'staging', label: 'Staging First', style: 'secondary', 
          action: { type: 'directive', directive: { type: 'constraint', rule: 'deploy to staging first' }}},
        { id: 'deny', label: 'Not Now', style: 'danger', action: { type: 'deny_all' }},
      ],
      uiHints: {
        showDiffLink: true,
        showLastDeployTime: true,
      },
      fallbackText: `Deploy approval needed: ${ping.payload.action}`,
      fallbackOptions: ['Ship it', 'Staging first', 'Deny']
    };
  }
};
```

Registration via:
a) Config file:
```json
{
  "parsers": [
    { "path": "./my-parsers/deployment-parser.js", "export": "deploymentParser" }
  ]
}
```

b) Programmatic:
```typescript
const pingService = new PingService({
  parsers: [...defaultParsers, deploymentParser]
});
```

c) Plugin directory:
   ~/.agentping/parsers/*.js are auto-loaded
```

---

## Quick Directive System

### Prompt 10: Directive System

```
Create the directive system - this is how humans add rich feedback beyond yes/no.

Directory: packages/core/src/directives/

Directives are structured hints that agents can understand and act on.

Built-in directive types:

1. focus_on
   Human wants agent to focus on a specific area.
   { type: 'focus_on', target: 'the authentication flow' }

2. skip
   Human wants agent to skip/ignore something.
   { type: 'skip', target: 'unit tests', reason: 'will add later' }

3. deep_research
   Human wants deeper investigation on a topic.
   { type: 'deep_research', topic: 'performance implications' }

4. simplify
   Human thinks output/approach is too complex.
   { type: 'simplify', aspect?: 'the data model' }

5. expand
   Human wants more detail on something.
   { type: 'expand', section: 'error handling' }

6. prioritize
   Human specifies priority order.
   { type: 'prioritize', items: ['security', 'performance', 'readability'] }

7. constraint
   Human adds a constraint/rule to follow.
   { type: 'constraint', rule: 'must be backwards compatible' }

8. reference
   Human provides a reference to check.
   { type: 'reference', url: 'https://...', note: 'follow this pattern' }

9. alternative
   Human suggests an alternative approach.
   { type: 'alternative', suggestion: 'consider using Redis instead' }

10. timeline
    Human specifies time constraint.
    { type: 'timeline', deadline: 'end of day', flexibility: 'hard' | 'soft' }

Each directive type should have:
- TypeScript type definition
- Validation schema
- UI component for input (in web UI)
- Fallback text representation (for Slack, etc.)
- Serialization to agent-friendly format

Agents receive directives in their response:
```json
{
  "approved_steps": ["1", "2"],
  "enrichment": {
    "directives": [
      { "type": "focus_on", "target": "step 2 implementation" },
      { "type": "constraint", "rule": "don't modify the database schema" },
      { "type": "timeline", "deadline": "before standup", "flexibility": "soft" }
    ],
    "notes": "Looks good overall, just be careful with step 2"
  }
}
```

UI for adding directives:
- Quick-add buttons for common types
- Autocomplete for targets (based on ping content)
- Templates: "I often add: [constraint: don't break prod]"
```

---

## Storage Adapters

### Prompt 11: SQLite Storage Adapter

```
Create the SQLite storage adapter.

Directory: packages/adapters/storage-sqlite/

Implements IPingStore using SQLite.

Tables:

```sql
CREATE TABLE pings (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  session_id TEXT NOT NULL,
  type TEXT NOT NULL,
  payload JSON NOT NULL,
  parsed_interaction JSON,
  status TEXT NOT NULL DEFAULT 'pending',
  response JSON,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  responded_at DATETIME,
  expires_at DATETIME,
  
  -- Indexes
  CREATE INDEX idx_pings_status ON pings(status);
  CREATE INDEX idx_pings_session ON pings(session_id);
  CREATE INDEX idx_pings_created ON pings(created_at);
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  event_type TEXT NOT NULL,
  ping_id TEXT,
  agent_id TEXT,
  data JSON,
  
  CREATE INDEX idx_audit_timestamp ON audit_log(timestamp);
);

CREATE TABLE directive_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  directive JSON NOT NULL,
  use_count INTEGER DEFAULT 0
);
```

Features:
- Auto-create DB at ~/.agentping/agentping.db
- Migrations system for schema changes
- JSON column support for complex data
- Efficient queries for common operations
- Vacuum/cleanup for old data

Use better-sqlite3 (sync, fast) or sql.js (wasm, portable).
```

---

## Wiring It Together

### Prompt 12: Main Entry Point

```
Create the main entry point that wires everything together.

Directory: packages/daemon/

This is what actually runs - it instantiates the hex architecture.

```typescript
// packages/daemon/src/main.ts
import { PingService } from '@agentping/core';
import { createHttpAdapter } from '@agentping/adapter-http';
import { SQLiteStore } from '@agentping/adapter-sqlite';
import { WebUIChannel } from '@agentping/adapter-webui';
import { SlackChannel } from '@agentping/adapter-slack';
import { WebhookChannel } from '@agentping/adapter-webhook';
import { defaultParsers } from '@agentping/core/parsers';
import { loadConfig } from './config';

async function main() {
  const config = await loadConfig();
  
  // Storage adapter
  const store = new SQLiteStore(config.database.path);
  
  // Notification channels (output adapters)
  const channels: INotificationChannel[] = [
    new WebUIChannel(config.webui),
  ];
  
  if (config.slack?.enabled) {
    channels.push(new SlackChannel(config.slack));
  }
  
  if (config.webhooks?.length) {
    channels.push(new WebhookChannel(config.webhooks));
  }
  
  // Parsers (load defaults + custom)
  const parsers = [
    ...defaultParsers,
    ...await loadCustomParsers(config.parsers),
  ];
  
  // Core service
  const pingService = new PingService({
    store,
    channels,
    parsers,
    eventBus: new EventEmitter(),
  });
  
  // Input adapters
  const httpApp = createHttpAdapter(pingService);
  
  // Start servers
  const httpServer = httpApp.listen(config.port);
  console.log(`AgentPing daemon running on port ${config.port}`);
  
  // Graceful shutdown
  process.on('SIGTERM', async () => {
    await httpServer.close();
    await store.close();
    process.exit(0);
  });
}

main().catch(console.error);
```

Config file: ~/.agentping/config.json
```json
{
  "port": 7890,
  "database": {
    "path": "~/.agentping/agentping.db"
  },
  "webui": {
    "enabled": true,
    "port": 7891
  },
  "slack": {
    "enabled": false,
    "botToken": null,
    "channels": {}
  },
  "webhooks": [],
  "parsers": []
}
```

CLI to manage:
- agentping daemon start
- agentping daemon stop
- agentping daemon status
- agentping daemon logs
```

---

## Implementation Order (Weekend Hackathon)

### Saturday

**Morning (4 hrs): Core + Storage**
- [ ] Set up monorepo (packages/core, packages/adapters/*)
- [ ] Core domain models and types (Prompt 1)
- [ ] SQLite storage adapter (Prompt 11)
- [ ] Basic PingService (create, respond, get)

**Afternoon (4 hrs): Input Adapters**
- [ ] HTTP API adapter (Prompt 2)
- [ ] CLI tool (Prompt 3)
- [ ] Test: can create ping via CLI, see it in DB

**Evening (2 hrs): Basic Notifications**
- [ ] Simple console/log channel
- [ ] Webhook adapter skeleton (Prompt 7)
- [ ] Test: ping created → webhook fires

### Sunday

**Morning (4 hrs): Web UI**
- [ ] Basic React app with ping queue (Prompt 5)
- [ ] StepApprovalRenderer
- [ ] SelectionRenderer
- [ ] Enrichment panel with directives

**Afternoon (4 hrs): Parsers + Polish**
- [ ] Core parsers (Prompt 8)
- [ ] Quick actions working
- [ ] Keyboard navigation
- [ ] Real-time updates via WebSocket

**Evening (2 hrs): Integration**
- [ ] MCP server adapter (Prompt 4)
- [ ] Test with Claude/Cursor
- [ ] Demo script

### Stretch Goals
- [ ] Slack adapter
- [ ] Custom parser loading
- [ ] Directive templates
- [ ] Mobile responsive

---

## The Key Insight

The magic isn't in the notification system. It's in:

1. **Structured payloads** - Agents send structured data, not strings
2. **Smart parsers** - Turn structure into actionable UI
3. **Quick actions** - 80% of responses are one click
4. **Rich enrichment** - The other 20% get directives, not essays

When an agent says "approve these 5 steps", the human sees:
- ☑️ Run tests (low risk)
- ☑️ Build artifacts (low risk)  
- ☐ Deploy to staging (medium risk)
- ☐ Run migrations (high risk)
- ☐ Deploy to prod (high risk)

[Approve 1-2] [Approve All] [Deny] 

+ Add directive: [Focus on...] [Skip...] [Constraint...]

Not a text box that says "Type your response here."

**That's the product.**
