# @agentping/storage-sqlite

> 💾 **SQLite Storage** – Persistent storage adapter using sql.js (pure JavaScript SQLite).

## Overview

This package implements the `IPingStore` port from `@agentping/core` using SQLite for persistent, reliable storage. Uses [sql.js](https://sql.js.org) for pure-JavaScript SQLite that works in Node.js without native bindings.

## 📦 Features

- ✅ Pure JavaScript (no native dependencies)
- ✅ Automatic schema migrations
- ✅ Full audit log support
- ✅ Query filtering & pagination
- ✅ WAL mode for performance

## 🚀 Usage

```typescript
import { createSqliteStore } from '@agentping/storage-sqlite';

const store = await createSqliteStore({
  path: './data/agentping.db'
});

// Use with PingService
const service = new PingService(store, channels, parsers);
```

## 📊 Schema

| Table | Purpose |
|-------|---------|
| `pings` | Core ping data |
| `responses` | Human responses |
| `audit_log` | Full activity history |
| `sessions` | Agent session tracking |

## ⚙️ Configuration

```typescript
{
  path: './data/agentping.db',  // Database file location
  walMode: true,                 // Performance optimization
  busyTimeout: 5000              // Lock timeout (ms)
}
```

## 📜 License

**Proprietary** © [Kingly Agency](https://github.com/Kingly-Agency) — All Rights Reserved
