"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface TeamMember {
  name: string;
  role: string;
  status: "online" | "away" | "offline";
  avatar?: string;
}

export interface TeamRosterProps {
  members: TeamMember[];
  className?: string;
}

const STATUS_DOT: Record<TeamMember["status"], string> = {
  online: "bg-green-400",
  away: "bg-yellow-400",
  offline: "bg-gray-500",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * TeamRoster - Team member cards with status
 * @source packages/adapters/web-ui/src/components/TeamRoster.tsx
 * @migration-status implemented
 */
export function TeamRoster({ members, className }: TeamRosterProps) {
  const onlineCount = members.filter((m) => m.status === "online").length;

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Team Roster</div>
        <div className="text-[10px] font-mono text-green-400/70">
          {onlineCount}/{members.length} online
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {members.map((member, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-cyan-500/10 bg-black/40 px-3 py-2.5 hover:border-cyan-500/20 transition-colors"
          >
            <div className="relative flex-shrink-0">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-400">
                  {getInitials(member.name)}
                </div>
              )}
              <div
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-black/80",
                  STATUS_DOT[member.status]
                )}
              />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-mono text-gray-200 truncate">{member.name}</div>
              <div className="text-[10px] font-mono text-cyan-500/40 truncate">{member.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
