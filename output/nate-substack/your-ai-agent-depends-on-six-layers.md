---
title: "Your AI Agent Depends on Six Layers — Here's Which Ones Won't Last"
author: "Nate"
date: "2026-04-05T15:00:39.660Z"
source: "https://natesnewsletter.substack.com/p/your-ai-agent-depends-on-six-layers"
extracted: "2026-04-06T13:48:02.563Z"
videos: 1
---

## Your AI Agent Depends on Six Layers — Here's Which Ones Won't Last

The agent stack is real. Now let me show you what's in it.[](https://substack.com/@natesnewsletter)[Nate](https://substack.com/@natesnewsletter)Apr 06, 2026∙ Paid101ShareTranscriptA new infrastructure stack is forming underneath your AI agents. Almost nobody can tell which parts of it will last.

Over the last year, hundreds of millions in venture capital have poured into a category most people still can’t name. Tracxn counts more than a thousand active startups in the space. The money is real, and so is the confusion: ask ten people building agents what the stack actually looks like — which layers are load-bearing and which are stopgaps — and you’ll get ten different answers.

We’ve seen this before. Twice, actually. The cloud transition had a version of this moment, and so did the API-first shift a few years later. Both times, the builders who understood the emerging stack early didn’t just adapt faster. They built the companies that defined the next era. The ones who couldn’t read it built on the wrong layers and paid for it in migration costs, lock-in, and lost time.

The same pattern is running right now. A new set of primitives is taking shape — compute, identity, memory, tool access, billing, orchestration — designed for AI agents as the primary user, not humans. Some of these layers are load-bearing walls that will last a decade. Others are transitional workarounds that agents will outgrow within 18 months. And several critical layers, the ones that will define the next infrastructure-scale company, don’t exist yet at all.

Here’s what’s inside:

- The analogy that actually works. Why system calls, not Lego bricks, are the right mental model for what’s being built.
- Six layers, rated for durability. Compute, identity, memory, tool access, billing, and orchestration — each assessed for how long it lasts.
- The biggest gap in the stack. Why orchestration is the next infrastructure-defining opportunity and nobody’s cracked it yet.
- What this means if you build things. Reliability math, transitional lock-in, and the builder skills that actually matter.

I want to give you the same map I’ve been using to make sense of this space.

Subscribers get all posts like these!

Subscribed
## LINK: Grab the prompts

The article gives you the framework. It doesn’t tell you which layers you’re exposed on. That’s the work these prompts do. The Agent Stack Audit takes your actual tools and dependencies — whatever you’re building with, wherever you are in the process — and maps them against the six layers above. What comes back is a durability rating for each choice and a Shim Risk Report that names every transitional bet in your architecture, ranked by how painful the migration will be when native protocols arrive. The Reliability Calculator handles the compounding math: paste in your dependencies, confirm the uptime assumptions, and see what your end-to-end number actually looks like when five services multiply together. Both prompts work standalone, but if you run the audit first, you can feed its output straight into the calculator.


## The analogy that actually works

The pattern has played out twice in the last twenty years.

Between 2006 and 2015, computing’s infrastructure layer shifted from on-premise servers to cloud primitives: EC2 and S3 in 2006, Lambda in 2014. The builders who understood the new stack started companies that now run the world.

Between 2012 and 2016, monolithic applications gave way to composable APIs and microservices. “API-first” wasn’t a buzzword. It was an architectural decision that determined who won.

Now we’re watching the third shift: human-first tools to agent-first primitives. The new “customer” for infrastructure is an LLM with a tool-call interface, not a human with a browser. Every assumption about how software gets provisioned, authenticated, billed, and composed is being renegotiated.

It’s tempting to call these “Lego bricks for agents.” That’s the popular framing. It’s also wrong, or at least premature. Lego bricks snap together because they share a single, precisely engineered interface standard. Agent primitives don’t. Not yet. Interop is messy. MCP is emerging but far from universal. A2A protocols are even earlier.

