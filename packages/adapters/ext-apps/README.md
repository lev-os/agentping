# @agentping/ext-apps

MCP Apps Extension adapter (SEP-1865) for AgentPing. This package generates
self-contained HTML UIs for human-in-the-loop interactions and serves them
to MCP hosts via `ui://` resources. When an agent raises a ping through
`@agentping/core`, the ext-apps adapter renders the appropriate interactive
UI -- step approval checklist, option selector, free-form question, binary
approval gate, or notification -- and delivers it to any MCP host that
supports the `io.modelcontextprotocol/ui` extension.

## Architecture

```
@agentping/core (Ping)
        |
        v
  UIResourceRegistry          <-- registers ui:// resources + HTML generators
        |
        |--- generateHTML()    <-- dispatches to typed generator by payload.type
        |--- listResources()   <-- exposes resource catalog to MCP host
        |--- getToolUIMetadata() <-- links MCP tools to their UI resource
        v
  ExtAppsBridge                <-- JSON-RPC 2.0 postMessage bridge (host <-> UI)
        |
        v
  MCP Host renders HTML        <-- iframe with text/html;profile=mcp-app
```

**UIResourceRegistry** is the central class. It holds a map of `UIResource`
descriptors (URI, name, MIME type, layout hints, CSP policy) and a parallel map
of HTML generator functions keyed by ping payload type. When no specific
generator matches, a generic fallback renders the raw payload as JSON.

**ExtAppsBridge** handles bidirectional communication between the MCP host and
the rendered UI using `window.postMessage` with JSON-RPC 2.0 envelopes. The
host can push ping data into the UI (`ping/display`, `ping/update`); the UI
sends responses back (`ui/response`, `ui/dismiss`).

## Available UI Types

| Payload type     | Generator                | Description                                      |
| ---------------- | ------------------------ | ------------------------------------------------ |
| `step-approval`  | `generateStepApprovalHTML` | Checklist of steps with risk badges; approve selected, all, or deny all |
| `selection`      | `generateSelectionHTML`    | Single- or multi-select option list with confirm  |
| `question`       | `generateQuestionHTML`     | Quick-reply buttons and/or free-form text input   |
| `approval`       | `generateApprovalHTML`     | Binary approve/deny gate with risk level display  |
| `notification`   | `generateNotificationHTML` | Dismissable info/success/warning/error banner     |
| *(other)*        | `generateGenericHTML`      | Fallback that renders raw ping payload as JSON    |

All generators accept an optional `HostContext` for theme (`light`/`dark`),
locale, container dimensions, and CSS variable overrides.

## Usage

```ts
import { UIResourceRegistry } from '@agentping/ext-apps';
import { createBridge } from '@agentping/ext-apps/bridge';

// 1. Create a registry (registers default resources + generators)
const registry = new UIResourceRegistry({ uriPrefix: 'ui://agentping' });

// 2. Generate HTML for a ping
const html = registry.generateHTML(ping, { theme: 'dark' });

// 3. Expose resources to the MCP host
const resources = registry.listResources();

// 4. Link a tool call to its UI resource
const meta = registry.getToolUIMetadata('request_step_approval');
// => { resourceUri: 'ui://agentping/step-approval', visibility: ['model', 'app'] }

// 5. Listen for user responses via the bridge
const bridge = createBridge();
bridge.on('ui:response', (event) => {
  console.log('User responded:', event.payload);
});
```

### Package Exports

| Export path                     | Contents                                 |
| ------------------------------- | ---------------------------------------- |
| `@agentping/ext-apps`          | `UIResourceRegistry`, types              |
| `@agentping/ext-apps/resources`| Static resource definitions, lookup helpers |
| `@agentping/ext-apps/bridge`   | `ExtAppsBridge`, `createBridge` factory  |

## Relationship to AgentPing Core

This adapter is a rendering surface for `@agentping/core`. Core defines the
`Ping` and `HumanResponse` domain types and manages lifecycle (create, route,
resolve). The ext-apps adapter consumes those types read-only and is
responsible solely for visual presentation inside MCP hosts. It does not
store pings, manage state, or handle transport -- those concerns belong to
core and the daemon/storage adapters respectively.
