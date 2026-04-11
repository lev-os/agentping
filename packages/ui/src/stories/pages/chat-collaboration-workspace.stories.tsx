import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { MessageBubble } from "../../components/migrations/message-bubble";
import { TypingIndicator } from "../../components/migrations/typing-indicator";
import { AgentAvatar } from "../../components/migrations/agent-avatar";
import { ImageCompare } from "../../components/migrations/image-compare";
import { MarkdownEditor } from "../../components/migrations/markdown-editor";
import { RichMarkdownRenderer } from "../../components/migrations/rich-markdown-renderer";
import { ChatHeader } from "../../components/migrations/chat-header";
import { ChatInput } from "../../components/migrations/chat-input";
import { ChatSearch } from "../../components/migrations/chat-search";
import { ChatMessage } from "../../components/migrations/chat-message";
import { ChatPanel } from "../../components/migrations/chat-panel";
import { InlineMarkdown } from "../../components/migrations/inline-markdown";
import { InlineTodo } from "../../components/migrations/inline-todo";

/* ------------------------------------------------------------------ */
/* Mock Data                                                           */
/* ------------------------------------------------------------------ */

const AGENTS = [
  { name: "Cipher", status: "speaking" as const, initials: "CI" },
  { name: "Aegis", status: "idle" as const, initials: "AE" },
  { name: "Nova", status: "thinking" as const, initials: "NV" },
  { name: "Sentinel", status: "offline" as const, initials: "SN" },
];

const CHAT_MESSAGES = [
  { id: "m1", content: "Initiating security audit on module `core/auth`. Scanning 847 files...", sender: "Cipher", timestamp: "14:32:01", isOwn: false },
  { id: "m2", content: "Confirmed. I'll handle the dependency graph analysis in parallel.", sender: "Aegis", timestamp: "14:32:04", isOwn: false },
  { id: "m3", content: "Run the audit against the latest main branch, not staging.", sender: "You", timestamp: "14:32:12", isOwn: true },
  { id: "m4", content: "Acknowledged. Rebasing to `main@5b1d86f`. Found 3 CVEs in transitive deps:\n- **CVE-2026-1842** `lodash.merge` (critical)\n- **CVE-2026-0991** `axios` (medium)\n- **CVE-2026-1103** `jsonwebtoken` (low)", sender: "Cipher", timestamp: "14:32:45", isOwn: false },
  { id: "m5", content: "Dependency graph shows 12 circular references in `core/events` — recommend breaking the cycle at `EventBus -> Scheduler`.", sender: "Aegis", timestamp: "14:33:02", isOwn: false },
  { id: "m6", content: "Approve the lodash.merge patch. Hold on axios until we verify the SSR handler.", sender: "You", timestamp: "14:33:30", isOwn: true },
];

const PANEL_MESSAGES = CHAT_MESSAGES.map((m) => ({
  id: m.id,
  role: m.isOwn ? "user" as const : "assistant" as const,
  content: m.content,
  timestamp: new Date(`2026-02-13T${m.timestamp}`),
}));

const SEARCHABLE = CHAT_MESSAGES.map((m) => ({
  id: m.id,
  content: m.content,
  role: m.isOwn ? "user" : "assistant",
}));

const MARKDOWN_SAMPLE = `# Audit Report — core/auth

## Critical Findings

\`\`\`bash
npm audit --production
# 3 vulnerabilities found (1 critical, 1 medium, 1 low)
\`\`\`

### CVE-2026-1842: lodash.merge prototype pollution

> Allows prototype pollution via crafted payloads when merging user-controlled objects.

- **Severity**: Critical (CVSS 9.1)
- **Fix**: Upgrade to lodash@4.17.22+
- **Impact**: core/auth/src/middleware/session.ts

### Recommended Actions

1. Patch \`lodash.merge\` immediately
2. Add \`Object.freeze\` guard on session payloads
3. Enable CSP headers for all auth endpoints
`;

const TODO_ITEMS = [
  { id: "t1", text: "Patch lodash.merge to 4.17.22+", checked: true, priority: "critical" },
  { id: "t2", text: "Verify axios SSR handler compatibility", checked: false, priority: "high" },
  { id: "t3", text: "Break circular dep: EventBus -> Scheduler", checked: false, priority: "medium" },
  { id: "t4", text: "Add CSP headers to auth endpoints", checked: false, priority: "medium" },
  { id: "t5", text: "Run regression suite post-patch", checked: false, priority: "low" },
];

const SLASH_COMMANDS = [
  { name: "/audit", description: "Run security audit" },
  { name: "/approve", description: "Approve pending action" },
  { name: "/deploy", description: "Deploy to staging" },
];

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