What we actually have is closer to early Unix pipes: powerful composability if you know what you’re doing, fragile chaos if you don’t.

The better analogy is system calls. Agents need defined, reliable interfaces to identity, compute, memory, persistence, communication, and payments, the same way processes need system calls to interact with hardware. The companies building those interfaces are building the OS-level primitives of the agent economy.

This is what the stack looks like right now, layer by layer.


## Layer 1: Compute and sandboxing

Status: Production-ready. Load-bearing wall.

The agent needs somewhere safe to run code. Not on your laptop, not in production, and not unsupervised. Isolated, sandboxed, auditable execution.

This layer has the most mature competition. E2B, with roughly $32 million in total funding, uses Firecracker microVMs (the same technology behind AWS Lambda) to give each agent session its own dedicated kernel. Daytona raised a $24 million Series A in February and took a different architectural bet: Docker containers with a shared host kernel, built for speed (90ms cold starts) and persistent state. Modal targets GPU-heavy workloads. Browserbase, valued at $300 million after its Series B, focuses on headless browser automation, giving agents the ability to interact with web pages as if they were human users. Newer entrants like Sprites and Alibaba’s OpenSandbox are adding copy-on-write checkpoints and Kubernetes-native scheduling.

The interesting split is philosophical: ephemeral versus persistent. E2B treats sandboxes as disposable. Spin one up, run code, tear it down. Daytona and Sprites treat them as long-lived workspaces where an agent can install dependencies, create files, and come back later. This isn’t a style preference. It’s an architectural bet on how long agent sessions run and whether state matters between them. Both camps survive, because different workloads need different models.

Durability: High. Agents will always need isolated execution. The open question is whether this commoditizes into the cloud majors or remains a specialist category. My bet: specialist wins in the medium term, because the agent-specific requirements (sub-second startup, deterministic credential injection, session-level observability) are genuinely different from what general-purpose cloud functions are built for.

Compute is the layer where the hard problems are mostly engineering problems. The next layer is murkier.


## Layer 2: Identity and communication

Today, the pragmatic answer is: give the agent an email address.

Any agent on the open internet faces an identity problem — it has to send and receive messages, authenticate with services, and hold a verifiable identity that other systems can recognize. The solutions are transitional, important now but likely replaced later.

AgentMail raised a $6 million seed round from General Catalyst in March, with Paul Graham and HubSpot CTO Dharmesh Shah as angels. Their API lets you programmatically create email inboxes for agents, real addresses with full threading, attachments, labels, and search. Their onboarding API even lets agents sign themselves up.

The thesis is clever. AgentMail’s CEO frames email not as a communication tool but as an identity layer. Email is the universal key to the internet. Every SaaS service accepts it for signup. Every verification flow sends codes to it. Give an agent an email address and it can use essentially any existing software service without requiring that service to build agent-specific integrations.

But this is a shim. Email works because it’s everywhere, not because it’s the right protocol for agents. Threading is brittle. Rate limits designed to prevent spam throttle legitimate agent activity. The signal-to-noise ratio is terrible for autonomous systems that need deterministic, parseable communication.

The real need is a native agent identity and communication protocol, something that doesn’t require pretending to be human. Multiple teams are working on this: on-chain agent identity, dedicated A2A communication standards, MCP-based service discovery. Nothing has real traction yet.

Durability: Medium. The companies here will do well for two to three years while native protocols get sorted. Email is famously cockroach-like in its persistence, so it’s possible the shim becomes the standard. But if you’re building on email-as-identity today, you’re making a pragmatic bet, not a permanent architectural commitment.


## Layer 3: Memory and state

Memory is the difference between a stateless tool and an agent you can actually work with. Not just within a session but across sessions, tasks, and days. This layer is early but real, and the platform risk is significant.

