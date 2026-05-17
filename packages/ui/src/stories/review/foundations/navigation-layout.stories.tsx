import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { ReviewPageLayout } from "../_shared/ReviewPageLayout";
import { ComponentCard } from "../_shared/ComponentCard";
import type { ComponentMeta } from "../_shared/types";
import { Breadcrumbs } from "../../../components/catalog/breadcrumbs";
import { TabsContainer } from "../../../components/catalog/tabs-container";
import { Stepper } from "../../../components/catalog/stepper";
import { AccordionList } from "../../../components/catalog/accordion-list";
import { SplitView } from "../../../components/catalog/split-view";
import { Pagination } from "../../../components/catalog/pagination";
import { TreeBrowser } from "../../../components/catalog/tree-browser";
import { MiniMap } from "../../../components/catalog/mini-map";
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from "../../../components/catalog/tabs";

const meta: Meta = {
  title: "Review/Foundations/Navigation & Layout",
};
export default meta;

function m(
  id: string,
  name: string,
  gateStatus: ComponentMeta["gateStatus"] = "pass",
  classification: ComponentMeta["classification"] = "REAL",
): ComponentMeta {
  return {
    id,
    name,
    family: "foundations/navigation-layout",
    domain: "webui",
    lanes: ["agentping"],
    beadId: "",
    storyPath: "Review/Foundations/Navigation & Layout",
    gateStatus,
    classification,
    markers: [],
  };
}

