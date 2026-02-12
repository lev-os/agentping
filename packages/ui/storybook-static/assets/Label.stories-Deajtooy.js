import{j as e}from"./iframe-CzJrb7DT.js";import{L as a}from"./label-D8f8WTW2.js";import{I as r}from"./input-BawzCQYs.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CJ_imsi-.js";import"./index-WHAuAub8.js";import"./index-Dwoj57sw.js";import"./index-DiN5Zsj0.js";import"./index-Czr-OA3y.js";import"./index-B_jtOnfb.js";import"./utils-CDN07tui.js";const w={title:"Components/Label",component:a,parameters:{layout:"centered",docs:{description:{component:"A label component for form fields. Features proper accessibility with htmlFor association and peer-disabled state handling for connected inputs."}}},tags:["autodocs"],argTypes:{htmlFor:{control:"text",description:"Associates the label with a form control by ID"},className:{control:"text",description:"Additional CSS classes for styling"}}},s={args:{children:"FIELD LABEL"}},l={args:{children:"CALLSIGN",htmlFor:"callsign-input"},render:p=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(a,{...p}),e.jsx(r,{id:"callsign-input",placeholder:"Enter callsign..."})]})},t={args:{children:"ALTITUDE MSL",className:"uppercase tracking-wider text-xs"}},n={render:()=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsxs(a,{htmlFor:"required-field",className:"flex items-center gap-1",children:["PILOT NAME",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx(r,{id:"required-field",placeholder:"Required field",required:!0})]})},d={render:()=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsxs(a,{htmlFor:"icon-field",className:"flex items-center gap-2",children:[e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"h-4 w-4 text-primary",children:e.jsx("path",{d:"M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"})}),"FLIGHT PLAN"]}),e.jsx(r,{id:"icon-field",placeholder:"Enter flight plan ID..."})]})},i={render:()=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(a,{htmlFor:"disabled-field",className:"peer-disabled:cursor-not-allowed peer-disabled:opacity-70",children:"LOCKED PARAMETER"}),e.jsx(r,{id:"disabled-field",disabled:!0,value:"LOCKED VALUE",className:"peer"})]})},c={render:()=>e.jsxs("div",{className:"flex flex-col gap-6 min-w-[320px]",children:[e.jsx("h3",{className:"font-display text-lg text-foreground border-b border-border pb-2",children:"FLIGHT PARAMETERS"}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(a,{htmlFor:"altitude",className:"text-xs uppercase tracking-wider text-muted-foreground",children:"ALTITUDE (FT)"}),e.jsx(r,{id:"altitude",type:"number",placeholder:"3500"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(a,{htmlFor:"airspeed",className:"text-xs uppercase tracking-wider text-muted-foreground",children:"AIRSPEED (KTS)"}),e.jsx(r,{id:"airspeed",type:"number",placeholder:"120"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(a,{htmlFor:"heading",className:"text-xs uppercase tracking-wider text-muted-foreground",children:"HEADING (DEG)"}),e.jsx(r,{id:"heading",type:"number",placeholder:"270"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(a,{htmlFor:"vs",className:"text-xs uppercase tracking-wider text-muted-foreground",children:"VS (FPM)"}),e.jsx(r,{id:"vs",type:"number",placeholder:"-500"})]})]})]}),parameters:{layout:"padded"}},o={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 min-w-[280px]",children:[e.jsx("h3",{className:"font-display text-lg text-foreground border-b border-border pb-2",children:"ENGINE CONTROLS"}),e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsxs(a,{htmlFor:"throttle",className:"text-xs uppercase tracking-wider",children:["THROTTLE",e.jsx("span",{className:"text-muted-foreground ml-2",children:"(0-100%)"})]}),e.jsx(r,{id:"throttle",type:"number",min:"0",max:"100",placeholder:"75"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsxs(a,{htmlFor:"mixture",className:"text-xs uppercase tracking-wider",children:["MIXTURE",e.jsx("span",{className:"text-muted-foreground ml-2",children:"(LEAN-RICH)"})]}),e.jsx(r,{id:"mixture",type:"number",min:"0",max:"100",placeholder:"100"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsxs(a,{htmlFor:"rpm",className:"text-xs uppercase tracking-wider",children:["RPM",e.jsx("span",{className:"text-destructive ml-1",children:"*"})]}),e.jsx(r,{id:"rpm",type:"number",placeholder:"2400",required:!0})]})]})]}),parameters:{layout:"padded"}},x={render:()=>e.jsxs("div",{className:"flex flex-col gap-6 min-w-[280px]",children:[e.jsx("h3",{className:"font-display text-lg text-foreground border-b border-border pb-2",children:"VALIDATION STATES"}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(a,{htmlFor:"valid-field",className:"text-xs uppercase tracking-wider text-green-500",children:"VALID ENTRY"}),e.jsx(r,{id:"valid-field",value:"N12345",className:"border-green-500"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(a,{htmlFor:"error-field",className:"text-xs uppercase tracking-wider text-red-500",children:"INVALID ENTRY"}),e.jsx(r,{id:"error-field",value:"INVALID",error:!0}),e.jsx("span",{className:"text-xs text-red-500",children:"Invalid registration format"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(a,{htmlFor:"warning-field",className:"text-xs uppercase tracking-wider text-yellow-500",children:"WARNING"}),e.jsx(r,{id:"warning-field",value:"VFR ONLY",className:"border-yellow-500"}),e.jsx("span",{className:"text-xs text-yellow-500",children:"Weather below IFR minimums"})]})]}),parameters:{layout:"padded"}},m={render:()=>e.jsxs("div",{className:"flex flex-col gap-8",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"font-display text-lg text-foreground mb-4 border-b border-border pb-2",children:"LABEL STYLES"}),e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(a,{className:"min-w-[140px]",children:"Default"}),e.jsx("span",{className:"text-xs text-muted-foreground font-mono",children:"text-sm font-medium"})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(a,{className:"min-w-[140px] text-xs uppercase tracking-wider",children:"UPPERCASE XS"}),e.jsx("span",{className:"text-xs text-muted-foreground font-mono",children:"text-xs uppercase tracking-wider"})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(a,{className:"min-w-[140px] text-xs uppercase tracking-widest text-muted-foreground",children:"MUTED WIDEST"}),e.jsx("span",{className:"text-xs text-muted-foreground font-mono",children:"+ text-muted-foreground tracking-widest"})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(a,{className:"min-w-[140px] font-mono text-xs",children:"MONOSPACE"}),e.jsx("span",{className:"text-xs text-muted-foreground font-mono",children:"font-mono text-xs"})]})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-display text-lg text-foreground mb-4 border-b border-border pb-2",children:"WITH FORM CONTEXT"}),e.jsxs("div",{className:"grid grid-cols-2 gap-6",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(a,{htmlFor:"ctx-1",className:"text-xs uppercase tracking-wider text-muted-foreground",children:"SQUAWK CODE"}),e.jsx(r,{id:"ctx-1",placeholder:"1200"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(a,{htmlFor:"ctx-2",className:"text-xs uppercase tracking-wider text-muted-foreground",children:"TRANSPONDER"}),e.jsx(r,{id:"ctx-2",placeholder:"MODE C"})]})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-display text-lg text-foreground mb-4 border-b border-border pb-2",children:"SKYNET THEME"}),e.jsx("div",{className:"p-4 border border-border bg-card/50 rounded-md",children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(a,{htmlFor:"skynet-1",className:"text-xs uppercase tracking-wider text-primary font-mono",children:"NEURAL NETWORK ID"}),e.jsx(r,{id:"skynet-1",value:"PPO-SOFIA-2.4.1",className:"font-mono",readOnly:!0})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(a,{htmlFor:"skynet-2",className:"text-xs uppercase tracking-wider text-primary font-mono",children:"TRAINING EPOCH"}),e.jsx(r,{id:"skynet-2",type:"number",value:"1247",className:"font-mono",readOnly:!0})]})]})})]})]}),parameters:{layout:"padded"}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: "FIELD LABEL"
  }
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: "CALLSIGN",
    htmlFor: "callsign-input"
  },
  render: args => <div className="flex flex-col gap-2">
      <Label {...args} />
      <Input id="callsign-input" placeholder="Enter callsign..." />
    </div>
}`,...l.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    children: "ALTITUDE MSL",
    className: "uppercase tracking-wider text-xs"
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2">
      <Label htmlFor="required-field" className="flex items-center gap-1">
        PILOT NAME
        <span className="text-red-500">*</span>
      </Label>
      <Input id="required-field" placeholder="Required field" required />
    </div>
}`,...n.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2">
      <Label htmlFor="icon-field" className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary">
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
        </svg>
        FLIGHT PLAN
      </Label>
      <Input id="icon-field" placeholder="Enter flight plan ID..." />
    </div>
}`,...d.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2">
      <Label htmlFor="disabled-field" className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        LOCKED PARAMETER
      </Label>
      <Input id="disabled-field" disabled value="LOCKED VALUE" className="peer" />
    </div>
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6 min-w-[320px]">
      <h3 className="font-display text-lg text-foreground border-b border-border pb-2">
        FLIGHT PARAMETERS
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="altitude" className="text-xs uppercase tracking-wider text-muted-foreground">
            ALTITUDE (FT)
          </Label>
          <Input id="altitude" type="number" placeholder="3500" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="airspeed" className="text-xs uppercase tracking-wider text-muted-foreground">
            AIRSPEED (KTS)
          </Label>
          <Input id="airspeed" type="number" placeholder="120" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="heading" className="text-xs uppercase tracking-wider text-muted-foreground">
            HEADING (DEG)
          </Label>
          <Input id="heading" type="number" placeholder="270" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="vs" className="text-xs uppercase tracking-wider text-muted-foreground">
            VS (FPM)
          </Label>
          <Input id="vs" type="number" placeholder="-500" />
        </div>
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...c.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 min-w-[280px]">
      <h3 className="font-display text-lg text-foreground border-b border-border pb-2">
        ENGINE CONTROLS
      </h3>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="throttle" className="text-xs uppercase tracking-wider">
            THROTTLE
            <span className="text-muted-foreground ml-2">(0-100%)</span>
          </Label>
          <Input id="throttle" type="number" min="0" max="100" placeholder="75" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="mixture" className="text-xs uppercase tracking-wider">
            MIXTURE
            <span className="text-muted-foreground ml-2">(LEAN-RICH)</span>
          </Label>
          <Input id="mixture" type="number" min="0" max="100" placeholder="100" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="rpm" className="text-xs uppercase tracking-wider">
            RPM
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input id="rpm" type="number" placeholder="2400" required />
        </div>
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...o.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6 min-w-[280px]">
      <h3 className="font-display text-lg text-foreground border-b border-border pb-2">
        VALIDATION STATES
      </h3>

      <div className="flex flex-col gap-2">
        <Label htmlFor="valid-field" className="text-xs uppercase tracking-wider text-green-500">
          VALID ENTRY
        </Label>
        <Input id="valid-field" value="N12345" className="border-green-500" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="error-field" className="text-xs uppercase tracking-wider text-red-500">
          INVALID ENTRY
        </Label>
        <Input id="error-field" value="INVALID" error />
        <span className="text-xs text-red-500">Invalid registration format</span>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="warning-field" className="text-xs uppercase tracking-wider text-yellow-500">
          WARNING
        </Label>
        <Input id="warning-field" value="VFR ONLY" className="border-yellow-500" />
        <span className="text-xs text-yellow-500">Weather below IFR minimums</span>
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...x.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-8">
      <div>
        <h3 className="font-display text-lg text-foreground mb-4 border-b border-border pb-2">
          LABEL STYLES
        </h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Label className="min-w-[140px]">Default</Label>
            <span className="text-xs text-muted-foreground font-mono">text-sm font-medium</span>
          </div>
          <div className="flex items-center gap-4">
            <Label className="min-w-[140px] text-xs uppercase tracking-wider">UPPERCASE XS</Label>
            <span className="text-xs text-muted-foreground font-mono">text-xs uppercase tracking-wider</span>
          </div>
          <div className="flex items-center gap-4">
            <Label className="min-w-[140px] text-xs uppercase tracking-widest text-muted-foreground">
              MUTED WIDEST
            </Label>
            <span className="text-xs text-muted-foreground font-mono">+ text-muted-foreground tracking-widest</span>
          </div>
          <div className="flex items-center gap-4">
            <Label className="min-w-[140px] font-mono text-xs">MONOSPACE</Label>
            <span className="text-xs text-muted-foreground font-mono">font-mono text-xs</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg text-foreground mb-4 border-b border-border pb-2">
          WITH FORM CONTEXT
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="ctx-1" className="text-xs uppercase tracking-wider text-muted-foreground">
              SQUAWK CODE
            </Label>
            <Input id="ctx-1" placeholder="1200" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ctx-2" className="text-xs uppercase tracking-wider text-muted-foreground">
              TRANSPONDER
            </Label>
            <Input id="ctx-2" placeholder="MODE C" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg text-foreground mb-4 border-b border-border pb-2">
          SKYNET THEME
        </h3>
        <div className="p-4 border border-border bg-card/50 rounded-md">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="skynet-1" className="text-xs uppercase tracking-wider text-primary font-mono">
                NEURAL NETWORK ID
              </Label>
              <Input id="skynet-1" value="PPO-SOFIA-2.4.1" className="font-mono" readOnly />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="skynet-2" className="text-xs uppercase tracking-wider text-primary font-mono">
                TRAINING EPOCH
              </Label>
              <Input id="skynet-2" type="number" value="1247" className="font-mono" readOnly />
            </div>
          </div>
        </div>
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...m.parameters?.docs?.source}}};const y=["Default","WithHtmlFor","UppercaseTracking","RequiredIndicator","WithIcon","DisabledState","AviationFormFields","EngineParameters","ValidationStates","AllVariants"];export{m as AllVariants,c as AviationFormFields,s as Default,i as DisabledState,o as EngineParameters,n as RequiredIndicator,t as UppercaseTracking,x as ValidationStates,l as WithHtmlFor,d as WithIcon,y as __namedExportsOrder,w as default};