Mem0 is the clear leader. They raised a combined $24 million across seed and Series A rounds, hit 41,000 GitHub stars and 14 million downloads, and were selected by AWS as the exclusive memory provider for its Agent SDK. Their API call volume grew fivefold in two quarters, from 35 million in Q1 to 186 million in Q3 of 2025.

What Mem0 gets right is the insight that memory isn’t “save the conversation.” It’s active curation. Their system stores important information, forgets outdated and conflicting details, and recalls relevant context at inference time. The architecture is a hybrid datastore (graph, vector, and key-value) that treats memory as managed infrastructure, not a feature bolted onto a model. On the LOCOMO benchmark, they outperform OpenAI’s built-in memory by 26% in accuracy, with 91% lower latency and 90% reduced token usage.

But every frontier lab is building memory into its own models. OpenAI already has long-term memory in ChatGPT. Anthropic is building memory into Claude. If memory becomes a model-level feature controlled by the labs, the way search got integrated into ChatGPT rather than remaining a separate tool, standalone memory companies get squeezed from above.

Mem0’s counter-thesis is portability: a “memory passport” where your AI memory travels with you across apps and models. Good vision. Whether users actually demand portable memory is unproven. The history of technology suggests lock-in usually wins.

Durability: Uncertain. If memory stays model-locked, this layer gets absorbed. If memory becomes portable and cross-application, functioning more like a database than a model feature, it’s a standalone category. Watch whether the big labs open their memory layers or wall them off.


## Layer 4: Tool access and integration

Status: Growing fast. Solves real, immediate pain.

Agents interact with existing SaaS tools (Slack, Jira, Salesforce, GitHub, Google Workspace, and hundreds of others) without requiring those tools to rebuild their interfaces.

Composio, with $29 million in total funding (Series A led by Lightspeed), provides a managed integration layer: authentication handling (including complex OAuth flows), pre-built connectors for over 250 applications, sandboxed execution, and observability for every tool call. They don’t build agents. They equip agents with the plumbing required to operate in enterprise environments.

The problem is the N×M integration nightmare. Without middleware, every agent builder independently manages credentials, auth flows, rate limits, error handling, and API schema changes for every tool their agent touches. That’s unsustainable at small scale. At enterprise scale, where an agent might need to touch CRM, ticketing, email, calendar, docs, and financial systems in a single workflow, it’s impossible.

Durability: High for the near term. As long as the SaaS ecosystem is fragmented (and it will be for a long time), agents need an integration layer. The long-term risk is standardization. If MCP becomes truly universal, the value of managed integration diminishes. But “truly universal” is years away.

Integration solves the breadth problem — connecting to everything. The next layer solves the trust problem.


## Layer 5: Provisioning and billing

At some point, the agent has to buy something.

This is where Stripe Projects fits. Launched in late March, it’s the first credible trust layer for agent-to-service transactions. The agent uses the same CLI commands a developer would. When it provisions a database or upgrades a hosting tier, Stripe tokenizes the payment credentials into a shared payment token and grants the provider a scoped credential for that specific transaction. The developer’s raw card details never leave Stripe’s vault.

Neon, one of the co-design partners, framed it well: since the start of 2026, agents have been able to take a project from git init to a running app autonomously. Except for the part where they need to create accounts and provision infrastructure. That’s the gap this closes. Their databases are ready in 350 milliseconds. Free to start. Scale to zero when inactive. Every design choice built for agent-speed provisioning, not human-speed dashboard clicking.

What’s still missing: agent-to-agent payments, metered billing that maps to agent compute patterns (most SaaS billing assumes human usage curves), dynamic budget allocation where agent A can spend up to $X without human approval, and financial observability across multi-agent workflows.

Durability: High for Stripe specifically. Payments is a trust problem, and Stripe already solved trust at scale. The new-entrant opportunity is in the metering, budgeting, and financial orchestration layer on top of the payment rail.


## Layer 6: Orchestration and coordination

