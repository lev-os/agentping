import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ReviewPageLayout } from "../_shared/ReviewPageLayout";
import { ComponentCard } from "../_shared/ComponentCard";
import { ComparePanel } from "../_shared/ComparePanel";
import type { ComponentMeta } from "../_shared/types";

import {
  InputStudioRaw,
  InputWebUiRaw,
  InputCandidate,
} from "../../../components/migrations/input-conflict";
import {
  SearchInputStudioRaw,
  SearchInputWebUiRaw,
  SearchInputCandidate,
} from "../../../components/migrations/search-input-conflict";
import { TextArea } from "../../../components/migrations/text-area";
import { MultiSelect } from "../../../components/migrations/multi-select";
import { DatePicker } from "../../../components/migrations/date-picker";
import { DatePickerPro } from "../../../components/migrations/date-picker-pro";
import { ColorPicker } from "../../../components/migrations/color-picker";
import { PinInput } from "../../../components/migrations/pin-input";
import { RangeSlider } from "../../../components/migrations/range-slider";
import { Slider } from "../../../components/migrations/slider";
import { Knob } from "../../../components/migrations/knob";
import { TagInput } from "../../../components/migrations/tag-input";
import { SecretInput } from "../../../components/migrations/secret-input";
import { EditableText } from "../../../components/migrations/editable-text";
import { SelectionList } from "../../../components/migrations/selection-list";
import { FilteredDropdown } from "../../../components/migrations/filtered-dropdown";

const meta: Meta = {
  title: "Review/Foundations/Inputs & Selectors",
};
export default meta;

function m(
  id: string,
  name: string,
  gateStatus: ComponentMeta["gateStatus"] = "pass",
  classification: ComponentMeta["classification"] = "REAL",
  domain: ComponentMeta["domain"] = "webui",
): ComponentMeta {
  return {
    id,
    name,
    family: "foundations/inputs-selectors",
    domain,
    lanes: ["agentping"],
    beadId: "",
    storyPath: "Review/Foundations/Inputs & Selectors",
    gateStatus,
    classification,
    markers: [],
  };
}

