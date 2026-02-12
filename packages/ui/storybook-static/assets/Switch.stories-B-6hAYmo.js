import{j as e,r as h}from"./iframe-CzJrb7DT.js";import{S as s}from"./switch-D9uSCIN8.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B2sAhb2p.js";import"./index-WHAuAub8.js";import"./index-Dwoj57sw.js";import"./index-Czr-OA3y.js";import"./index-BKeZ5Mw3.js";import"./utils-CDN07tui.js";const I={title:"Components/Switch",component:s,parameters:{layout:"centered",docs:{description:{component:"A toggle switch component with SKYNET cyberpunk styling. Features sharp edges, glowing states, and smooth transitions."}}},tags:["autodocs"],argTypes:{checked:{control:"boolean",description:"The controlled checked state"},defaultChecked:{control:"boolean",description:"The default checked state (uncontrolled)"},disabled:{control:"boolean",description:"Whether the switch is disabled"},onCheckedChange:{action:"checked changed",description:"Callback when checked state changes"}}},d={args:{defaultChecked:!1}},c={args:{defaultChecked:!0}},l={args:{disabled:!0,defaultChecked:!1}},i={args:{disabled:!0,defaultChecked:!0}},N=()=>{const[t,o]=h.useState(!1);return e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(s,{checked:t,onCheckedChange:o}),e.jsx("span",{className:"text-sm font-mono text-muted-foreground",children:t?"ENABLED":"DISABLED"})]})},m={render:()=>e.jsx(N,{})},x={render:()=>e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(s,{id:"autopilot",defaultChecked:!0}),e.jsx("label",{htmlFor:"autopilot",className:"text-sm font-mono text-foreground cursor-pointer",children:"AUTOPILOT"})]})},u={render:()=>{const[t,o]=h.useState({bc:!0,her:!0,curiosity:!1,worldModel:!1,pbt:!1}),n=r=>{o(a=>({...a,[r]:!a[r]}))};return e.jsxs("div",{className:"w-[350px] space-y-4",children:[e.jsx("h3",{className:"font-display text-lg text-foreground",children:"TRAINING FEATURES"}),e.jsx("div",{className:"space-y-3 p-4 border border-border bg-card/50",children:[{key:"bc",label:"BEHAVIORAL CLONING",desc:"Self-imitation learning"},{key:"her",label:"HINDSIGHT EXPERIENCE",desc:"Goal relabeling"},{key:"curiosity",label:"CURIOSITY",desc:"Intrinsic exploration"},{key:"worldModel",label:"WORLD MODEL",desc:"DreamerV3 imagination"},{key:"pbt",label:"PBT",desc:"Population training"}].map(({key:r,label:a,desc:v})=>e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-sm font-mono text-foreground",children:a}),e.jsx("div",{className:"text-xs text-muted-foreground",children:v})]}),e.jsx(s,{checked:t[r],onCheckedChange:()=>n(r)})]},r))})]})},parameters:{layout:"padded"}},f={render:()=>{const[t,o]=h.useState({autopilot:!1,recording:!1,safety:!0,vecNormalize:!0}),n=r=>{o(a=>({...a,[r]:!a[r]}))};return e.jsxs("div",{className:"w-[400px] space-y-4",children:[e.jsx("h3",{className:"font-display text-lg text-foreground",children:"SYSTEM CONTROLS"}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{className:"p-4 border border-border bg-card/50 space-y-3",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs font-mono text-muted-foreground",children:"AUTOPILOT"}),e.jsx(s,{checked:t.autopilot,onCheckedChange:()=>n("autopilot")})]}),e.jsx("div",{className:`text-lg font-mono ${t.autopilot?"text-primary":"text-muted-foreground"}`,children:t.autopilot?"ENGAGED":"STANDBY"})]}),e.jsxs("div",{className:"p-4 border border-border bg-card/50 space-y-3",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs font-mono text-muted-foreground",children:"RECORDING"}),e.jsx(s,{checked:t.recording,onCheckedChange:()=>n("recording")})]}),e.jsx("div",{className:`text-lg font-mono ${t.recording?"text-red-400":"text-muted-foreground"}`,children:t.recording?"RECORDING":"IDLE"})]}),e.jsxs("div",{className:"p-4 border border-border bg-card/50 space-y-3",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs font-mono text-muted-foreground",children:"SAFETY"}),e.jsx(s,{checked:t.safety,onCheckedChange:()=>n("safety")})]}),e.jsx("div",{className:`text-lg font-mono ${t.safety?"text-green-400":"text-yellow-400"}`,children:t.safety?"ACTIVE":"BYPASSED"})]}),e.jsxs("div",{className:"p-4 border border-border bg-card/50 space-y-3",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs font-mono text-muted-foreground",children:"VEC NORM"}),e.jsx(s,{checked:t.vecNormalize,onCheckedChange:()=>n("vecNormalize")})]}),e.jsx("div",{className:`text-lg font-mono ${t.vecNormalize?"text-primary":"text-muted-foreground"}`,children:t.vecNormalize?"ON":"OFF"})]})]})]})},parameters:{layout:"padded"}},p={render:()=>e.jsxs("div",{className:"w-[350px] space-y-4 p-4 border border-border bg-card/50",children:[e.jsx("h3",{className:"font-display text-sm text-primary",children:"PREFERENCES"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-sm text-foreground",children:"Dark Mode"}),e.jsx("div",{className:"text-xs text-muted-foreground",children:"Use dark color scheme"})]}),e.jsx(s,{defaultChecked:!0})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-sm text-foreground",children:"Sound Effects"}),e.jsx("div",{className:"text-xs text-muted-foreground",children:"Play UI sounds"})]}),e.jsx(s,{defaultChecked:!1})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-sm text-foreground",children:"Auto-save"}),e.jsx("div",{className:"text-xs text-muted-foreground",children:"Save checkpoints automatically"})]}),e.jsx(s,{defaultChecked:!0})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-sm text-foreground text-muted-foreground",children:"Beta Features"}),e.jsx("div",{className:"text-xs text-muted-foreground",children:"Currently unavailable"})]}),e.jsx(s,{disabled:!0})]})]})]}),parameters:{layout:"padded"}},g={render:()=>e.jsx("div",{className:"flex flex-col gap-6",children:e.jsxs("div",{children:[e.jsx("h3",{className:"font-display text-lg text-foreground mb-4",children:"SWITCH STATES"}),e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(s,{defaultChecked:!1}),e.jsx("span",{className:"text-sm font-mono text-muted-foreground",children:"UNCHECKED"})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(s,{defaultChecked:!0}),e.jsx("span",{className:"text-sm font-mono text-muted-foreground",children:"CHECKED"})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(s,{disabled:!0}),e.jsx("span",{className:"text-sm font-mono text-muted-foreground",children:"DISABLED UNCHECKED"})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(s,{disabled:!0,defaultChecked:!0}),e.jsx("span",{className:"text-sm font-mono text-muted-foreground",children:"DISABLED CHECKED"})]})]})]})}),parameters:{layout:"padded"}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    defaultChecked: false
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    defaultChecked: true
  }
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    defaultChecked: false
  }
}`,...l.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    defaultChecked: true
  }
}`,...i.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledSwitchDemo />
}`,...m.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-3">
      <Switch id="autopilot" defaultChecked />
      <label htmlFor="autopilot" className="text-sm font-mono text-foreground cursor-pointer">
        AUTOPILOT
      </label>
    </div>
}`,...x.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [features, setFeatures] = useState({
      bc: true,
      her: true,
      curiosity: false,
      worldModel: false,
      pbt: false
    });
    const toggleFeature = (key: keyof typeof features) => {
      setFeatures(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    };
    return <div className="w-[350px] space-y-4">
        <h3 className="font-display text-lg text-foreground">TRAINING FEATURES</h3>
        <div className="space-y-3 p-4 border border-border bg-card/50">
          {[{
          key: "bc" as const,
          label: "BEHAVIORAL CLONING",
          desc: "Self-imitation learning"
        }, {
          key: "her" as const,
          label: "HINDSIGHT EXPERIENCE",
          desc: "Goal relabeling"
        }, {
          key: "curiosity" as const,
          label: "CURIOSITY",
          desc: "Intrinsic exploration"
        }, {
          key: "worldModel" as const,
          label: "WORLD MODEL",
          desc: "DreamerV3 imagination"
        }, {
          key: "pbt" as const,
          label: "PBT",
          desc: "Population training"
        }].map(({
          key,
          label,
          desc
        }) => <div key={key} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-mono text-foreground">{label}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </div>
              <Switch checked={features[key]} onCheckedChange={() => toggleFeature(key)} />
            </div>)}
        </div>
      </div>;
  },
  parameters: {
    layout: "padded"
  }
}`,...u.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [controls, setControls] = useState({
      autopilot: false,
      recording: false,
      safety: true,
      vecNormalize: true
    });
    const toggleControl = (key: keyof typeof controls) => {
      setControls(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    };
    return <div className="w-[400px] space-y-4">
        <h3 className="font-display text-lg text-foreground">SYSTEM CONTROLS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-border bg-card/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">AUTOPILOT</span>
              <Switch checked={controls.autopilot} onCheckedChange={() => toggleControl("autopilot")} />
            </div>
            <div className={\`text-lg font-mono \${controls.autopilot ? "text-primary" : "text-muted-foreground"}\`}>
              {controls.autopilot ? "ENGAGED" : "STANDBY"}
            </div>
          </div>

          <div className="p-4 border border-border bg-card/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">RECORDING</span>
              <Switch checked={controls.recording} onCheckedChange={() => toggleControl("recording")} />
            </div>
            <div className={\`text-lg font-mono \${controls.recording ? "text-red-400" : "text-muted-foreground"}\`}>
              {controls.recording ? "RECORDING" : "IDLE"}
            </div>
          </div>

          <div className="p-4 border border-border bg-card/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">SAFETY</span>
              <Switch checked={controls.safety} onCheckedChange={() => toggleControl("safety")} />
            </div>
            <div className={\`text-lg font-mono \${controls.safety ? "text-green-400" : "text-yellow-400"}\`}>
              {controls.safety ? "ACTIVE" : "BYPASSED"}
            </div>
          </div>

          <div className="p-4 border border-border bg-card/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">VEC NORM</span>
              <Switch checked={controls.vecNormalize} onCheckedChange={() => toggleControl("vecNormalize")} />
            </div>
            <div className={\`text-lg font-mono \${controls.vecNormalize ? "text-primary" : "text-muted-foreground"}\`}>
              {controls.vecNormalize ? "ON" : "OFF"}
            </div>
          </div>
        </div>
      </div>;
  },
  parameters: {
    layout: "padded"
  }
}`,...f.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[350px] space-y-4 p-4 border border-border bg-card/50">
      <h3 className="font-display text-sm text-primary">PREFERENCES</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-foreground">Dark Mode</div>
            <div className="text-xs text-muted-foreground">Use dark color scheme</div>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-foreground">Sound Effects</div>
            <div className="text-xs text-muted-foreground">Play UI sounds</div>
          </div>
          <Switch defaultChecked={false} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-foreground">Auto-save</div>
            <div className="text-xs text-muted-foreground">Save checkpoints automatically</div>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-foreground text-muted-foreground">Beta Features</div>
            <div className="text-xs text-muted-foreground">Currently unavailable</div>
          </div>
          <Switch disabled />
        </div>
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...p.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">SWITCH STATES</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Switch defaultChecked={false} />
            <span className="text-sm font-mono text-muted-foreground">UNCHECKED</span>
          </div>
          <div className="flex items-center gap-4">
            <Switch defaultChecked />
            <span className="text-sm font-mono text-muted-foreground">CHECKED</span>
          </div>
          <div className="flex items-center gap-4">
            <Switch disabled />
            <span className="text-sm font-mono text-muted-foreground">DISABLED UNCHECKED</span>
          </div>
          <div className="flex items-center gap-4">
            <Switch disabled defaultChecked />
            <span className="text-sm font-mono text-muted-foreground">DISABLED CHECKED</span>
          </div>
        </div>
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...g.parameters?.docs?.source}}};const T=["Default","Checked","Disabled","DisabledChecked","Controlled","WithLabel","FeatureToggles","SystemControls","SettingsPanel","AllStates"];export{g as AllStates,c as Checked,m as Controlled,d as Default,l as Disabled,i as DisabledChecked,u as FeatureToggles,p as SettingsPanel,f as SystemControls,x as WithLabel,T as __namedExportsOrder,I as default};
