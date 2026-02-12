import type { Meta, StoryObj } from "@storybook/react";
import { RichMarkdownRenderer } from "../../components/migrations/rich-markdown-renderer";

const meta = {
  title: "Migrations/WebUI/Root/RichMarkdownRenderer",
  component: RichMarkdownRenderer,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof RichMarkdownRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: `# Welcome to Leviathan

## Overview

Leviathan is a **universal agent runtime** that enables *fractal composition* of AI workflows.

### Key Features

- Contract-first module development
- Fractal config resolution
- \`LevEvent\`-based inter-module communication

> The future belongs to those who build with agents.

#### Quick Start

\`\`\`bash
npm install -g @lev-os/cli
lev init my-project
lev run
\`\`\`

---

1. Install the CLI
2. Initialize a project
3. Start building

Check the [documentation](https://example.com) for more details.`,
  },
};

export const CodeHeavy: Story = {
  args: {
    content: `## API Reference

Use the \`createAgent\` function to initialize:

\`\`\`typescript
import { createAgent } from "@lev-os/core";

const agent = createAgent({
  name: "my-agent",
  model: "claude-opus-4-6",
  tools: ["search", "code"],
});

await agent.run("Build a REST API");
\`\`\`

### Parameters

- **name** - Agent identifier
- **model** - LLM model to use
- **tools** - Array of tool names`,
  },
};
