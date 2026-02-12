import{j as e,r as A}from"./iframe-CzJrb7DT.js";import{T as a}from"./textarea-DSOyAXy_.js";import{L as r}from"./label-D8f8WTW2.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CDN07tui.js";import"./index-CJ_imsi-.js";import"./index-WHAuAub8.js";import"./index-Dwoj57sw.js";import"./index-DiN5Zsj0.js";import"./index-Czr-OA3y.js";import"./index-B_jtOnfb.js";const Y={title:"Components/Textarea",component:a,parameters:{layout:"centered",docs:{description:{component:"A multi-line text input component with SKYNET cyberpunk styling. Features sharp edges, focused ring states, and supports error states for validation."}}},tags:["autodocs"],argTypes:{placeholder:{control:"text",description:"Placeholder text displayed when empty"},disabled:{control:"boolean",description:"Whether the textarea is disabled"},error:{control:"boolean",description:"Whether to show error styling"},rows:{control:{type:"number",min:1,max:20},description:"Number of visible text lines"}}},c={args:{placeholder:"Enter text..."},decorators:[s=>e.jsx("div",{className:"w-[400px]",children:e.jsx(s,{})})]},i={args:{placeholder:"Enter mission notes here..."},decorators:[s=>e.jsx("div",{className:"w-[400px]",children:e.jsx(s,{})})]},m={args:{defaultValue:"Training session completed successfully. Model achieved 95% accuracy on level 12 maneuvers."},decorators:[s=>e.jsx("div",{className:"w-[400px]",children:e.jsx(s,{})})]},x={args:{placeholder:"Brief note...",rows:2,className:"min-h-0"},decorators:[s=>e.jsx("div",{className:"w-[400px]",children:e.jsx(s,{})})]},p={args:{placeholder:"Standard input area...",rows:4},decorators:[s=>e.jsx("div",{className:"w-[400px]",children:e.jsx(s,{})})]},u={args:{placeholder:"Extended text area for detailed reports...",rows:8,className:"min-h-[200px]"},decorators:[s=>e.jsx("div",{className:"w-[400px]",children:e.jsx(s,{})})]},h={args:{placeholder:"This field is disabled",disabled:!0},decorators:[s=>e.jsx("div",{className:"w-[400px]",children:e.jsx(s,{})})]},N={args:{defaultValue:"System-generated log entry. Read-only content.",disabled:!0},decorators:[s=>e.jsx("div",{className:"w-[400px]",children:e.jsx(s,{})})]},f={args:{placeholder:"Enter required information...",error:!0},decorators:[s=>e.jsx("div",{className:"w-[400px]",children:e.jsx(s,{})})]},g={args:{defaultValue:"Invalid input data",error:!0},decorators:[s=>e.jsx("div",{className:"w-[400px]",children:e.jsx(s,{})})]},v={render:()=>e.jsxs("div",{className:"w-[400px] space-y-2",children:[e.jsx(r,{htmlFor:"notes",className:"font-mono text-xs text-muted-foreground",children:"MISSION NOTES"}),e.jsx(a,{id:"notes",placeholder:"Enter mission notes..."})]})},y={render:()=>e.jsxs("div",{className:"w-[400px] space-y-2",children:[e.jsx(r,{htmlFor:"briefing",className:"font-mono text-xs text-muted-foreground",children:"PRE-FLIGHT BRIEFING"}),e.jsx(a,{id:"briefing",placeholder:"Enter briefing details...",rows:5,className:"min-h-[120px]"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Include weather conditions, route, and special considerations."})]})},O=()=>{const[s,n]=A.useState(""),t=500,d=t-s.length,o=d<=50,l=d<0;return e.jsxs("div",{className:"w-[400px] space-y-2",children:[e.jsx(r,{htmlFor:"limited",className:"font-mono text-xs text-muted-foreground",children:"FLIGHT REPORT"}),e.jsx(a,{id:"limited",placeholder:"Enter flight report details...",value:s,onChange:R=>n(R.target.value),error:l,rows:5,className:"min-h-[120px]"}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"Maximum 500 characters"}),e.jsxs("span",{className:`text-xs font-mono ${l?"text-destructive":o?"text-yellow-500":"text-muted-foreground"}`,children:[s.length,"/",t]})]})]})},b={render:()=>e.jsx(O,{})},S={render:()=>e.jsxs("div",{className:"w-[450px] space-y-4 p-4 border border-border bg-card/50",children:[e.jsx("h3",{className:"font-display text-sm text-primary",children:"FLIGHT NOTES"}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"font-mono text-xs text-muted-foreground",children:"PILOT OBSERVATIONS"}),e.jsx(a,{placeholder:"Enter observations during flight...",defaultValue:"Smooth takeoff at 0800 local. Encountered light turbulence at FL350. Autopilot performed well during cruise phase.",rows:3})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"font-mono text-xs text-muted-foreground",children:"SYSTEM ANOMALIES"}),e.jsx(a,{placeholder:"Report any system anomalies...",rows:2,className:"min-h-0"})]})]})]}),parameters:{layout:"padded"}},T={render:()=>e.jsxs("div",{className:"w-[500px] space-y-4 p-4 border border-border bg-card/50",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h3",{className:"font-display text-sm text-destructive",children:"INCIDENT REPORT"}),e.jsx("span",{className:"text-xs font-mono text-muted-foreground",children:"FORM IR-2024"})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"font-mono text-xs text-muted-foreground",children:"INCIDENT DESCRIPTION"}),e.jsx(a,{placeholder:"Describe the incident in detail...",rows:4,className:"min-h-[100px]"})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"font-mono text-xs text-muted-foreground",children:"IMMEDIATE ACTIONS TAKEN"}),e.jsx(a,{placeholder:"Actions taken...",rows:3,className:"min-h-0"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"font-mono text-xs text-muted-foreground",children:"CONTRIBUTING FACTORS"}),e.jsx(a,{placeholder:"Contributing factors...",rows:3,className:"min-h-0"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"font-mono text-xs text-muted-foreground",children:"RECOMMENDATIONS"}),e.jsx(a,{placeholder:"Enter recommendations for prevention...",rows:3})]})]})]}),parameters:{layout:"padded"}},j={render:()=>e.jsxs("div",{className:"w-[500px] space-y-4 p-4 border border-border bg-card/50",children:[e.jsx("h3",{className:"font-display text-sm text-primary",children:"PRE-FLIGHT BRIEFING"}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"font-mono text-xs text-muted-foreground",children:"WEATHER CONDITIONS"}),e.jsx(a,{defaultValue:"METAR KJFK 121756Z 31015G22KT 10SM FEW040 SCT250 22/12 A3012",rows:3,className:"min-h-0 font-mono text-xs"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"font-mono text-xs text-muted-foreground",children:"NOTAMS"}),e.jsx(a,{defaultValue:"RWY 04L/22R CLSD FOR MAINT. TWY B BTN TWY A AND TWY C CLSD.",rows:3,className:"min-h-0 font-mono text-xs"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"font-mono text-xs text-muted-foreground",children:"ROUTE NOTES"}),e.jsx(a,{placeholder:"Enter route-specific notes...",defaultValue:"Direct MERIT, V229 ALB, V2 BOSTN. Expect FL350. Monitor 125.77 for traffic advisories in Boston area.",rows:2,className:"min-h-0"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"font-mono text-xs text-muted-foreground",children:"SPECIAL CONSIDERATIONS"}),e.jsx(a,{placeholder:"Any special considerations...",rows:2,className:"min-h-0"})]})]}),parameters:{layout:"padded"}},E={render:()=>{const[s,n]=A.useState(`[14:23:45] Session started - Level 12: Crosswind Landing
[14:24:12] Wind conditions: 15kt gusting 22kt, 30° crosswind
[14:25:33] Approach initiated - IAS 85kt, flaps 20°
[14:26:01] Crab angle established: 12° into wind
[14:26:45] Short final - transition to wing-low
[14:27:02] Touchdown - Success! Score: 92/100
[14:27:15] Session completed`);return e.jsxs("div",{className:"w-[500px] space-y-4 p-4 border border-border bg-card/50",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h3",{className:"font-display text-sm text-primary",children:"TRAINING LOG"}),e.jsx("span",{className:"text-xs font-mono text-green-400",children:"LIVE"})]}),e.jsx(a,{value:s,onChange:t=>n(t.target.value),rows:10,className:"min-h-[250px] font-mono text-xs bg-black/50"}),e.jsxs("div",{className:"flex justify-between text-xs font-mono text-muted-foreground",children:[e.jsx("span",{children:"Session: 00:03:30"}),e.jsxs("span",{children:["Lines: ",s.split(`
`).length]})]})]})},parameters:{layout:"padded"}},w={render:()=>e.jsxs("div",{className:"w-[500px] space-y-4 p-4 border border-border bg-card/50",children:[e.jsx("h3",{className:"font-display text-sm text-primary",children:"SYSTEM CONFIGURATION"}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"font-mono text-xs text-muted-foreground",children:"CONFIG YAML"}),e.jsx(a,{defaultValue:`training:
  learning_rate: 3e-4
  batch_size: 64
  n_envs: 8
  features:
    - behavioral_cloning
    - hindsight_experience
    - curiosity
  curriculum:
    start_level: 1
    max_level: 35`,rows:12,className:"min-h-[280px] font-mono text-xs"})]})]}),parameters:{layout:"padded"}},L={render:()=>{const[s,n]=A.useState(""),[t,d]=A.useState(!1),o=t&&s.length<10;return e.jsxs("div",{className:"w-[400px] space-y-2",children:[e.jsx(r,{htmlFor:"validation",className:`font-mono text-xs ${o?"text-destructive":"text-muted-foreground"}`,children:"DESCRIPTION (Required)"}),e.jsx(a,{id:"validation",placeholder:"Enter at least 10 characters...",value:s,onChange:l=>n(l.target.value),onBlur:()=>d(!0),error:o}),o&&e.jsx("p",{className:"text-xs text-destructive",children:"Description must be at least 10 characters"})]})}},I={render:()=>e.jsxs("div",{className:"w-[600px] space-y-8",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"font-display text-lg text-foreground mb-4",children:"TEXTAREA STATES"}),e.jsxs("div",{className:"grid grid-cols-2 gap-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"font-mono text-xs text-muted-foreground",children:"DEFAULT"}),e.jsx(a,{placeholder:"Default textarea..."})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"font-mono text-xs text-muted-foreground",children:"WITH VALUE"}),e.jsx(a,{defaultValue:"Pre-filled content here"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"font-mono text-xs text-muted-foreground",children:"DISABLED"}),e.jsx(a,{placeholder:"Disabled textarea",disabled:!0})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"font-mono text-xs text-muted-foreground",children:"DISABLED WITH VALUE"}),e.jsx(a,{defaultValue:"Read-only content",disabled:!0})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"font-mono text-xs text-destructive",children:"ERROR STATE"}),e.jsx(a,{placeholder:"Error state...",error:!0})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"font-mono text-xs text-destructive",children:"ERROR WITH VALUE"}),e.jsx(a,{defaultValue:"Invalid data entered",error:!0})]})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-display text-lg text-foreground mb-4",children:"SIZE VARIANTS"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"font-mono text-xs text-muted-foreground",children:"COMPACT (2 rows)"}),e.jsx(a,{placeholder:"Compact input...",rows:2,className:"min-h-0"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"font-mono text-xs text-muted-foreground",children:"STANDARD (4 rows)"}),e.jsx(a,{placeholder:"Standard input...",rows:4})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{className:"font-mono text-xs text-muted-foreground",children:"EXPANDED (8 rows)"}),e.jsx(a,{placeholder:"Expanded input...",rows:8,className:"min-h-[200px]"})]})]})]})]}),parameters:{layout:"padded"}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Enter text..."
  },
  decorators: [Story => <div className="w-[400px]">
        <Story />
      </div>]
}`,...c.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Enter mission notes here..."
  },
  decorators: [Story => <div className="w-[400px]">
        <Story />
      </div>]
}`,...i.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: "Training session completed successfully. Model achieved 95% accuracy on level 12 maneuvers."
  },
  decorators: [Story => <div className="w-[400px]">
        <Story />
      </div>]
}`,...m.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Brief note...",
    rows: 2,
    className: "min-h-0"
  },
  decorators: [Story => <div className="w-[400px]">
        <Story />
      </div>]
}`,...x.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Standard input area...",
    rows: 4
  },
  decorators: [Story => <div className="w-[400px]">
        <Story />
      </div>]
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Extended text area for detailed reports...",
    rows: 8,
    className: "min-h-[200px]"
  },
  decorators: [Story => <div className="w-[400px]">
        <Story />
      </div>]
}`,...u.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "This field is disabled",
    disabled: true
  },
  decorators: [Story => <div className="w-[400px]">
        <Story />
      </div>]
}`,...h.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: "System-generated log entry. Read-only content.",
    disabled: true
  },
  decorators: [Story => <div className="w-[400px]">
        <Story />
      </div>]
}`,...N.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Enter required information...",
    error: true
  },
  decorators: [Story => <div className="w-[400px]">
        <Story />
      </div>]
}`,...f.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: "Invalid input data",
    error: true
  },
  decorators: [Story => <div className="w-[400px]">
        <Story />
      </div>]
}`,...g.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[400px] space-y-2">
      <Label htmlFor="notes" className="font-mono text-xs text-muted-foreground">
        MISSION NOTES
      </Label>
      <Textarea id="notes" placeholder="Enter mission notes..." />
    </div>
}`,...v.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[400px] space-y-2">
      <Label htmlFor="briefing" className="font-mono text-xs text-muted-foreground">
        PRE-FLIGHT BRIEFING
      </Label>
      <Textarea id="briefing" placeholder="Enter briefing details..." rows={5} className="min-h-[120px]" />
      <p className="text-xs text-muted-foreground">
        Include weather conditions, route, and special considerations.
      </p>
    </div>
}`,...y.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <CharacterCountDemo />
}`,...b.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[450px] space-y-4 p-4 border border-border bg-card/50">
      <h3 className="font-display text-sm text-primary">FLIGHT NOTES</h3>
      <div className="space-y-3">
        <div className="space-y-2">
          <Label className="font-mono text-xs text-muted-foreground">
            PILOT OBSERVATIONS
          </Label>
          <Textarea placeholder="Enter observations during flight..." defaultValue="Smooth takeoff at 0800 local. Encountered light turbulence at FL350. Autopilot performed well during cruise phase." rows={3} />
        </div>
        <div className="space-y-2">
          <Label className="font-mono text-xs text-muted-foreground">
            SYSTEM ANOMALIES
          </Label>
          <Textarea placeholder="Report any system anomalies..." rows={2} className="min-h-0" />
        </div>
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...S.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[500px] space-y-4 p-4 border border-border bg-card/50">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm text-destructive">INCIDENT REPORT</h3>
        <span className="text-xs font-mono text-muted-foreground">FORM IR-2024</span>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="font-mono text-xs text-muted-foreground">
            INCIDENT DESCRIPTION
          </Label>
          <Textarea placeholder="Describe the incident in detail..." rows={4} className="min-h-[100px]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">
              IMMEDIATE ACTIONS TAKEN
            </Label>
            <Textarea placeholder="Actions taken..." rows={3} className="min-h-0" />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">
              CONTRIBUTING FACTORS
            </Label>
            <Textarea placeholder="Contributing factors..." rows={3} className="min-h-0" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="font-mono text-xs text-muted-foreground">
            RECOMMENDATIONS
          </Label>
          <Textarea placeholder="Enter recommendations for prevention..." rows={3} />
        </div>
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...T.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[500px] space-y-4 p-4 border border-border bg-card/50">
      <h3 className="font-display text-sm text-primary">PRE-FLIGHT BRIEFING</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-mono text-xs text-muted-foreground">
            WEATHER CONDITIONS
          </Label>
          <Textarea defaultValue="METAR KJFK 121756Z 31015G22KT 10SM FEW040 SCT250 22/12 A3012" rows={3} className="min-h-0 font-mono text-xs" />
        </div>
        <div className="space-y-2">
          <Label className="font-mono text-xs text-muted-foreground">
            NOTAMS
          </Label>
          <Textarea defaultValue="RWY 04L/22R CLSD FOR MAINT. TWY B BTN TWY A AND TWY C CLSD." rows={3} className="min-h-0 font-mono text-xs" />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="font-mono text-xs text-muted-foreground">
          ROUTE NOTES
        </Label>
        <Textarea placeholder="Enter route-specific notes..." defaultValue="Direct MERIT, V229 ALB, V2 BOSTN. Expect FL350. Monitor 125.77 for traffic advisories in Boston area." rows={2} className="min-h-0" />
      </div>
      <div className="space-y-2">
        <Label className="font-mono text-xs text-muted-foreground">
          SPECIAL CONSIDERATIONS
        </Label>
        <Textarea placeholder="Any special considerations..." rows={2} className="min-h-0" />
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...j.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [log, setLog] = useState(\`[14:23:45] Session started - Level 12: Crosswind Landing
[14:24:12] Wind conditions: 15kt gusting 22kt, 30° crosswind
[14:25:33] Approach initiated - IAS 85kt, flaps 20°
[14:26:01] Crab angle established: 12° into wind
[14:26:45] Short final - transition to wing-low
[14:27:02] Touchdown - Success! Score: 92/100
[14:27:15] Session completed\`);
    return <div className="w-[500px] space-y-4 p-4 border border-border bg-card/50">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm text-primary">TRAINING LOG</h3>
          <span className="text-xs font-mono text-green-400">LIVE</span>
        </div>
        <Textarea value={log} onChange={e => setLog(e.target.value)} rows={10} className="min-h-[250px] font-mono text-xs bg-black/50" />
        <div className="flex justify-between text-xs font-mono text-muted-foreground">
          <span>Session: 00:03:30</span>
          <span>Lines: {log.split('\\n').length}</span>
        </div>
      </div>;
  },
  parameters: {
    layout: "padded"
  }
}`,...E.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[500px] space-y-4 p-4 border border-border bg-card/50">
      <h3 className="font-display text-sm text-primary">SYSTEM CONFIGURATION</h3>
      <div className="space-y-2">
        <Label className="font-mono text-xs text-muted-foreground">
          CONFIG YAML
        </Label>
        <Textarea defaultValue={\`training:
  learning_rate: 3e-4
  batch_size: 64
  n_envs: 8
  features:
    - behavioral_cloning
    - hindsight_experience
    - curiosity
  curriculum:
    start_level: 1
    max_level: 35\`} rows={12} className="min-h-[280px] font-mono text-xs" />
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...w.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState("");
    const [touched, setTouched] = useState(false);
    const hasError = touched && value.length < 10;
    return <div className="w-[400px] space-y-2">
        <Label htmlFor="validation" className={\`font-mono text-xs \${hasError ? "text-destructive" : "text-muted-foreground"}\`}>
          DESCRIPTION (Required)
        </Label>
        <Textarea id="validation" placeholder="Enter at least 10 characters..." value={value} onChange={e => setValue(e.target.value)} onBlur={() => setTouched(true)} error={hasError} />
        {hasError && <p className="text-xs text-destructive">
            Description must be at least 10 characters
          </p>}
      </div>;
  }
}`,...L.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[600px] space-y-8">
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">TEXTAREA STATES</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">DEFAULT</Label>
            <Textarea placeholder="Default textarea..." />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">WITH VALUE</Label>
            <Textarea defaultValue="Pre-filled content here" />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">DISABLED</Label>
            <Textarea placeholder="Disabled textarea" disabled />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">DISABLED WITH VALUE</Label>
            <Textarea defaultValue="Read-only content" disabled />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs text-destructive">ERROR STATE</Label>
            <Textarea placeholder="Error state..." error />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs text-destructive">ERROR WITH VALUE</Label>
            <Textarea defaultValue="Invalid data entered" error />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg text-foreground mb-4">SIZE VARIANTS</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">COMPACT (2 rows)</Label>
            <Textarea placeholder="Compact input..." rows={2} className="min-h-0" />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">STANDARD (4 rows)</Label>
            <Textarea placeholder="Standard input..." rows={4} />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">EXPANDED (8 rows)</Label>
            <Textarea placeholder="Expanded input..." rows={8} className="min-h-[200px]" />
          </div>
        </div>
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...I.parameters?.docs?.source}}};const U=["Default","WithPlaceholder","WithValue","SmallRows","MediumRows","LargeRows","Disabled","DisabledWithValue","ErrorState","ErrorWithValue","WithLabel","WithLabelAndDescription","WithCharacterCount","FlightNotes","IncidentReport","BriefingNotes","TrainingLog","SystemConfiguration","FormValidation","AllVariants"];export{I as AllVariants,j as BriefingNotes,c as Default,h as Disabled,N as DisabledWithValue,f as ErrorState,g as ErrorWithValue,S as FlightNotes,L as FormValidation,T as IncidentReport,u as LargeRows,p as MediumRows,x as SmallRows,w as SystemConfiguration,E as TrainingLog,b as WithCharacterCount,v as WithLabel,y as WithLabelAndDescription,i as WithPlaceholder,m as WithValue,U as __namedExportsOrder,Y as default};
