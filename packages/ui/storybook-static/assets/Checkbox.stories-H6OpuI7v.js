import{j as e,r as k}from"./iframe-rZoXeK5l.js";import{C as n}from"./checkbox-Bmm6JN_L.js";import{L as r}from"./label-DBRaLFZd.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DqYXjM1N.js";import"./index-BabMczZl.js";import"./index-p5YmI0II.js";import"./index-fvHFeWab.js";import"./index-DgHvID4o.js";import"./index-CqSIw0EQ.js";import"./utils-CDN07tui.js";import"./check-C6g1ZBL2.js";import"./createLucideIcon-oH0TnkMA.js";import"./index-DJNgIyCh.js";import"./index-DBhjKPQa.js";import"./index-B_jtOnfb.js";const V={title:"Components/Checkbox",component:n,parameters:{layout:"centered",docs:{description:{component:"A checkbox component with SKYNET cyberpunk styling. Features sharp edges, glowing states, and smooth transitions for binary selections."}}},tags:["autodocs"],argTypes:{checked:{control:"boolean",description:"The controlled checked state"},defaultChecked:{control:"boolean",description:"The default checked state (uncontrolled)"},disabled:{control:"boolean",description:"Whether the checkbox is disabled"},onCheckedChange:{action:"checked changed",description:"Callback when checked state changes"}}},i={args:{defaultChecked:!1}},m={args:{defaultChecked:!0}},u={args:{disabled:!0,defaultChecked:!1}},x={args:{disabled:!0,defaultChecked:!0}},p={render:()=>e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(n,{id:"autopilot-engage",defaultChecked:!0}),e.jsx(r,{htmlFor:"autopilot-engage",className:"font-mono text-foreground cursor-pointer",children:"ENGAGE AUTOPILOT"})]})},v=()=>{const[s,o]=k.useState(!1);return e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(n,{checked:s,onCheckedChange:c=>o(c===!0)}),e.jsx("span",{className:"text-sm font-mono text-muted-foreground",children:s?"ACTIVE":"INACTIVE"})]})},h={render:()=>e.jsx(v,{})},f={render:()=>{const[s,o]=k.useState({preflightCheck:!1,weatherBriefing:!1,fuelCalculation:!1,weightBalance:!1,notams:!1}),c=a=>{o(d=>({...d,[a]:!d[a]}))},t=Object.values(s).every(Boolean),l=Object.values(s).some(Boolean);return e.jsxs("div",{className:"w-[350px] space-y-4",children:[e.jsx("h3",{className:"font-display text-lg text-foreground",children:"PRE-FLIGHT CHECKLIST"}),e.jsxs("div",{className:"space-y-3 p-4 border border-border bg-card/50",children:[[{key:"preflightCheck",label:"PREFLIGHT INSPECTION"},{key:"weatherBriefing",label:"WEATHER BRIEFING"},{key:"fuelCalculation",label:"FUEL CALCULATION"},{key:"weightBalance",label:"WEIGHT & BALANCE"},{key:"notams",label:"NOTAMS REVIEWED"}].map(({key:a,label:d})=>e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(n,{id:a,checked:s[a],onCheckedChange:()=>c(a)}),e.jsx(r,{htmlFor:a,className:`font-mono text-sm cursor-pointer ${s[a]?"text-primary":"text-foreground"}`,children:d})]},a)),e.jsx("div",{className:"pt-3 border-t border-border",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(n,{id:"all-complete",checked:t,onCheckedChange:()=>{const a=!t;o({preflightCheck:a,weatherBriefing:a,fuelCalculation:a,weightBalance:a,notams:a})},className:l&&!t?"data-[state=unchecked]:bg-primary/30":""}),e.jsx(r,{htmlFor:"all-complete",className:"font-mono text-sm text-foreground cursor-pointer",children:t?"ALL COMPLETE":"SELECT ALL"})]})})]}),e.jsxs("div",{className:"text-xs font-mono text-muted-foreground",children:["STATUS: ",t?"CLEARED FOR DEPARTURE":`${Object.values(s).filter(Boolean).length}/5 ITEMS VERIFIED`]})]})},parameters:{layout:"padded"}},g={render:()=>{const[s,o]=k.useState({bc:!0,her:!0,curiosity:!1,worldModel:!1,pbt:!1,ewc:!1}),c=t=>{o(l=>({...l,[t]:!l[t]}))};return e.jsxs("div",{className:"w-[400px] space-y-4",children:[e.jsx("h3",{className:"font-display text-lg text-foreground",children:"ADVANCED RL FEATURES"}),e.jsx("div",{className:"grid grid-cols-2 gap-4 p-4 border border-border bg-card/50",children:[{key:"bc",label:"BEHAVIORAL CLONING",desc:"AWBC self-imitation"},{key:"her",label:"HER",desc:"Hindsight goal relabeling"},{key:"curiosity",label:"CURIOSITY",desc:"RND+ICM exploration"},{key:"worldModel",label:"WORLD MODEL",desc:"DreamerV3 imagination"},{key:"pbt",label:"PBT",desc:"Population training"},{key:"ewc",label:"EWC",desc:"Elastic weight consolidation"}].map(({key:t,label:l,desc:a})=>e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx(n,{id:`feature-${t}`,checked:s[t],onCheckedChange:()=>c(t),className:"mt-0.5"}),e.jsxs("div",{children:[e.jsx(r,{htmlFor:`feature-${t}`,className:`font-mono text-xs cursor-pointer block ${s[t]?"text-primary":"text-foreground"}`,children:l}),e.jsx("span",{className:"text-xs text-muted-foreground",children:a})]})]},t))}),e.jsxs("div",{className:"text-xs font-mono text-muted-foreground",children:["ACTIVE: ",Object.values(s).filter(Boolean).length," MODULES ENABLED"]})]})},parameters:{layout:"padded"}},b={render:()=>{const[s,o]=k.useState({stallProtection:!0,overspeedLimit:!0,attitudeLimit:!0,gLimit:!0,altitudeFloor:!1}),c=t=>{o(l=>({...l,[t]:!l[t]}))};return e.jsxs("div",{className:"w-[350px] space-y-4",children:[e.jsx("h3",{className:"font-display text-lg text-foreground",children:"SAFETY MONITOR CONFIG"}),e.jsx("div",{className:"space-y-3 p-4 border border-border bg-card/50",children:[{key:"stallProtection",label:"STALL PROTECTION",critical:!0},{key:"overspeedLimit",label:"OVERSPEED LIMIT",critical:!0},{key:"attitudeLimit",label:"ATTITUDE LIMITS",critical:!0},{key:"gLimit",label:"G-FORCE LIMITS",critical:!0},{key:"altitudeFloor",label:"ALTITUDE FLOOR",critical:!1}].map(({key:t,label:l,critical:a})=>e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(n,{id:`safety-${t}`,checked:s[t],onCheckedChange:()=>c(t)}),e.jsx(r,{htmlFor:`safety-${t}`,className:`font-mono text-sm cursor-pointer ${s[t]?"text-green-400":"text-yellow-400"}`,children:l})]}),a&&e.jsx("span",{className:"text-xs font-mono text-red-400",children:"CRITICAL"})]},t))}),e.jsx("div",{className:`text-xs font-mono ${Object.values(s).every(Boolean)?"text-green-400":"text-yellow-400"}`,children:Object.values(s).every(Boolean)?"ALL SAFETY SYSTEMS ACTIVE":`WARNING: ${Object.values(s).filter(t=>!t).length} PROTECTIONS DISABLED`})]})},parameters:{layout:"padded"}},C={render:()=>e.jsxs("div",{className:"w-[350px] space-y-4 p-4 border border-border bg-card/50",children:[e.jsx("h3",{className:"font-display text-sm text-primary",children:"SYSTEM PREFERENCES"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(n,{id:"auto-save",defaultChecked:!0}),e.jsxs("div",{children:[e.jsx(r,{htmlFor:"auto-save",className:"text-sm text-foreground cursor-pointer block",children:"Auto-save Checkpoints"}),e.jsx("span",{className:"text-xs text-muted-foreground",children:"Save training state periodically"})]})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(n,{id:"vec-normalize",defaultChecked:!0}),e.jsxs("div",{children:[e.jsx(r,{htmlFor:"vec-normalize",className:"text-sm text-foreground cursor-pointer block",children:"Vector Normalization"}),e.jsx("span",{className:"text-xs text-muted-foreground",children:"Normalize observations and rewards"})]})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(n,{id:"recurrent",defaultChecked:!1}),e.jsxs("div",{children:[e.jsx(r,{htmlFor:"recurrent",className:"text-sm text-foreground cursor-pointer block",children:"Recurrent Memory"}),e.jsx("span",{className:"text-xs text-muted-foreground",children:"Use LSTM for temporal patterns"})]})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(n,{id:"beta-features",disabled:!0}),e.jsxs("div",{children:[e.jsx(r,{htmlFor:"beta-features",className:"text-sm text-muted-foreground cursor-not-allowed block",children:"Beta Features"}),e.jsx("span",{className:"text-xs text-muted-foreground",children:"Currently unavailable"})]})]})]})]}),parameters:{layout:"padded"}},N={render:()=>e.jsxs("div",{className:"flex flex-col gap-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"font-display text-lg text-foreground mb-4",children:"CHECKBOX STATES"}),e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(n,{defaultChecked:!1}),e.jsx("span",{className:"text-sm font-mono text-muted-foreground",children:"UNCHECKED"})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(n,{defaultChecked:!0}),e.jsx("span",{className:"text-sm font-mono text-muted-foreground",children:"CHECKED"})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(n,{disabled:!0}),e.jsx("span",{className:"text-sm font-mono text-muted-foreground",children:"DISABLED UNCHECKED"})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(n,{disabled:!0,defaultChecked:!0}),e.jsx("span",{className:"text-sm font-mono text-muted-foreground",children:"DISABLED CHECKED"})]})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-display text-lg text-foreground mb-4",children:"WITH LABELS"}),e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(n,{id:"label-demo-1"}),e.jsx(r,{htmlFor:"label-demo-1",className:"font-mono text-sm text-foreground cursor-pointer",children:"STANDARD LABEL"})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(n,{id:"label-demo-2",defaultChecked:!0}),e.jsx(r,{htmlFor:"label-demo-2",className:"font-mono text-sm text-primary cursor-pointer",children:"ACTIVE LABEL STYLE"})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(n,{id:"label-demo-3",disabled:!0}),e.jsx(r,{htmlFor:"label-demo-3",className:"font-mono text-sm text-muted-foreground cursor-not-allowed",children:"DISABLED LABEL"})]})]})]})]}),parameters:{layout:"padded"}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    defaultChecked: false
  }
}`,...i.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    defaultChecked: true
  }
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    defaultChecked: false
  }
}`,...u.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    defaultChecked: true
  }
}`,...x.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-3">
      <Checkbox id="autopilot-engage" defaultChecked />
      <Label htmlFor="autopilot-engage" className="font-mono text-foreground cursor-pointer">
        ENGAGE AUTOPILOT
      </Label>
    </div>
}`,...p.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledCheckboxDemo />
}`,...h.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [selections, setSelections] = useState({
      preflightCheck: false,
      weatherBriefing: false,
      fuelCalculation: false,
      weightBalance: false,
      notams: false
    });
    const toggleSelection = (key: keyof typeof selections) => {
      setSelections(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    };
    const allChecked = Object.values(selections).every(Boolean);
    const someChecked = Object.values(selections).some(Boolean);
    return <div className="w-[350px] space-y-4">
        <h3 className="font-display text-lg text-foreground">PRE-FLIGHT CHECKLIST</h3>
        <div className="space-y-3 p-4 border border-border bg-card/50">
          {[{
          key: "preflightCheck" as const,
          label: "PREFLIGHT INSPECTION"
        }, {
          key: "weatherBriefing" as const,
          label: "WEATHER BRIEFING"
        }, {
          key: "fuelCalculation" as const,
          label: "FUEL CALCULATION"
        }, {
          key: "weightBalance" as const,
          label: "WEIGHT & BALANCE"
        }, {
          key: "notams" as const,
          label: "NOTAMS REVIEWED"
        }].map(({
          key,
          label
        }) => <div key={key} className="flex items-center gap-3">
              <Checkbox id={key} checked={selections[key]} onCheckedChange={() => toggleSelection(key)} />
              <Label htmlFor={key} className={\`font-mono text-sm cursor-pointer \${selections[key] ? "text-primary" : "text-foreground"}\`}>
                {label}
              </Label>
            </div>)}
          <div className="pt-3 border-t border-border">
            <div className="flex items-center gap-3">
              <Checkbox id="all-complete" checked={allChecked} onCheckedChange={() => {
              const newValue = !allChecked;
              setSelections({
                preflightCheck: newValue,
                weatherBriefing: newValue,
                fuelCalculation: newValue,
                weightBalance: newValue,
                notams: newValue
              });
            }} className={someChecked && !allChecked ? "data-[state=unchecked]:bg-primary/30" : ""} />
              <Label htmlFor="all-complete" className="font-mono text-sm text-foreground cursor-pointer">
                {allChecked ? "ALL COMPLETE" : "SELECT ALL"}
              </Label>
            </div>
          </div>
        </div>
        <div className="text-xs font-mono text-muted-foreground">
          STATUS: {allChecked ? "CLEARED FOR DEPARTURE" : \`\${Object.values(selections).filter(Boolean).length}/5 ITEMS VERIFIED\`}
        </div>
      </div>;
  },
  parameters: {
    layout: "padded"
  }
}`,...f.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [features, setFeatures] = useState({
      bc: true,
      her: true,
      curiosity: false,
      worldModel: false,
      pbt: false,
      ewc: false
    });
    const toggleFeature = (key: keyof typeof features) => {
      setFeatures(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    };
    return <div className="w-[400px] space-y-4">
        <h3 className="font-display text-lg text-foreground">ADVANCED RL FEATURES</h3>
        <div className="grid grid-cols-2 gap-4 p-4 border border-border bg-card/50">
          {[{
          key: "bc" as const,
          label: "BEHAVIORAL CLONING",
          desc: "AWBC self-imitation"
        }, {
          key: "her" as const,
          label: "HER",
          desc: "Hindsight goal relabeling"
        }, {
          key: "curiosity" as const,
          label: "CURIOSITY",
          desc: "RND+ICM exploration"
        }, {
          key: "worldModel" as const,
          label: "WORLD MODEL",
          desc: "DreamerV3 imagination"
        }, {
          key: "pbt" as const,
          label: "PBT",
          desc: "Population training"
        }, {
          key: "ewc" as const,
          label: "EWC",
          desc: "Elastic weight consolidation"
        }].map(({
          key,
          label,
          desc
        }) => <div key={key} className="flex items-start gap-3">
              <Checkbox id={\`feature-\${key}\`} checked={features[key]} onCheckedChange={() => toggleFeature(key)} className="mt-0.5" />
              <div>
                <Label htmlFor={\`feature-\${key}\`} className={\`font-mono text-xs cursor-pointer block \${features[key] ? "text-primary" : "text-foreground"}\`}>
                  {label}
                </Label>
                <span className="text-xs text-muted-foreground">{desc}</span>
              </div>
            </div>)}
        </div>
        <div className="text-xs font-mono text-muted-foreground">
          ACTIVE: {Object.values(features).filter(Boolean).length} MODULES ENABLED
        </div>
      </div>;
  },
  parameters: {
    layout: "padded"
  }
}`,...g.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [checks, setChecks] = useState({
      stallProtection: true,
      overspeedLimit: true,
      attitudeLimit: true,
      gLimit: true,
      altitudeFloor: false
    });
    const toggleCheck = (key: keyof typeof checks) => {
      setChecks(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    };
    return <div className="w-[350px] space-y-4">
        <h3 className="font-display text-lg text-foreground">SAFETY MONITOR CONFIG</h3>
        <div className="space-y-3 p-4 border border-border bg-card/50">
          {[{
          key: "stallProtection" as const,
          label: "STALL PROTECTION",
          critical: true
        }, {
          key: "overspeedLimit" as const,
          label: "OVERSPEED LIMIT",
          critical: true
        }, {
          key: "attitudeLimit" as const,
          label: "ATTITUDE LIMITS",
          critical: true
        }, {
          key: "gLimit" as const,
          label: "G-FORCE LIMITS",
          critical: true
        }, {
          key: "altitudeFloor" as const,
          label: "ALTITUDE FLOOR",
          critical: false
        }].map(({
          key,
          label,
          critical
        }) => <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox id={\`safety-\${key}\`} checked={checks[key]} onCheckedChange={() => toggleCheck(key)} />
                <Label htmlFor={\`safety-\${key}\`} className={\`font-mono text-sm cursor-pointer \${checks[key] ? "text-green-400" : "text-yellow-400"}\`}>
                  {label}
                </Label>
              </div>
              {critical && <span className="text-xs font-mono text-red-400">CRITICAL</span>}
            </div>)}
        </div>
        <div className={\`text-xs font-mono \${Object.values(checks).every(Boolean) ? "text-green-400" : "text-yellow-400"}\`}>
          {Object.values(checks).every(Boolean) ? "ALL SAFETY SYSTEMS ACTIVE" : \`WARNING: \${Object.values(checks).filter(v => !v).length} PROTECTIONS DISABLED\`}
        </div>
      </div>;
  },
  parameters: {
    layout: "padded"
  }
}`,...b.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[350px] space-y-4 p-4 border border-border bg-card/50">
      <h3 className="font-display text-sm text-primary">SYSTEM PREFERENCES</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Checkbox id="auto-save" defaultChecked />
          <div>
            <Label htmlFor="auto-save" className="text-sm text-foreground cursor-pointer block">
              Auto-save Checkpoints
            </Label>
            <span className="text-xs text-muted-foreground">Save training state periodically</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox id="vec-normalize" defaultChecked />
          <div>
            <Label htmlFor="vec-normalize" className="text-sm text-foreground cursor-pointer block">
              Vector Normalization
            </Label>
            <span className="text-xs text-muted-foreground">Normalize observations and rewards</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox id="recurrent" defaultChecked={false} />
          <div>
            <Label htmlFor="recurrent" className="text-sm text-foreground cursor-pointer block">
              Recurrent Memory
            </Label>
            <span className="text-xs text-muted-foreground">Use LSTM for temporal patterns</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox id="beta-features" disabled />
          <div>
            <Label htmlFor="beta-features" className="text-sm text-muted-foreground cursor-not-allowed block">
              Beta Features
            </Label>
            <span className="text-xs text-muted-foreground">Currently unavailable</span>
          </div>
        </div>
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...C.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">CHECKBOX STATES</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Checkbox defaultChecked={false} />
            <span className="text-sm font-mono text-muted-foreground">UNCHECKED</span>
          </div>
          <div className="flex items-center gap-4">
            <Checkbox defaultChecked />
            <span className="text-sm font-mono text-muted-foreground">CHECKED</span>
          </div>
          <div className="flex items-center gap-4">
            <Checkbox disabled />
            <span className="text-sm font-mono text-muted-foreground">DISABLED UNCHECKED</span>
          </div>
          <div className="flex items-center gap-4">
            <Checkbox disabled defaultChecked />
            <span className="text-sm font-mono text-muted-foreground">DISABLED CHECKED</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">WITH LABELS</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Checkbox id="label-demo-1" />
            <Label htmlFor="label-demo-1" className="font-mono text-sm text-foreground cursor-pointer">
              STANDARD LABEL
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="label-demo-2" defaultChecked />
            <Label htmlFor="label-demo-2" className="font-mono text-sm text-primary cursor-pointer">
              ACTIVE LABEL STYLE
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="label-demo-3" disabled />
            <Label htmlFor="label-demo-3" className="font-mono text-sm text-muted-foreground cursor-not-allowed">
              DISABLED LABEL
            </Label>
          </div>
        </div>
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...N.parameters?.docs?.source}}};const H=["Default","Checked","Disabled","DisabledChecked","WithLabel","Controlled","FormExample","TrainingFeatures","SafetyChecks","SettingsPanel","AllStates"];export{N as AllStates,m as Checked,h as Controlled,i as Default,u as Disabled,x as DisabledChecked,f as FormExample,b as SafetyChecks,C as SettingsPanel,g as TrainingFeatures,p as WithLabel,H as __namedExportsOrder,V as default};
