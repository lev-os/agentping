import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import {
  EnrichmentPanel,
  type Directive,
  type FileAttachment,
  type EnrichmentQuickAction,
} from "../../components/migrations/enrichment-panel";

const meta: Meta<typeof EnrichmentPanel> = {
  title: "Migrations/WebUI/EnrichmentPanel",
  component: EnrichmentPanel,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="bg-zinc-950 p-8 min-h-[300px]">
        <div className="max-w-2xl">
          <Story />
        </div>
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof EnrichmentPanel>;

// -- Default: shell / empty state (backward-compatible) --
export const Default: Story = {
  args: {},
};

// -- WithDirectives: pre-populated directives + notes --
const sampleDirectives: Directive[] = [
  { type: "focus_on", value: "Authentication flow edge cases" },
  { type: "skip", value: "CSS-only visual tweaks" },
  { type: "constraint", value: "Must complete in under 200ms" },
];

export const WithDirectives: Story = {
  args: {
    directives: sampleDirectives,
    notes: "Check the token refresh path — it may timeout on slow connections.",
    onAddDirective: fn(),
    onRemoveDirective: fn(),
    onNotesChange: fn(),
  },
};

// -- WithAttachments: directives + file attachment chips --
const fakeFile = (name: string, sizeKB: number): File => {
  const blob = new Blob(["x".repeat(sizeKB * 1024)], { type: "application/octet-stream" });
  return new File([blob], name, { type: blob.type });
};

const sampleAttachments: FileAttachment[] = [
  { id: "att-1", file: fakeFile("screenshot.png", 48) },
  { id: "att-2", file: fakeFile("error-log.txt", 12.3) },
];

export const WithAttachments: Story = {
  args: {
    directives: [sampleDirectives[0]],
    attachments: sampleAttachments,
    notes: "",
    onAddDirective: fn(),
    onRemoveDirective: fn(),
    onNotesChange: fn(),
    onAddAttachment: fn(),
    onRemoveAttachment: fn(),
  },
};

// -- WithActions: QuickActionBar actions in the header --
const sampleActions: EnrichmentQuickAction[] = [
  { id: "run", label: "Run", style: "primary", shortcut: "Ctrl+R", onClick: fn() },
  { id: "save", label: "Save Draft", style: "secondary", onClick: fn() },
  { id: "reset", label: "Reset", style: "danger", onClick: fn() },
  { id: "help", label: "?", style: "ghost", onClick: fn() },
];

export const WithActions: Story = {
  args: {
    directives: sampleDirectives.slice(0, 2),
    notes: "Review the agent output before submitting.",
    actions: sampleActions,
    onAddDirective: fn(),
    onRemoveDirective: fn(),
    onNotesChange: fn(),
  },
};