This is the layer that matters most and exists least.

The agent needs to work with other agents reliably, at scale, with fallback handling, audit trails, and cost controls.

Everyone knows it’s missing. Gartner reported a 1,445% surge in multi-agent system inquiries between Q1 2024 and Q2 2025. Deloitte’s analysis predicts the autonomous agent market could be 15 to 30 percent larger if enterprises orchestrated agents better. A Celonis survey found that 76% of enterprises report sub-optimal processes that would hold back agentic AI, despite 85% wanting to become an agentic enterprise within three years.

The current tooling is framework-level, not infrastructure-level. LangChain, CrewAI, and AutoGen let you stand up multi-agent workflows. But the gap between “I can spin up three agents in a notebook” and “I can reliably run 50 agents across enterprise systems with failure recovery, cost controls, audit logging, and human escalation paths” is enormous.

The core tension is clear: individual agent capabilities are largely solved. What’s missing is the layer that makes those capabilities composable, parallel, and reliable. Merge conflicts don’t happen because agents are failing. They happen because agents are succeeding fast enough that coordination becomes the bottleneck.

I keep coming back to why nobody’s built this yet. The container world had this problem and Kubernetes showed up within a few years. We’re further along in the agent cycle than people think, and the orchestration gap is getting wider, not narrower.

What doesn’t exist yet and needs to:

A scheduling and lifecycle layer for agents. Not in the container sense, in the Kubernetes sense. Something that handles agent creation, assignment, health checking, scaling, and termination as a managed service.

Merge and coordination infrastructure for parallel agent work. When five agents work on related tasks simultaneously, you need merge queues, conflict detection, and resolution protocols. Today this is duct tape and git worktrees.

Supervision hierarchies. Meta-agents that monitor, evaluate, and course-correct other agents. Not as a framework pattern you code yourself, but as infrastructure you configure.

Financial observability across agent workflows. What did this agent spend? What was the outcome quality? What’s the cost per successful task? This is FinOps for agents, and it barely exists.

Standard failure modes and recovery patterns. When an agent’s tool call fails, what happens? Today: it depends on the framework, the tool, and your error handling. There’s no equivalent of HTTP status codes or circuit breakers for agent-to-tool interactions.

This is the layer where the next infrastructure-defining company gets built. The orchestration problem for agents is structurally analogous to the container orchestration problem Kubernetes solved: not the compute itself, but the scheduling, scaling, health checking, and lifecycle management that makes compute usable at enterprise scale.

Whoever solves orchestration at infrastructure grade (reliable, auditable, cost-aware, and framework-agnostic) will own the most valuable position in the agent stack.

It’s too early to call a winner. It’s not too early to start building.


## What this means if you build things

A solo founder can now stand up an agent with its own email identity, persistent memory, sandboxed compute, tool access across 250+ SaaS apps, and automated billing, in an afternoon. That capability was impossible two years ago.

But the advantage comes with new physics.

Reliability compounds in the wrong direction. When your agent depends on five primitives, your end-to-end reliability is the product of five reliabilities. If each delivers 99% uptime, your system delivers 95%. At 97% each, you’re at 86%. This is the microservices fragility problem all over again, except worse. Agents are non-deterministic, so failures are harder to diagnose.

Transitional lock-in is real. Building on shims like email-as-identity creates migration costs when native protocols arrive. Every shim you adopt is a bet that it either becomes the standard or that you’ll have time to swap it out.

Agent sprawl is coming. The same problem that plagued microservices around 2018, but harder, because agents don’t just produce unexpected outputs, they take unexpected actions. Without orchestration-layer observability, you don’t know what your agents did, let alone whether they did it well.

The new builder skills are straightforward: context engineering over prompt engineering, because what you feed the agent matters more than how you word the request. Eval-driven development, because success rate and cost per task replace unit tests as the core feedback loop. And stack literacy, knowing which layer is your competitive advantage, which layers you rent, and which are about to commoditize underneath you.