function ChatCollaborationWorkspace() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black/90 text-cyan-100 font-mono">
      {/* Top bar */}
      <div className="border-b border-cyan-500/10 bg-black/95">
        <ChatHeader
          title="Security Audit Session"
          turnCount={CHAT_MESSAGES.length}
          workspacePath="core/auth — 4 agents active"
        />
      </div>

      <div className="grid grid-cols-[240px_1fr_320px] h-[calc(100vh-56px)]">
        {/* Sidebar — Agent roster + sessions */}
        <aside className="border-r border-cyan-500/10 bg-black/95 p-4 space-y-6 overflow-y-auto">
          <div>
            <div className="text-[10px] text-cyan-500/40 uppercase tracking-widest mb-3">Active Agents</div>
            <div className="space-y-3">
              {AGENTS.map((a) => (
                <div key={a.name} className="flex items-center gap-2">
                  <AgentAvatar name={a.name} initials={a.initials} status={a.status} size="sm" />
                  <div>
                    <div className="text-xs text-cyan-300">{a.name}</div>
                    <div className="text-[10px] text-cyan-500/40 capitalize">{a.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-cyan-500/40 uppercase tracking-widest mb-3">Task Checklist</div>
            <InlineTodo items={TODO_ITEMS} title="Audit Actions" />
          </div>
        </aside>

        {/* Main chat area */}
        <main className="flex flex-col overflow-hidden">
          {searchOpen && (
            <ChatSearch
              messages={SEARCHABLE}
              isOpen={searchOpen}
              onClose={() => setSearchOpen(false)}
              onNavigateToMessage={() => {}}
            />
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {CHAT_MESSAGES.map((msg) => (
              <MessageBubble
                key={msg.id}
                content={msg.content}
                sender={msg.sender}
                timestamp={msg.timestamp}
                isOwn={msg.isOwn}
                avatar={
                  !msg.isOwn ? (
                    <AgentAvatar
                      name={msg.sender}
                      size="sm"
                      status={AGENTS.find((a) => a.name === msg.sender)?.status ?? "idle"}
                    />
                  ) : undefined
                }
              />
            ))}
            <TypingIndicator />
          </div>

          <div className="border-t border-cyan-500/10 bg-black/95 p-3">
            <ChatInput
              placeholder="Message the squad..."
              slashCommands={SLASH_COMMANDS}
              onSend={() => {}}
            />
          </div>
        </main>

        {/* Right panel — Rendered output */}
        <aside className="border-l border-cyan-500/10 bg-black/95 overflow-y-auto p-4 space-y-4">
          <InlineMarkdown
            title="Audit Summary"
            content="3 CVEs found — 1 patched, 2 pending review. Circular deps flagged in core/events."
          />

          <RichMarkdownRenderer content={MARKDOWN_SAMPLE} />

          <div>
            <div className="text-[10px] text-cyan-500/40 uppercase tracking-widest mb-2">Before / After Comparison</div>
            <ImageCompare
              before="https://placehold.co/400x200/0a0a0a/06b6d4?text=Before+Patch"
              after="https://placehold.co/400x200/0a0a0a/22c55e?text=After+Patch"
              height={160}
            />
          </div>

          <div>
            <div className="text-[10px] text-cyan-500/40 uppercase tracking-widest mb-2">Quick Draft</div>
            <MarkdownEditor
              initialValue="## Patch Notes\n\n- Fixed lodash.merge prototype pollution\n- Added session payload freeze guard"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Compact panel variant                                               */
/* ------------------------------------------------------------------ */

function ChatPanelCompact() {
  return (
    <div className="min-h-screen bg-black/90 p-8 font-mono">
      <div className="max-w-3xl mx-auto border border-cyan-500/10 rounded-lg overflow-hidden">
        <ChatPanel
          messages={PANEL_MESSAGES}
          isConnected={true}
          onSendMessage={() => {}}
        />
      </div>

      <div className="max-w-3xl mx-auto mt-6 grid grid-cols-2 gap-4">
        <ChatMessage
          message={{
            id: "standalone-1",
            role: "assistant",
            content: "Running `npm audit` across 847 files in core/auth...",
            timestamp: new Date("2026-02-13T14:32:01"),
            toolUse: [
              { id: "tu1", name: "bash", input: { command: "npm audit --production" }, status: "success", result: "3 vulnerabilities found" },
            ],
          }}
        />
        <ChatMessage
          message={{
            id: "standalone-2",
            role: "user",
            content: "Approve the critical patch for lodash.merge. Deploy to staging after tests pass.",
            timestamp: new Date("2026-02-13T14:33:30"),
          }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stories                                                              */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: "Pages/Chat & Collaboration Workspace",
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
};
export default meta;

export const Default: StoryObj = {
  render: () => <ChatCollaborationWorkspace />,
};

export const CompactPanel: StoryObj = {
  render: () => <ChatPanelCompact />,
};
