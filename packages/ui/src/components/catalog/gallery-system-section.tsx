"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { GalleryCard } from "./gallery-card";
import { AccessPad } from "./access-pad";
import { EncryptionStatus } from "./encryption-status";
import { FirewallRules } from "./firewall-rules";
import { PacketInspector } from "./packet-inspector";
import { ProcessTable } from "./process-table";
import { ServerRackStatus } from "./server-rack-status";
import { SignalMonitor } from "./signal-monitor";
import { TerminalConsole } from "./terminal-console";

export interface GallerySystemSectionProps { className?: string; }

export function GallerySystemSection({ className }: GallerySystemSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">System Components</div>
      <div className="grid grid-cols-3 gap-3">
        <GalleryCard name="AccessPad">
          <AccessPad codeLength={4} />
        </GalleryCard>
        <GalleryCard name="EncryptionStatus">
          <EncryptionStatus
            channels={[
              { name: "TLS-1.3", algorithm: "AES-256-GCM", strength: 95, status: "active" },
              { name: "WireGuard", algorithm: "ChaCha20", strength: 88, status: "active" },
              { name: "Legacy-SSH", algorithm: "RSA-2048", strength: 40, status: "rotating" },
            ]}
          />
        </GalleryCard>
        <GalleryCard name="FirewallRules">
          <FirewallRules
            rules={[
              { id: "1", name: "Allow HTTPS", action: "allow", source: "0.0.0.0/0", destination: "10.0.1.0/24", port: "443", protocol: "tcp", enabled: true },
              { id: "2", name: "Block Telnet", action: "deny", source: "0.0.0.0/0", destination: "*", port: "23", protocol: "tcp", enabled: true },
              { id: "3", name: "Log DNS", action: "log", source: "10.0.0.0/8", destination: "*", port: "53", protocol: "udp", enabled: true },
            ]}
          />
        </GalleryCard>
        <GalleryCard name="PacketInspector">
          <PacketInspector
            packets={[
              { id: "1", timestamp: "12:00:01.234", source: "10.0.1.5", destination: "93.184.216.34", protocol: "TCP", size: 1420 },
              { id: "2", timestamp: "12:00:01.456", source: "10.0.1.5", destination: "8.8.8.8", protocol: "UDP", size: 64 },
              { id: "3", timestamp: "12:00:01.789", source: "93.184.216.34", destination: "10.0.1.5", protocol: "TCP", size: 820 },
            ]}
          />
        </GalleryCard>
        <GalleryCard name="ProcessTable">
          <ProcessTable
            processes={[
              { pid: 1, name: "systemd", cpu: 0.1, memory: 0.3, status: "running", user: "root" },
              { pid: 42, name: "agent-runtime", cpu: 24.5, memory: 12.1, status: "running", user: "lev" },
              { pid: 108, name: "old-daemon", cpu: 0.0, memory: 0.0, status: "zombie", user: "nobody" },
            ]}
          />
        </GalleryCard>
        <GalleryCard name="ServerRackStatus">
          <ServerRackStatus
            rackId="RACK-A7"
            units={[
              { id: "u1", name: "web-proxy-01", type: "network", status: "online", load: 45 },
              { id: "u2", name: "api-server-03", type: "server", status: "online", load: 78 },
              { id: "u3", name: "db-replica-02", type: "storage", status: "maintenance" },
            ]}
          />
        </GalleryCard>
        <GalleryCard name="SignalMonitor">
          <SignalMonitor
            channels={[
              { id: "1", name: "WiFi-6E", frequency: "6 GHz", strength: 92, active: true },
              { id: "2", name: "Bluetooth", frequency: "2.4 GHz", strength: 65, active: true },
              { id: "3", name: "LoRa", frequency: "915 MHz", strength: 30, active: false },
            ]}
          />
        </GalleryCard>
        <GalleryCard name="TerminalConsole">
          <TerminalConsole
            prompt="lev $"
            lines={[
              { type: "input", content: "lev status" },
              { type: "output", content: "Runtime: active | Agents: 3 online" },
              { type: "system", content: "[info] agent-ping heartbeat OK" },
            ]}
          />
        </GalleryCard>
      </div>
    </div>
  );
}