## The map, not the territory

The term “agentic primitives” probably won’t stick. It’s too jargon-heavy. But the thing it describes, a new infrastructure stack forming underneath the model layer, is the most important development in software architecture since the cloud.

The builders who thrive won’t be the ones with the best model or the cleverest prompt. They’ll be the ones who can read the stack. Who know which layers to build on, which to build, and which to watch from a safe distance while someone else takes the risk.

The orchestration layer is wide open. The trust layer just got its first real entrant. The identity layer is held together with email and optimism.

That’s the map. What you build on it is up to you.

I make this Substack thanks to readers like you! Learn about all my Substack tiers here and grab my prompt tool here

Subscribed![](https://substackcdn.com/image/fetch/$s_!L3O4!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb56d7f18-dfad-40cb-9ba7-9af8d382581a_1024x1024.png)



[](https://substack.com/profile/30833020-dirk-nicol)[](https://substack.com/profile/54347610-anne)[](https://substack.com/profile/439582604-mladen)[](https://substack.com/profile/473701090-fablondon)[](https://substack.com/profile/23261247-theodoros-g-karounos)[10 Likes]()∙[1 Restack](https://substack.com/note/p-193099928/restacks?utm_source=substack&utm_content=facepile-restacks)
#### Discussion about this video

CommentsRestacks[](https://natesnewsletter.substack.com)Nate's NotebookWelcome to my podcast! In these audio reviews of my newsletters, I am to break down complex AI topics in a way that's approachable and relatable. I want you to walk away with the confidence to leverage AI more effectively at home and at work!Welcome to my podcast! In these audio reviews of my newsletters, I am to break down complex AI topics in a way that's approachable and relatable. I want you to walk away with the confidence to leverage AI more effectively at home and at work!Listen onSubstack AppApple PodcastsRSS FeedEmail mobile setup linkAppears in episode[](https://substack.com/@natesnewsletter?utm_source=author-byline-face-podcast)[Nate](https://substack.com/@natesnewsletter)Recent Episodes[Executive Briefing: OpenClaw Deployments Are Spreading Through Your Org — Here's What Nobody Audited](https://natesnewsletter.substack.com/p/executive-briefing-your-agent-produces)23 hrs ago • [Nate](https://substack.com/@natesnewsletter)[I Tested Cowork, Lindy, Sauna, and Opal Against 3 Questions. The Best Scored 1 out of 4.](https://natesnewsletter.substack.com/p/every-ai-agent-you-use-has-the-same)Apr 4 • [Nate](https://substack.com/@natesnewsletter)[Your Agent Is 80% Plumbing. Here Are the 12 Pieces You're Missing.](https://natesnewsletter.substack.com/p/your-agent-has-12-blind-spots-you)Apr 3 • [Nate](https://substack.com/@natesnewsletter)[You're Loading 66,000 Tokens of Plugins Before You Even Type. That's Why Your Limit Disappears.](https://natesnewsletter.substack.com/p/your-claude-sessions-cost-10x-what)Apr 2 • [Nate](https://substack.com/@natesnewsletter)[Every workaround you built for the last model is now breaking the next one. The 4-question audit + prompts to fix it.](https://natesnewsletter.substack.com/p/anthropic-just-built-a-model-that)Apr 1 • [Nate](https://substack.com/@natesnewsletter)[The Company Everyone Says Lost the AI Race Is Building the Layer Every AI Winner Has to Use.](https://natesnewsletter.substack.com/p/the-company-everyone-says-lost-the)Mar 31 • [Nate](https://substack.com/@natesnewsletter)[Your Best AI Work Vanishes Every Session. 4 Prompts That Make It Permanent plus Access to My Skills Repo](https://natesnewsletter.substack.com/p/your-ai-skills-fail-10-of-the-time)Mar 30 • [Nate](https://substack.com/@natesnewsletter)