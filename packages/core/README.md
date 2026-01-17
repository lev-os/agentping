# @agentping/core

> 🧠 **Core Domain** – Framework-agnostic business logic for the AgentPing protocol.

## Overview

This package contains the heart of AgentPing: domain models, ports (interfaces), services, and parsers. It follows **hexagonal architecture** principles with zero dependencies on specific frameworks, databases, or UIs.

## 📦 Structure

```
src/
├── domain/       # Core business entities (Ping, Response, etc.)
├── ports/        # Interface definitions (IPingStore, INotificationChannel)
├── services/     # Business logic (PingService)
├── parsers/      # Interaction parsers
├── events/       # Domain events
└── index.ts      # Public exports
```

## 🔌 Ports (Interfaces)

| Port | Purpose |
|------|---------|
| `IPingSubmitter` | Input - How pings enter the system |
| `INotificationChannel` | Output - How humans get notified |
| `IPingStore` | Storage - Persistence abstraction |
| `IInteractionParser` | Parsing - Turn payloads into UI hints |
| `IEventBus` | Events - Inter-component communication |

## 🚀 Usage

```typescript
import { 
  PingService, 
  createPing,
  type Ping,
  type HumanResponse 
} from '@agentping/core';

// Create a ping
const ping = createPing({
  type: 'approval',
  agentId: 'my-agent',
  payload: {
    title: 'Deploy to production?',
    context: 'All tests passing'
  }
});
```

## 📜 License

**Proprietary** © [Kingly Agency](https://github.com/Kingly-Agency) — All Rights Reserved
