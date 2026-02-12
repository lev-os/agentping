import{R as n}from"./rich-markdown-renderer-Di2tJGsv.js";import"./iframe-CzJrb7DT.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CDN07tui.js";const s={title:"Migrations/WebUI/Root/RichMarkdownRenderer",component:n,parameters:{layout:"centered"},tags:["autodocs"]},e={args:{content:`# Welcome to Leviathan

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

Check the [documentation](https://example.com) for more details.`}},t={args:{content:`## API Reference

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
- **tools** - Array of tool names`}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    content: \`# Welcome to Leviathan

## Overview

Leviathan is a **universal agent runtime** that enables *fractal composition* of AI workflows.

### Key Features

- Contract-first module development
- Fractal config resolution
- \\\`LevEvent\\\`-based inter-module communication

> The future belongs to those who build with agents.

#### Quick Start

\\\`\\\`\\\`bash
npm install -g @lev-os/cli
lev init my-project
lev run
\\\`\\\`\\\`

---

1. Install the CLI
2. Initialize a project
3. Start building

Check the [documentation](https://example.com) for more details.\`
  }
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    content: \`## API Reference

Use the \\\`createAgent\\\` function to initialize:

\\\`\\\`\\\`typescript
import { createAgent } from "@lev-os/core";

const agent = createAgent({
  name: "my-agent",
  model: "claude-opus-4-6",
  tools: ["search", "code"],
});

await agent.run("Build a REST API");
\\\`\\\`\\\`

### Parameters

- **name** - Agent identifier
- **model** - LLM model to use
- **tools** - Array of tool names\`
  }
}`,...t.parameters?.docs?.source}}};const c=["Default","CodeHeavy"];export{t as CodeHeavy,e as Default,c as __namedExportsOrder,s as default};
