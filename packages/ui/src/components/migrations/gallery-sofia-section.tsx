"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { GalleryCard } from "./gallery-card";
import { SonarDisplay } from "./sonar-display";
import { InlineKanban } from "./inline-kanban";
import { InlineTodo } from "./inline-todo";
import { InlineMarkdown } from "./inline-markdown";

export interface GallerySofiaSectionProps { className?: string; }

export function GallerySofiaSection({ className }: GallerySofiaSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-xs font-mono text-violet-400 uppercase tracking-wider">Sofia Components</div>
      <div className="grid grid-cols-3 gap-3">
        <GalleryCard name="SonarDisplay">
          <SonarDisplay
            size={120}
            pings={[
              { angle: 45, distance: 60 },
              { angle: 160, distance: 80 },
              { angle: 270, distance: 40 },
            ]}
          />
        </GalleryCard>
        <GalleryCard name="InlineKanban">
          <InlineKanban
            columns={["todo", "in_progress", "done"]}
            cards={[
              { id: "1", title: "Design review", column: "todo", priority: "P1" },
              { id: "2", title: "Ship feature", column: "in_progress", priority: "P0" },
              { id: "3", title: "Write tests", column: "done" },
            ]}
          />
        </GalleryCard>
        <GalleryCard name="InlineTodo">
          <InlineTodo
            title="Sprint Tasks"
            items={[
              { id: "a", text: "Migrate components", checked: true },
              { id: "b", text: "Run QA pass", checked: false, priority: "P1" },
              { id: "c", text: "Update docs", checked: false },
            ]}
          />
        </GalleryCard>
        <GalleryCard name="InlineMarkdown">
          <InlineMarkdown
            title="Release Notes"
            content={"**v3.1** — Gallery live renders, 327 screenshots\n\n- 24 shell flags resolved\n- Build gates green"}
          />
        </GalleryCard>
        <GalleryCard name="SofiaDashboard" shell>
          <div />
        </GalleryCard>
        <GalleryCard name="SofiaRecipes" shell>
          <div />
        </GalleryCard>
      </div>
    </div>
  );
}
