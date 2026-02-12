"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { GalleryCard } from "./gallery-card";
import { RichMarkdownRenderer } from "./rich-markdown-renderer";
import { EditableText } from "./editable-text";
import { PdfPreview } from "./pdf-preview";
import { TreeBrowser } from "./tree-browser";
import { VideoPlayer } from "./video-player";

export interface GalleryContentSectionProps {
  className?: string;
}

export function GalleryContentSection({ className }: GalleryContentSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Content Components</div>
      <div className="grid grid-cols-2 gap-3">
        <GalleryCard name="RichMarkdownRenderer">
          <RichMarkdownRenderer content="**Hello** world" />
        </GalleryCard>

        <GalleryCard name="EditableText">
          <EditableText value="Click me to edit" label="Editable Field" />
        </GalleryCard>

        <GalleryCard name="PdfPreview">
          <PdfPreview file="quarterly-report.pdf" pages={24} />
        </GalleryCard>

        <GalleryCard name="TreeBrowser">
          <TreeBrowser
            nodes={[
              {
                id: "src", label: "src", type: "folder", children: [
                  { id: "index", label: "index.ts", type: "file" },
                  { id: "utils", label: "utils.ts", type: "file" },
                ],
              },
              { id: "pkg", label: "package.json", type: "file" },
            ]}
          />
        </GalleryCard>

        <GalleryCard name="VideoPlayer">
          <VideoPlayer />
        </GalleryCard>
      </div>
    </div>
  );
}