export const Overview: StoryObj = {
  render: () => (
    <ReviewPageLayout
      title="Navigation & Layout"
      category="Foundations"
      description="Breadcrumbs, tabs, steppers, accordions, split views, panels, pagination, and tree navigation"
      componentCount={10}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Breadcrumbs */}
        <ComponentCard meta={m("breadcrumbs", "Breadcrumbs")}>
          <Breadcrumbs
            path={["Home", "Projects", "Agent Config", "Memory"]}
            onNavigate={() => {}}
          />
        </ComponentCard>

        {/* TabsContainer */}
        <ComponentCard meta={m("tabs-container", "TabsContainer")}>
          <TabsContainer
            tabs={[
              {
                id: "overview",
                label: "Overview",
                content: (
                  <span className="text-xs text-cyan-300">
                    Agent cluster status: 12 active nodes
                  </span>
                ),
              },
              {
                id: "config",
                label: "Config",
                content: (
                  <span className="text-xs text-cyan-300">
                    model: gpt-4o | temp: 0.7
                  </span>
                ),
              },
              {
                id: "logs",
                label: "Logs",
                content: (
                  <span className="text-xs text-cyan-300">
                    [14:23:01] Task completed successfully
                  </span>
                ),
              },
            ]}
            activeTab="overview"
          />
        </ComponentCard>

        {/* Stepper */}
        <ComponentCard meta={m("stepper", "Stepper")}>
          <Stepper
            steps={["Setup", "Configure", "Deploy", "Verify"]}
            currentStep={2}
          />
        </ComponentCard>

        {/* AccordionList */}
        <ComponentCard meta={m("accordion-list", "AccordionList")}>
          <AccordionList
            items={[
              {
                id: "general",
                title: "General Settings",
                content: (
                  <span className="text-xs text-cyan-300">
                    Agent name, description, and runtime parameters
                  </span>
                ),
              },
              {
                id: "advanced",
                title: "Advanced Configuration",
                content: (
                  <span className="text-xs text-cyan-300">
                    Memory limits, concurrency, retry policies
                  </span>
                ),
              },
              {
                id: "security",
                title: "Security & Permissions",
                content: (
                  <span className="text-xs text-cyan-300">
                    API keys, access control, audit logging
                  </span>
                ),
              },
            ]}
          />
        </ComponentCard>

        {/* SplitView */}
        <ComponentCard meta={m("split-view", "SplitView")}>
          <SplitView
            ratio={40}
            left={
              <div className="text-xs text-cyan-400 p-2">
                <div className="font-bold mb-1">Navigator</div>
                <div className="text-cyan-500/50">agents/</div>
                <div className="text-cyan-500/50 pl-2">worker-01.yaml</div>
                <div className="text-cyan-500/50 pl-2">worker-02.yaml</div>
              </div>
            }
            right={
              <div className="text-xs text-cyan-400 p-2">
                <div className="font-bold mb-1">Editor</div>
                <pre className="text-cyan-500/50">
                  {"name: worker-01\nmodel: gpt-4o\nmax_tokens: 4096"}
                </pre>
              </div>
            }
          />
        </ComponentCard>

        {/* SidePanel (inline preview -- renders as fixed overlay) */}
        <ComponentCard meta={m("side-panel", "SidePanel")}>
          <div className="relative h-48 border border-cyan-500/10 rounded overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-48 bg-black/90 border-l border-cyan-500/20 flex flex-col">
              <div className="flex items-center justify-between px-3 py-2 border-b border-cyan-500/10">
                <span className="text-xs text-cyan-100">Agent Details</span>
                <span className="text-cyan-500/50 text-sm">&times;</span>
              </div>
              <div className="p-3 text-xs text-cyan-500/50 space-y-1">
                <div>Status: Active</div>
                <div>Uptime: 4h 23m</div>
                <div>Tasks: 142</div>
              </div>
            </div>
            <div className="p-3 text-xs text-cyan-500/30">
              Main content area
            </div>
          </div>
          <p className="text-[10px] text-cyan-500/30 mt-1">
            SidePanel renders as fixed overlay; shown here as inline preview
          </p>
        </ComponentCard>

        {/* Pagination */}
        <ComponentCard meta={m("pagination", "Pagination")}>
          <Pagination currentPage={3} totalPages={10} onPageChange={() => {}} />
        </ComponentCard>

        {/* TreeBrowser */}
        <ComponentCard meta={m("tree-browser", "TreeBrowser")}>
          <TreeBrowser
            nodes={[
              {
                id: "src",
                label: "src",
                type: "folder",
                children: [
                  {
                    id: "components",
                    label: "components",
                    type: "folder",
                    children: [
                      { id: "button", label: "Button.tsx", type: "file" },
                      { id: "modal", label: "Modal.tsx", type: "file" },
                    ],
                  },
                  { id: "index", label: "index.ts", type: "file" },
                ],
              },
              {
                id: "config",
                label: "config",
                type: "folder",
                children: [
                  { id: "tsconfig", label: "tsconfig.json", type: "file" },
                ],
              },
            ]}
          />
        </ComponentCard>

        {/* MiniMap */}
        <ComponentCard meta={m("mini-map", "MiniMap")}>
          <MiniMap
            viewportWidth={800}
            viewportHeight={600}
            contentWidth={2400}
            contentHeight={1800}
            scrollX={400}
            scrollY={200}
          />
        </ComponentCard>

        {/* Tabs (compound) */}
        <ComponentCard meta={m("tabs", "Tabs (Compound)")}>
          <Tabs defaultTab="metrics">
            <TabList>
              <Tab id="metrics">Metrics</Tab>
              <Tab id="events">Events</Tab>
              <Tab id="alerts">Alerts</Tab>
              <Tab id="disabled" disabled>
                Archived
              </Tab>
            </TabList>
            <TabPanel id="metrics">
              <div className="text-xs text-cyan-300">
                CPU: 42% | Memory: 1.2GB / 4GB | Latency: 23ms
              </div>
            </TabPanel>
            <TabPanel id="events">
              <div className="text-xs text-cyan-300">
                [12:01] Agent deployed | [12:05] Health check OK
              </div>
            </TabPanel>
            <TabPanel id="alerts">
              <div className="text-xs text-amber-400">
                1 warning: Memory usage above 80%
              </div>
            </TabPanel>
          </Tabs>
        </ComponentCard>
      </div>
    </ReviewPageLayout>
  ),
};
