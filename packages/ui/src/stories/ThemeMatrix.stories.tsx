import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

// Theme CSS is already loaded via preview.ts, but components need it cascading
import "../theme/themes.css";

// POC components
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";

import { JarvisOrb } from "../components/voice/jarvis-orb";
import { EntityCard } from "../components/review/entity-card";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const THEMES = ["agentping", "canvas", "sofia", "lcars"] as const;
const MODES = ["dark", "light"] as const;

const THEME_LABELS: Record<string, string> = {
  agentping: "AP",
  canvas: "Canvas",
  sofia: "Sofia",
  lcars: "LCARS",
};

// ---------------------------------------------------------------------------
// ThemeCell — wraps a single component in a scoped theme context
// ---------------------------------------------------------------------------

function ThemeCell({
  theme,
  mode,
  children,
}: {
  theme: string;
  mode: string;
  children: React.ReactNode;
}) {
  return (
    <div
      data-theme={theme}
      data-mode={mode}
      style={{
        padding: "16px",
        background: "var(--color-background)",
        color: "var(--color-foreground)",
        borderRadius: "4px",
        border: "1px solid var(--color-border)",
        minWidth: "180px",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ComponentRow — renders one component across all 8 theme+mode combinations
// ---------------------------------------------------------------------------

function ComponentRow({
  label,
  children,
}: {
  label: string;
  children: (theme: string, mode: string) => React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <h3
        style={{
          fontFamily: "var(--font-display, 'Inter')",
          fontSize: "13px",
          marginBottom: "12px",
          color: "#999",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          fontWeight: 600,
        }}
      >
        {label}
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gap: "8px",
        }}
      >
        {THEMES.flatMap((theme) =>
          MODES.map((mode) => (
            <ThemeCell key={`${theme}-${mode}`} theme={theme} mode={mode}>
              {children(theme, mode)}
            </ThemeCell>
          ))
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ColumnHeaders — labels for the 8 columns
// ---------------------------------------------------------------------------

function ColumnHeaders() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(8, 1fr)",
        gap: "8px",
        marginBottom: "8px",
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "#0a0a0a",
        paddingBottom: "8px",
        paddingTop: "8px",
      }}
    >
      {THEMES.flatMap((theme) =>
        MODES.map((mode) => (
          <div
            key={`header-${theme}-${mode}`}
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#888",
              textAlign: "center",
              padding: "4px",
              borderBottom: "1px solid #333",
            }}
          >
            {THEME_LABELS[theme]} {mode === "dark" ? "Dark" : "Light"}
          </div>
        ))
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: "Theme/Matrix",
  parameters: {
    layout: "fullscreen",
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Story: AllComponents — the full 7-component matrix
// ---------------------------------------------------------------------------

export const AllComponents: Story = {
  render: () => (
    <div style={{ padding: "24px", background: "#0a0a0a", minHeight: "100vh" }}>
      <h2
        style={{
          fontFamily: "monospace",
          fontSize: "16px",
          color: "#ccc",
          marginBottom: "24px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        Theme Matrix — All POC Components
      </h2>

      <ColumnHeaders />

      {/* Button */}
      <ComponentRow label="Button">
        {() => (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <Button variant="default" size="sm">
              ENGAGE
            </Button>
            <Button variant="outline" size="sm">
              OUTLINE
            </Button>
          </div>
        )}
      </ComponentRow>

      {/* Card */}
      <ComponentRow label="Card">
        {() => (
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--color-muted-foreground)",
                }}
              >
                All subsystems nominal.
              </p>
            </CardContent>
          </Card>
        )}
      </ComponentRow>

      {/* Input */}
      <ComponentRow label="Input">
        {() => (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <Input placeholder="Search agents..." />
            <Input placeholder="Error state" error />
          </div>
        )}
      </ComponentRow>

      {/* Badge */}
      <ComponentRow label="Badge">
        {() => (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            <Badge variant="default">Active</Badge>
            <Badge variant="secondary">Pending</Badge>
            <Badge variant="success">Online</Badge>
            <Badge variant="destructive">Error</Badge>
          </div>
        )}
      </ComponentRow>

      {/* JarvisOrb */}
      <ComponentRow label="JarvisOrb">
        {() => (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
              height: "80px",
            }}
          >
            <JarvisOrb size={48} active variant="default" />
          </div>
        )}
      </ComponentRow>

      {/* EntityCard */}
      <ComponentRow label="EntityCard">
        {() => (
          <EntityCard
            name="GPT-4o"
            type="model"
            status="active"
            description="Primary reasoning engine"
            metrics={[
              { label: "Latency", value: "120ms" },
              { label: "Uptime", value: "99.9%" },
            ]}
          />
        )}
      </ComponentRow>

      {/* Dialog (trigger only — overlay can't render inline) */}
      <ComponentRow label="Dialog (trigger)">
        {() => (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Open Dialog
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogDescription>
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </ComponentRow>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Story: ButtonMatrix — all button variants across themes
// ---------------------------------------------------------------------------

const BUTTON_VARIANTS = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
] as const;

export const ButtonMatrix: Story = {
  render: () => (
    <div style={{ padding: "24px", background: "#0a0a0a", minHeight: "100vh" }}>
      <h2
        style={{
          fontFamily: "monospace",
          fontSize: "16px",
          color: "#ccc",
          marginBottom: "24px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        Button Variants
      </h2>

      <ColumnHeaders />

      {BUTTON_VARIANTS.map((variant) => (
        <ComponentRow key={variant} label={`Button / ${variant}`}>
          {() => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                alignItems: "flex-start",
              }}
            >
              <Button variant={variant} size="sm">
                {variant.toUpperCase()}
              </Button>
              <Button variant={variant} size="sm" disabled>
                DISABLED
              </Button>
            </div>
          )}
        </ComponentRow>
      ))}
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Story: BadgeMatrix — all badge variants across themes
// ---------------------------------------------------------------------------

const BADGE_VARIANTS = [
  "default",
  "secondary",
  "success",
  "warning",
  "destructive",
  "outline",
  "ghost",
] as const;

export const BadgeMatrix: Story = {
  render: () => (
    <div style={{ padding: "24px", background: "#0a0a0a", minHeight: "100vh" }}>
      <h2
        style={{
          fontFamily: "monospace",
          fontSize: "16px",
          color: "#ccc",
          marginBottom: "24px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        Badge Variants
      </h2>

      <ColumnHeaders />

      {BADGE_VARIANTS.map((variant) => (
        <ComponentRow key={variant} label={`Badge / ${variant}`}>
          {() => (
            <Badge variant={variant}>
              {variant.toUpperCase()}
            </Badge>
          )}
        </ComponentRow>
      ))}
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Story: InputStates — input normal, placeholder, error across themes
// ---------------------------------------------------------------------------

export const InputStates: Story = {
  render: () => (
    <div style={{ padding: "24px", background: "#0a0a0a", minHeight: "100vh" }}>
      <h2
        style={{
          fontFamily: "monospace",
          fontSize: "16px",
          color: "#ccc",
          marginBottom: "24px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        Input States
      </h2>

      <ColumnHeaders />

      <ComponentRow label="Input / Default">
        {() => <Input placeholder="Enter value..." />}
      </ComponentRow>

      <ComponentRow label="Input / With Value">
        {() => <Input defaultValue="Hello, world" />}
      </ComponentRow>

      <ComponentRow label="Input / Error">
        {() => <Input placeholder="Invalid input" error />}
      </ComponentRow>

      <ComponentRow label="Input / Disabled">
        {() => <Input placeholder="Disabled" disabled />}
      </ComponentRow>
    </div>
  ),
};