export const Overview: StoryObj = {
  render: () => (
    <ReviewPageLayout
      title="Inputs & Selectors"
      category="Foundations"
      description="Text inputs, search, date pickers, color pickers, sliders, knobs, tags, secrets, and selection controls"
      componentCount={16}
    >
      {/* Conflict: Input */}
      <div className="mb-6">
        <ComparePanel
          title="Input (Conflict Family)"
          lanes={[
            {
              id: "input-webui",
              label: "AgentPing (WebUI)",
              variant: "agentping",
              content: (
                <div className="space-y-3">
                  <InputWebUiRaw label="Email" placeholder="agent@kingly.ai" status="default" />
                  <InputWebUiRaw label="Error state" placeholder="invalid" status="error" hint="Invalid email address" />
                </div>
              ),
            },
            {
              id: "input-studio",
              label: "Studio",
              variant: "sophia",
              content: (
                <div className="space-y-3">
                  <InputStudioRaw label="Email" placeholder="agent@kingly.ai" status="default" />
                  <InputStudioRaw label="Error state" placeholder="invalid" status="error" hint="Invalid email address" />
                </div>
              ),
            },
            {
              id: "input-candidate",
              label: "Candidate",
              variant: "combined",
              content: (
                <div className="space-y-3">
                  <InputCandidate label="Email" placeholder="agent@kingly.ai" status="default" />
                  <InputCandidate label="Error state" placeholder="invalid" status="error" hint="Invalid email address" />
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Conflict: SearchInput */}
      <div className="mb-6">
        <ComparePanel
          title="SearchInput (Conflict Family)"
          lanes={[
            {
              id: "search-webui",
              label: "AgentPing (WebUI)",
              variant: "agentping",
              content: <SearchInputWebUiRaw placeholder="Search agents..." />,
            },
            {
              id: "search-studio",
              label: "Studio",
              variant: "sophia",
              content: <SearchInputStudioRaw placeholder="Search logs..." />,
            },
            {
              id: "search-candidate",
              label: "Candidate",
              variant: "combined",
              content: <SearchInputCandidate placeholder="Search everything..." />,
            },
          ]}
        />
      </div>

      {/* Regular Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ComponentCard meta={m("text-area", "TextArea")}>
          <TextArea
            label="System Prompt"
            value="You are a helpful agent coordinator managing distributed workflows."
            placeholder="Enter prompt..."
            rows={3}
            maxLength={500}
          />
        </ComponentCard>

        <ComponentCard meta={m("multi-select", "MultiSelect")}>
          <MultiSelect
            options={[
              { value: "react", label: "React" },
              { value: "vue", label: "Vue" },
              { value: "svelte", label: "Svelte" },
              { value: "angular", label: "Angular" },
              { value: "solid", label: "Solid" },
            ]}
            selected={["react", "svelte"]}
            placeholder="Select frameworks..."
          />
        </ComponentCard>

        <ComponentCard meta={m("date-picker", "DatePicker")}>
          <DatePicker label="Deploy Date" value="2026-02-14" />
        </ComponentCard>

        <ComponentCard meta={m("date-picker-pro", "DatePickerPro", "needs-review")}>
          <DatePickerPro
            label="Schedule (with time)"
            value="2026-02-14T09:30"
            showTime={true}
            minDate="2026-01-01"
            maxDate="2026-12-31"
          />
        </ComponentCard>

        <ComponentCard meta={m("color-picker", "ColorPicker")}>
          <ColorPicker value="#00ffff" label="Accent Color" />
        </ComponentCard>

        <ComponentCard meta={m("pin-input", "PinInput")}>
          <PinInput length={6} value="1234" label="Verification Code" />
        </ComponentCard>

        <ComponentCard meta={m("range-slider", "RangeSlider")}>
          <RangeSlider min={0} max={100} value={72} label="Temperature" />
        </ComponentCard>

        <ComponentCard meta={m("slider", "Slider")}>
          <Slider min={0} max={100} value={65} step={5} label="Confidence Threshold" />
        </ComponentCard>

        <ComponentCard meta={m("knob", "Knob")}>
          <div className="flex gap-4 items-center">
            <Knob value={75} min={0} max={100} label="Volume" unit="%" size={56} />
            <Knob value={42} min={0} max={255} label="Gain" size={56} />
            <Knob value={180} min={0} max={360} label="Rotation" unit="\u00B0" size={56} />
          </div>
        </ComponentCard>

        <ComponentCard meta={m("tag-input", "TagInput")}>
          <TagInput
            tags={["agent", "workflow", "llm", "mcp"]}
            placeholder="Add label..."
            maxTags={10}
          />
        </ComponentCard>

        <ComponentCard meta={m("secret-input", "SecretInput")}>
          <SecretInput
            label="API Key"
            value="sk-proj-abcdefghijklmnop"
            placeholder="Enter API key..."
          />
        </ComponentCard>

        <ComponentCard meta={m("editable-text", "EditableText")}>
          <div className="space-y-2">
            <EditableText value="Project Alpha" label="Project Name" />
            <EditableText
              value="A multi-agent orchestration system for distributed AI workflows."
              label="Description"
              multiline
            />
          </div>
        </ComponentCard>

        <ComponentCard meta={m("selection-list", "SelectionList")}>
          <SelectionList
            items={[
              { id: "1", label: "GPU Worker A", selected: true },
              { id: "2", label: "GPU Worker B", selected: true },
              { id: "3", label: "CPU Worker C", selected: false },
              { id: "4", label: "Edge Node D", selected: false },
            ]}
          />
        </ComponentCard>

        <ComponentCard meta={m("filtered-dropdown", "FilteredDropdown", "pass", "RE-EXPORT")}>
          <FilteredDropdown
            variant="dropdown"
            tabs={[
              { id: "agents", label: "Agents" },
              { id: "tools", label: "Tools" },
            ]}
            activeTab="agents"
            onTabChange={() => {}}
            searchValue=""
            onSearchChange={() => {}}
            triggerLabel="Select agent..."
            onOpenChange={() => {}}
          >
            <div className="p-2 text-xs text-cyan-500/60">Agent list items</div>
          </FilteredDropdown>
        </ComponentCard>
      </div>
    </ReviewPageLayout>
  ),
};
