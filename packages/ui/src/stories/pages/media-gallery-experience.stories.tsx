import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { AudioPlayer } from "../../components/migrations/audio-player";
import { VideoPlayer } from "../../components/migrations/video-player";
import { ImageCompare } from "../../components/migrations/image-compare";
import { ImageDiff } from "../../components/migrations/image-diff";
import { PdfPreview } from "../../components/migrations/pdf-preview";
import { FileAssetPicker, type FileAsset } from "../../components/migrations/file-asset-picker";
import { DraggableList, type DraggableItem } from "../../components/migrations/draggable-list";
import { FileExplorer } from "../../components/migrations/file-explorer";
import { FileTree, type FileNode } from "../../components/migrations/file-tree";
import { FileMetadataCard, type FileMetadata } from "../../components/migrations/file-metadata-card";
import { FileViewer } from "../../components/migrations/file-viewer";
import { AssetCard } from "../../components/migrations/asset-card";

/* ------------------------------------------------------------------ */
/* Mock Data                                                           */
/* ------------------------------------------------------------------ */

const AUDIO_TRACKS = [
  { src: "#", title: "Agent Handshake Tone", duration: "0:03" },
  { src: "#", title: "Task Complete Chime", duration: "0:02" },
  { src: "#", title: "Alert — Critical", duration: "0:05" },
  { src: "#", title: "Ambient — Mission Control", duration: "3:42" },
];

const FILE_TREE: FileNode[] = [
  {
    name: "agents",
    path: "/agents",
    type: "directory",
    children: [
      { name: "cipher.yaml", path: "/agents/cipher.yaml", type: "file", extension: "yaml" },
      { name: "aegis.yaml", path: "/agents/aegis.yaml", type: "file", extension: "yaml" },
      { name: "nova.yaml", path: "/agents/nova.yaml", type: "file", extension: "yaml" },
    ],
  },
  {
    name: "assets",
    path: "/assets",
    type: "directory",
    children: [
      { name: "logo.svg", path: "/assets/logo.svg", type: "file", extension: "svg" },
      { name: "hero-bg.png", path: "/assets/hero-bg.png", type: "file", extension: "png", size: 245000 },
      { name: "demo.mp4", path: "/assets/demo.mp4", type: "file", extension: "mp4", size: 12400000 },
      {
        name: "audio",
        path: "/assets/audio",
        type: "directory",
        children: [
          { name: "chime.wav", path: "/assets/audio/chime.wav", type: "file", extension: "wav" },
          { name: "alert.wav", path: "/assets/audio/alert.wav", type: "file", extension: "wav" },
        ],
      },
    ],
  },
  {
    name: "docs",
    path: "/docs",
    type: "directory",
    children: [
      { name: "README.md", path: "/docs/README.md", type: "file", extension: "md" },
      { name: "architecture.pdf", path: "/docs/architecture.pdf", type: "file", extension: "pdf" },
    ],
  },
];

const FILE_ASSETS: FileAsset[] = [
  { id: "a1", name: "hero-bg.png", type: "image/png", size: "245 KB", preview: "https://placehold.co/120x80/0a0a0a/06b6d4?text=Hero" },
  { id: "a2", name: "logo.svg", type: "image/svg+xml", size: "4.2 KB", preview: "https://placehold.co/120x80/0a0a0a/06b6d4?text=Logo" },
  { id: "a3", name: "avatar-cipher.png", type: "image/png", size: "18 KB", preview: "https://placehold.co/120x80/0a0a0a/06b6d4?text=CI" },
  { id: "a4", name: "screenshot-01.png", type: "image/png", size: "890 KB", preview: "https://placehold.co/120x80/0a0a0a/06b6d4?text=SS1" },
  { id: "a5", name: "diagram.svg", type: "image/svg+xml", size: "12 KB", preview: "https://placehold.co/120x80/0a0a0a/06b6d4?text=Diag" },
  { id: "a6", name: "thumbnail.jpg", type: "image/jpeg", size: "67 KB", preview: "https://placehold.co/120x80/0a0a0a/06b6d4?text=Thumb" },
];

const PLAYLIST: DraggableItem[] = AUDIO_TRACKS.map((t, i) => ({
  id: `track-${i}`,
  content: (
    <div className="flex items-center justify-between w-full text-xs font-mono">
      <span className="text-cyan-300">{t.title}</span>
      <span className="text-cyan-500/40">{t.duration}</span>
    </div>
  ),
}));

const SELECTED_FILE_META: FileMetadata = {
  name: "hero-bg.png",
  size: "245 KB",
  type: "image/png",
  modified: "2026-02-12 18:42:05",
  path: "/assets/hero-bg.png",
};

const CODE_SAMPLE = `# Agent Configuration — Cipher
name: Cipher
model: claude-opus-4-6
temperature: 0.7
max_tokens: 4096
tools:
  - bash
  - read_file
  - write_file
  - grep_search
system_prompt: |
  You are a security-focused agent specializing
  in vulnerability scanning and patch management.`;

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

