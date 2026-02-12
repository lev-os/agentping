import{j as e}from"./iframe-CzJrb7DT.js";import{I as a}from"./input-BawzCQYs.js";import{L as r}from"./label-D8f8WTW2.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CDN07tui.js";import"./index-CJ_imsi-.js";import"./index-WHAuAub8.js";import"./index-Dwoj57sw.js";import"./index-DiN5Zsj0.js";import"./index-Czr-OA3y.js";import"./index-B_jtOnfb.js";const A={title:"Components/Input",component:a,parameters:{layout:"centered",docs:{description:{component:"A text input component with SKYNET cyberpunk styling. Features clean borders, focus rings, and error state handling for tactical data entry."}}},tags:["autodocs"],argTypes:{type:{control:"select",options:["text","email","password","number","tel","url","search"],description:"The HTML input type"},placeholder:{control:"text",description:"Placeholder text displayed when empty"},disabled:{control:"boolean",description:"Whether the input is disabled"},error:{control:"boolean",description:"Whether the input is in an error state"}}},s={args:{type:"text",placeholder:"Enter data..."}},t={args:{type:"text",placeholder:"ENTER CALLSIGN"}},l={args:{type:"email",placeholder:"pilot@skynet.mil"}},n={args:{type:"password",placeholder:"Enter access code"}},c={args:{type:"number",placeholder:"0",className:"font-mono"}},o={args:{type:"text",placeholder:"SYSTEM LOCKED",disabled:!0}},d={args:{type:"text",placeholder:"Invalid input",error:!0,defaultValue:"INVALID_DATA"}},p={render:()=>e.jsxs("div",{className:"flex flex-col gap-2 w-64",children:[e.jsx(r,{htmlFor:"callsign",className:"text-xs uppercase tracking-wider text-muted-foreground",children:"Pilot Callsign"}),e.jsx(a,{id:"callsign",type:"text",placeholder:"MAVERICK"})]})},i={render:()=>e.jsxs("div",{className:"flex flex-col gap-2 w-64",children:[e.jsx(r,{htmlFor:"altitude-err",className:"text-xs uppercase tracking-wider text-muted-foreground",children:"Target Altitude"}),e.jsx(a,{id:"altitude-err",type:"number",error:!0,defaultValue:"99999",className:"font-mono"}),e.jsx("span",{className:"text-xs text-red-500",children:"ALTITUDE EXCEEDS SERVICE CEILING"})]})},m={render:()=>e.jsxs("div",{className:"flex flex-col gap-2 w-48",children:[e.jsx(r,{htmlFor:"tail",className:"text-xs uppercase tracking-wider text-muted-foreground",children:"Aircraft Tail Number"}),e.jsx(a,{id:"tail",type:"text",placeholder:"N172SP",className:"font-mono uppercase",maxLength:7})]})},x={render:()=>e.jsxs("div",{className:"flex flex-col gap-2 w-40",children:[e.jsx(r,{htmlFor:"alt",className:"text-xs uppercase tracking-wider text-muted-foreground",children:"Altitude (ft)"}),e.jsx(a,{id:"alt",type:"number",placeholder:"3500",className:"font-mono",min:0,max:18e3,step:100})]})},u={render:()=>e.jsxs("div",{className:"flex flex-col gap-2 w-32",children:[e.jsx(r,{htmlFor:"hdg",className:"text-xs uppercase tracking-wider text-muted-foreground",children:"Heading (deg)"}),e.jsx(a,{id:"hdg",type:"number",placeholder:"270",className:"font-mono",min:0,max:359,step:1})]})},f={render:()=>e.jsxs("div",{className:"flex flex-col gap-2 w-32",children:[e.jsx(r,{htmlFor:"speed",className:"text-xs uppercase tracking-wider text-muted-foreground",children:"IAS (kts)"}),e.jsx(a,{id:"speed",type:"number",placeholder:"120",className:"font-mono",min:0,max:250,step:5})]})},g={render:()=>e.jsxs("div",{className:"flex flex-col gap-2 w-40",children:[e.jsx(r,{htmlFor:"freq",className:"text-xs uppercase tracking-wider text-muted-foreground",children:"COM1 Frequency"}),e.jsx(a,{id:"freq",type:"text",placeholder:"121.500",className:"font-mono",maxLength:7})]})},N={render:()=>e.jsxs("div",{className:"flex flex-col gap-2 w-32",children:[e.jsx(r,{htmlFor:"squawk",className:"text-xs uppercase tracking-wider text-muted-foreground",children:"Squawk Code"}),e.jsx(a,{id:"squawk",type:"text",placeholder:"1200",className:"font-mono",maxLength:4,pattern:"[0-7]{4}"})]})},h={render:()=>e.jsxs("div",{className:"flex flex-col gap-8",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"font-display text-lg text-foreground mb-4",children:"INPUT TYPES"}),e.jsxs("div",{className:"flex flex-wrap gap-4",children:[e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx(r,{className:"text-xs uppercase tracking-wider text-muted-foreground",children:"Text"}),e.jsx(a,{type:"text",placeholder:"Text input",className:"w-40"})]}),e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx(r,{className:"text-xs uppercase tracking-wider text-muted-foreground",children:"Email"}),e.jsx(a,{type:"email",placeholder:"email@skynet.mil",className:"w-40"})]}),e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx(r,{className:"text-xs uppercase tracking-wider text-muted-foreground",children:"Password"}),e.jsx(a,{type:"password",placeholder:"Password",className:"w-40"})]}),e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx(r,{className:"text-xs uppercase tracking-wider text-muted-foreground",children:"Number"}),e.jsx(a,{type:"number",placeholder:"0",className:"w-40 font-mono"})]})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-display text-lg text-foreground mb-4",children:"STATES"}),e.jsxs("div",{className:"flex flex-wrap gap-4",children:[e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx(r,{className:"text-xs uppercase tracking-wider text-muted-foreground",children:"Default"}),e.jsx(a,{type:"text",placeholder:"Default",className:"w-40"})]}),e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx(r,{className:"text-xs uppercase tracking-wider text-muted-foreground",children:"Disabled"}),e.jsx(a,{type:"text",placeholder:"Disabled",disabled:!0,className:"w-40"})]}),e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx(r,{className:"text-xs uppercase tracking-wider text-muted-foreground",children:"Error"}),e.jsx(a,{type:"text",defaultValue:"INVALID",error:!0,className:"w-40"})]})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-display text-lg text-foreground mb-4",children:"AVIATION DATA ENTRY"}),e.jsxs("div",{className:"flex flex-wrap gap-4",children:[e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx(r,{className:"text-xs uppercase tracking-wider text-muted-foreground",children:"Tail #"}),e.jsx(a,{type:"text",placeholder:"N172SP",className:"w-28 font-mono uppercase",maxLength:7})]}),e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx(r,{className:"text-xs uppercase tracking-wider text-muted-foreground",children:"ALT (ft)"}),e.jsx(a,{type:"number",placeholder:"3500",className:"w-24 font-mono"})]}),e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx(r,{className:"text-xs uppercase tracking-wider text-muted-foreground",children:"HDG (deg)"}),e.jsx(a,{type:"number",placeholder:"270",className:"w-20 font-mono"})]}),e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx(r,{className:"text-xs uppercase tracking-wider text-muted-foreground",children:"IAS (kts)"}),e.jsx(a,{type:"number",placeholder:"120",className:"w-20 font-mono"})]}),e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx(r,{className:"text-xs uppercase tracking-wider text-muted-foreground",children:"COM1"}),e.jsx(a,{type:"text",placeholder:"121.500",className:"w-24 font-mono"})]}),e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx(r,{className:"text-xs uppercase tracking-wider text-muted-foreground",children:"Squawk"}),e.jsx(a,{type:"text",placeholder:"1200",className:"w-20 font-mono",maxLength:4})]})]})]})]}),parameters:{layout:"padded"}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    type: "text",
    placeholder: "Enter data..."
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    type: "text",
    placeholder: "ENTER CALLSIGN"
  }
}`,...t.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    type: "email",
    placeholder: "pilot@skynet.mil"
  }
}`,...l.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    type: "password",
    placeholder: "Enter access code"
  }
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    type: "number",
    placeholder: "0",
    className: "font-mono"
  }
}`,...c.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    type: "text",
    placeholder: "SYSTEM LOCKED",
    disabled: true
  }
}`,...o.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    type: "text",
    placeholder: "Invalid input",
    error: true,
    defaultValue: "INVALID_DATA"
  }
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 w-64">
      <Label htmlFor="callsign" className="text-xs uppercase tracking-wider text-muted-foreground">
        Pilot Callsign
      </Label>
      <Input id="callsign" type="text" placeholder="MAVERICK" />
    </div>
}`,...p.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 w-64">
      <Label htmlFor="altitude-err" className="text-xs uppercase tracking-wider text-muted-foreground">
        Target Altitude
      </Label>
      <Input id="altitude-err" type="number" error={true} defaultValue="99999" className="font-mono" />
      <span className="text-xs text-red-500">ALTITUDE EXCEEDS SERVICE CEILING</span>
    </div>
}`,...i.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 w-48">
      <Label htmlFor="tail" className="text-xs uppercase tracking-wider text-muted-foreground">
        Aircraft Tail Number
      </Label>
      <Input id="tail" type="text" placeholder="N172SP" className="font-mono uppercase" maxLength={7} />
    </div>
}`,...m.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 w-40">
      <Label htmlFor="alt" className="text-xs uppercase tracking-wider text-muted-foreground">
        Altitude (ft)
      </Label>
      <Input id="alt" type="number" placeholder="3500" className="font-mono" min={0} max={18000} step={100} />
    </div>
}`,...x.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 w-32">
      <Label htmlFor="hdg" className="text-xs uppercase tracking-wider text-muted-foreground">
        Heading (deg)
      </Label>
      <Input id="hdg" type="number" placeholder="270" className="font-mono" min={0} max={359} step={1} />
    </div>
}`,...u.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 w-32">
      <Label htmlFor="speed" className="text-xs uppercase tracking-wider text-muted-foreground">
        IAS (kts)
      </Label>
      <Input id="speed" type="number" placeholder="120" className="font-mono" min={0} max={250} step={5} />
    </div>
}`,...f.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 w-40">
      <Label htmlFor="freq" className="text-xs uppercase tracking-wider text-muted-foreground">
        COM1 Frequency
      </Label>
      <Input id="freq" type="text" placeholder="121.500" className="font-mono" maxLength={7} />
    </div>
}`,...g.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 w-32">
      <Label htmlFor="squawk" className="text-xs uppercase tracking-wider text-muted-foreground">
        Squawk Code
      </Label>
      <Input id="squawk" type="text" placeholder="1200" className="font-mono" maxLength={4} pattern="[0-7]{4}" />
    </div>
}`,...N.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-8">
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">INPUT TYPES</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Text</Label>
            <Input type="text" placeholder="Text input" className="w-40" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
            <Input type="email" placeholder="email@skynet.mil" className="w-40" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
            <Input type="password" placeholder="Password" className="w-40" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Number</Label>
            <Input type="number" placeholder="0" className="w-40 font-mono" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg text-foreground mb-4">STATES</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Default</Label>
            <Input type="text" placeholder="Default" className="w-40" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Disabled</Label>
            <Input type="text" placeholder="Disabled" disabled className="w-40" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Error</Label>
            <Input type="text" defaultValue="INVALID" error className="w-40" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg text-foreground mb-4">AVIATION DATA ENTRY</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Tail #</Label>
            <Input type="text" placeholder="N172SP" className="w-28 font-mono uppercase" maxLength={7} />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">ALT (ft)</Label>
            <Input type="number" placeholder="3500" className="w-24 font-mono" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">HDG (deg)</Label>
            <Input type="number" placeholder="270" className="w-20 font-mono" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">IAS (kts)</Label>
            <Input type="number" placeholder="120" className="w-20 font-mono" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">COM1</Label>
            <Input type="text" placeholder="121.500" className="w-24 font-mono" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Squawk</Label>
            <Input type="text" placeholder="1200" className="w-20 font-mono" maxLength={4} />
          </div>
        </div>
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...h.parameters?.docs?.source}}};const D=["Default","WithPlaceholder","TypeEmail","TypePassword","TypeNumber","Disabled","WithError","WithLabel","WithLabelAndError","TailNumber","AltitudeInput","HeadingInput","SpeedInput","FrequencyInput","TransponderCode","AllVariants"];export{h as AllVariants,x as AltitudeInput,s as Default,o as Disabled,g as FrequencyInput,u as HeadingInput,f as SpeedInput,m as TailNumber,N as TransponderCode,l as TypeEmail,c as TypeNumber,n as TypePassword,d as WithError,p as WithLabel,i as WithLabelAndError,t as WithPlaceholder,D as __namedExportsOrder,A as default};
