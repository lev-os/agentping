import { useEffect, useRef, useState, useCallback } from "react";

interface LogLine {
  type: "stdout" | "stderr" | "info";
  text: string;
  timestamp: number;
}

interface SetupPanelProps {
  dashboardId: string | null;
  onClose: () => void;
}

type SetupStatus = "running" | "success" | "failed";

function parseSSE(chunk: string): Array<{ event: string; data: string }> {
  const events: Array<{ event: string; data: string }> = [];
  const blocks = chunk.split("\n\n");
  for (const block of blocks) {
    if (!block.trim()) continue;
    let event = "message";
    let data = "";
    for (const line of block.split("\n")) {
      if (line.startsWith("event: ")) {
        event = line.slice(7).trim();
      } else if (line.startsWith("data: ")) {
        data = line.slice(6);
      }
    }
    if (data) {
      events.push({ event, data });
    }
  }
  return events;
}

export function SetupPanel({ dashboardId, onClose }: SetupPanelProps) {
  const [lines, setLines] = useState<LogLine[]>([]);
  const [status, setStatus] = useState<SetupStatus>("running");
  const [exitCode, setExitCode] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const autoCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    setVisible(false);
    if (autoCloseRef.current) {
      clearTimeout(autoCloseRef.current);
      autoCloseRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    // Wait for slide-down animation before unmounting
    setTimeout(() => {
      onClose();
    }, 200);
  }, [onClose]);

  useEffect(() => {
    if (!dashboardId) return;

    // Reset state for new setup
    setLines([]);
    setStatus("running");
    setExitCode(null);

    // Trigger slide-up
    requestAnimationFrame(() => setVisible(true));

    const controller = new AbortController();
    abortRef.current = controller;
    let buffer = "";

    async function connectSSE() {
      try {
        const response = await fetch(
          `http://127.0.0.1:3030/api/dashboards/${dashboardId}/setup`,
          {
            method: "POST",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          setLines((prev) => [
            ...prev,
            {
              type: "stderr",
              text: `HTTP ${response.status}: ${response.statusText}`,
              timestamp: Date.now(),
            },
          ]);
          setStatus("failed");
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          setStatus("failed");
          return;
        }

        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE events (delimited by double newlines)
          const events = parseSSE(buffer);
          // Keep any trailing incomplete event in the buffer
          const lastDoubleNewline = buffer.lastIndexOf("\n\n");
          if (lastDoubleNewline !== -1) {
            buffer = buffer.slice(lastDoubleNewline + 2);
          }

          for (const evt of events) {
            const now = Date.now();

            if (evt.event === "stdout") {
              setLines((prev) => [
                ...prev,
                { type: "stdout", text: evt.data, timestamp: now },
              ]);
            } else if (evt.event === "stderr") {
              setLines((prev) => [
                ...prev,
                { type: "stderr", text: evt.data, timestamp: now },
              ]);
            } else if (evt.event === "exit") {
              try {
                const payload = JSON.parse(evt.data);
                setExitCode(payload.exitCode ?? null);
              } catch {
                // ignore parse errors
              }
            } else if (evt.event === "lifecycle") {
              try {
                const payload = JSON.parse(evt.data);
                if (payload.success) {
                  setStatus("success");
                  setLines((prev) => [
                    ...prev,
                    {
                      type: "info",
                      text: `Lifecycle transitioned to: ${payload.lifecycle}`,
                      timestamp: now,
                    },
                  ]);
                } else {
                  setStatus("failed");
                  setExitCode(payload.exitCode ?? null);
                  setLines((prev) => [
                    ...prev,
                    {
                      type: "stderr",
                      text: `Setup failed (exit code: ${payload.exitCode})`,
                      timestamp: now,
                    },
                  ]);
                }
              } catch {
                // ignore parse errors
              }
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setLines((prev) => [
          ...prev,
          {
            type: "stderr",
            text: `Connection error: ${err instanceof Error ? err.message : String(err)}`,
            timestamp: Date.now(),
          },
        ]);
        setStatus("failed");
      }
    }

    void connectSSE();

    return () => {
      controller.abort();
      if (autoCloseRef.current) {
        clearTimeout(autoCloseRef.current);
      }
    };
  }, [dashboardId]);

  // Auto-close on success after 3s
  useEffect(() => {
    if (status === "success") {
      autoCloseRef.current = setTimeout(() => {
        handleClose();
      }, 3000);
      return () => {
        if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
      };
    }
  }, [status, handleClose]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  if (!dashboardId) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-200 ease-out ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ height: "min(40vh, 300px)", minHeight: 200 }}
    >
      <div
        className="h-full flex flex-col border-t border-cyan-500/20"
        style={{ background: "var(--color-bg-primary, #0a0a0f)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-cyan-500/10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-cyan-500/60 uppercase tracking-wider">
              Setup
            </span>
            <span className="font-mono text-xs text-white/60">
              {dashboardId}
            </span>
            {status === "running" && (
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-yellow-400 uppercase tracking-wider">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                Running
              </span>
            )}
            {status === "success" && (
              <span className="inline-block px-1.5 py-0.5 text-[10px] font-mono rounded uppercase tracking-wider text-green-400 bg-green-500/10">
                Ready
              </span>
            )}
            {status === "failed" && (
              <span className="inline-block px-1.5 py-0.5 text-[10px] font-mono rounded uppercase tracking-wider text-red-400 bg-red-500/10">
                Failed{exitCode !== null ? ` (exit ${exitCode})` : ""}
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-cyan-500/40 hover:text-cyan-400 transition-colors font-mono text-xs px-2 py-1"
            aria-label="Close setup panel"
          >
            ESC
          </button>
        </div>

        {/* Log output */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-2"
          style={{ fontFamily: "monospace", fontSize: 12 }}
        >
          {lines.length === 0 && status === "running" && (
            <div className="text-cyan-500/30 font-mono text-xs py-4">
              Connecting to setup stream...
            </div>
          )}
          {lines.map((line, i) => (
            <div
              key={i}
              className={`py-px leading-5 whitespace-pre-wrap break-all ${
                line.type === "stdout"
                  ? "text-emerald-400/80"
                  : line.type === "stderr"
                    ? "text-amber-400/80"
                    : "text-cyan-400/60"
              }`}
            >
              {line.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
