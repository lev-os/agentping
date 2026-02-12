"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { GalleryCard } from "./gallery-card";
import { AlertBanner } from "./alert-banner";
import { ConfirmationModal } from "./confirmation-modal";
import { Rating } from "./rating";
import { TypingIndicator } from "./typing-indicator";
import { Skeleton } from "./skeleton";

export interface GalleryFeedbackSectionProps {
  className?: string;
}

export function GalleryFeedbackSection({ className }: GalleryFeedbackSectionProps) {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Feedback Components</div>
      <div className="grid grid-cols-2 gap-3">
        <GalleryCard name="AlertBanner">
          <div className="flex flex-col gap-2">
            <AlertBanner type="success" message="Agent deployed successfully." />
            <AlertBanner type="warning" message="Token usage approaching limit." />
            <AlertBanner type="error" message="Connection to API failed." />
          </div>
        </GalleryCard>

        <GalleryCard name="ConfirmationModal">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setModalOpen(true)}
              className="px-3 py-1.5 text-xs font-mono bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
            >
              Open Modal
            </button>
            <ConfirmationModal
              isOpen={modalOpen}
              title="Confirm Action"
              message="Are you sure you want to proceed?"
              onConfirm={() => setModalOpen(false)}
              onCancel={() => setModalOpen(false)}
            />
          </div>
        </GalleryCard>

        <GalleryCard name="Rating">
          <Rating value={3} max={5} readOnly />
        </GalleryCard>

        <GalleryCard name="TypingIndicator">
          <TypingIndicator />
        </GalleryCard>

        <GalleryCard name="Skeleton">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Skeleton variant="circle" width={32} />
              <Skeleton variant="text" count={2} />
            </div>
            <Skeleton variant="rect" height={40} />
          </div>
        </GalleryCard>
      </div>
    </div>
  );
}