function MediaGalleryExperience() {
  const [selectedAsset, setSelectedAsset] = useState<string>("a1");
  const [viewerOpen, setViewerOpen] = useState(true);

  return (
    <div className="min-h-screen bg-black/90 text-cyan-100 font-mono">
      {/* Header */}
      <div className="border-b border-cyan-500/10 bg-black/95 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-sm text-cyan-400 uppercase tracking-widest">Media Gallery</h1>
          <p className="text-[10px] text-cyan-500/40 mt-0.5">{FILE_ASSETS.length} assets — 1.2 MB total</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-cyan-500/40">
          <button className="px-2 py-1 border border-cyan-500/20 rounded hover:bg-cyan-500/10 text-cyan-400">Grid</button>
          <button className="px-2 py-1 border border-cyan-500/10 rounded hover:bg-cyan-500/10">List</button>
        </div>
      </div>

      <div className="grid grid-cols-[220px_1fr_300px] h-[calc(100vh-52px)]">
        {/* Left — File tree */}
        <aside className="border-r border-cyan-500/10 bg-black/95 overflow-y-auto">
          <FileExplorer
            files={FILE_TREE}
            workspacePath="/workspace"
            onFileSelect={() => {}}
          />
        </aside>

        {/* Center — Gallery grid + media players */}
        <main className="overflow-y-auto p-6 space-y-6">
          {/* Asset picker grid */}
          <div>
            <div className="text-[10px] text-cyan-500/40 uppercase tracking-widest mb-3">Asset Library</div>
            <FileAssetPicker
              assets={FILE_ASSETS}
              selected={selectedAsset}
              onSelect={(a) => setSelectedAsset(a.id)}
            />
          </div>

          {/* Image comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] text-cyan-500/40 uppercase tracking-widest mb-2">Slider Compare</div>
              <ImageCompare
                before="https://placehold.co/400x200/0a0a0a/06b6d4?text=Before"
                after="https://placehold.co/400x200/0a0a0a/22c55e?text=After"
                height={180}
              />
            </div>
            <div>
              <div className="text-[10px] text-cyan-500/40 uppercase tracking-widest mb-2">Side-by-Side Diff</div>
              <ImageDiff
                before="https://placehold.co/200x180/0a0a0a/ef4444?text=Old"
                after="https://placehold.co/200x180/0a0a0a/22c55e?text=New"
                mode="side-by-side"
              />
            </div>
          </div>

          {/* Video player */}
          <div>
            <div className="text-[10px] text-cyan-500/40 uppercase tracking-widest mb-2">Video Preview</div>
            <VideoPlayer
              poster="https://placehold.co/640x360/0a0a0a/06b6d4?text=Demo+Video"
            />
          </div>

          {/* Audio section */}
          <div>
            <div className="text-[10px] text-cyan-500/40 uppercase tracking-widest mb-2">Audio Assets</div>
            <div className="space-y-2">
              {AUDIO_TRACKS.map((track) => (
                <AudioPlayer key={track.title} src={track.src} title={track.title} duration={track.duration} />
              ))}
            </div>
          </div>

          {/* Playlist reorder */}
          <div>
            <div className="text-[10px] text-cyan-500/40 uppercase tracking-widest mb-2">Playlist Order</div>
            <DraggableList items={PLAYLIST} />
          </div>

          {/* PDF preview */}
          <div>
            <div className="text-[10px] text-cyan-500/40 uppercase tracking-widest mb-2">Documents</div>
            <PdfPreview file="architecture.pdf" pages={12} />
          </div>

          {/* Finance asset cards row */}
          <div>
            <div className="text-[10px] text-cyan-500/40 uppercase tracking-widest mb-2">Asset Tokens</div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              <AssetCard symbol="AGT" name="AgentCoin" price="$142.80" change={12.4} icon="A" />
              <AssetCard symbol="LVT" name="Leviathan" price="$89.30" change={-2.1} icon="L" />
              <AssetCard symbol="SKY" name="SkynetDAO" price="$1,204.50" change={5.7} icon="S" />
            </div>
          </div>
        </main>

        {/* Right — Preview panel */}
        <aside className="border-l border-cyan-500/10 bg-black/95 overflow-y-auto p-4 space-y-4">
          <FileMetadataCard file={SELECTED_FILE_META} />

          {viewerOpen && (
            <FileViewer
              filePath="/agents/cipher.yaml"
              content={CODE_SAMPLE}
              language="yaml"
              onClose={() => setViewerOpen(false)}
            />
          )}

          <div>
            <div className="text-[10px] text-cyan-500/40 uppercase tracking-widest mb-2">File Tree</div>
            <FileTree
              items={FILE_TREE}
              onFileClick={() => {}}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stories                                                              */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: "Pages/Media Gallery",
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
};
export default meta;

export const Default: StoryObj = {
  render: () => <MediaGalleryExperience />,
};
