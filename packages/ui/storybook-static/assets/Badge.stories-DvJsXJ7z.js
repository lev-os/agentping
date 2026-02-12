import{j as e}from"./iframe-rZoXeK5l.js";import{B as a}from"./badge-G0y1RK3D.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B_jtOnfb.js";import"./utils-CDN07tui.js";const L={title:"Components/Badge",component:a,parameters:{layout:"centered",docs:{description:{component:"A badge component with SKYNET cyberpunk styling. Features monospace typography, uppercase text, and color-coded variants for status indication."}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","secondary","success","warning","destructive","outline","ghost"],description:"The visual style variant"}}},r={args:{children:"ACTIVE",variant:"default"}},n={args:{children:"STANDBY",variant:"secondary"}},t={args:{children:"ONLINE",variant:"success"}},d={args:{children:"CAUTION",variant:"warning"}},c={args:{children:"CRITICAL",variant:"destructive"}},i={args:{children:"NEUTRAL",variant:"outline"}},l={args:{children:"DISABLED",variant:"ghost"}},o={render:()=>e.jsxs("div",{className:"flex flex-col gap-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"font-display text-lg text-foreground mb-4",children:"SYSTEM STATUS"}),e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsx(a,{variant:"success",children:"OPERATIONAL"}),e.jsx(a,{variant:"warning",children:"MAINTENANCE"}),e.jsx(a,{variant:"destructive",children:"OFFLINE"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-display text-lg text-foreground mb-4",children:"MISSION STATUS"}),e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsx(a,{variant:"default",children:"IN PROGRESS"}),e.jsx(a,{variant:"success",children:"COMPLETED"}),e.jsx(a,{variant:"warning",children:"PENDING"}),e.jsx(a,{variant:"destructive",children:"ABORTED"})]})]})]}),parameters:{layout:"padded"}},g={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("h3",{className:"font-display text-lg text-foreground",children:"FLIGHT PHASES"}),e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsx(a,{variant:"secondary",children:"TAXI"}),e.jsx(a,{variant:"default",children:"TAKEOFF"}),e.jsx(a,{variant:"success",children:"CRUISE"}),e.jsx(a,{variant:"warning",children:"APPROACH"}),e.jsx(a,{variant:"default",children:"LANDING"})]})]}),parameters:{layout:"padded"}},m={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("h3",{className:"font-display text-lg text-foreground",children:"CURRICULUM LEVELS"}),e.jsx("div",{className:"grid grid-cols-3 gap-2 max-w-md",children:["LVL 01","LVL 02","LVL 03","LVL 04","LVL 05","LVL 06"].map((v,s)=>e.jsxs(a,{variant:s<3?"success":s<5?"default":"outline",children:[v," ",s<3?"COMPLETE":s<5?"ACTIVE":"LOCKED"]},v))})]}),parameters:{layout:"padded"}},p={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("h3",{className:"font-display text-lg text-foreground",children:"ALERT LEVELS"}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(a,{variant:"success",children:"CONDITION GREEN"}),e.jsx("span",{className:"text-sm text-muted-foreground",children:"All systems nominal"})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(a,{variant:"warning",children:"CONDITION YELLOW"}),e.jsx("span",{className:"text-sm text-muted-foreground",children:"Elevated awareness"})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(a,{variant:"destructive",children:"CONDITION RED"}),e.jsx("span",{className:"text-sm text-muted-foreground",children:"Emergency protocols active"})]})]})]}),parameters:{layout:"padded"}},x={render:()=>e.jsxs("div",{className:"flex flex-col gap-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"font-display text-lg text-foreground mb-4",children:"ALL VARIANTS"}),e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsx(a,{variant:"default",children:"DEFAULT"}),e.jsx(a,{variant:"secondary",children:"SECONDARY"}),e.jsx(a,{variant:"success",children:"SUCCESS"}),e.jsx(a,{variant:"warning",children:"WARNING"}),e.jsx(a,{variant:"destructive",children:"DESTRUCTIVE"}),e.jsx(a,{variant:"outline",children:"OUTLINE"}),e.jsx(a,{variant:"ghost",children:"GHOST"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-display text-lg text-foreground mb-4",children:"IN CONTEXT"}),e.jsxs("div",{className:"flex items-center gap-4 p-4 border border-border bg-card/50",children:[e.jsx("span",{className:"font-mono text-sm text-foreground",children:"SOFIA v2.4.1"}),e.jsx(a,{variant:"success",children:"STABLE"}),e.jsx(a,{variant:"default",children:"PPO"}),e.jsx(a,{variant:"secondary",children:"AWBC"})]})]})]}),parameters:{layout:"padded"}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    children: "ACTIVE",
    variant: "default"
  }
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    children: "STANDBY",
    variant: "secondary"
  }
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    children: "ONLINE",
    variant: "success"
  }
}`,...t.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    children: "CAUTION",
    variant: "warning"
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    children: "CRITICAL",
    variant: "destructive"
  }
}`,...c.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    children: "NEUTRAL",
    variant: "outline"
  }
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: "DISABLED",
    variant: "ghost"
  }
}`,...l.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">SYSTEM STATUS</h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="success">OPERATIONAL</Badge>
          <Badge variant="warning">MAINTENANCE</Badge>
          <Badge variant="destructive">OFFLINE</Badge>
        </div>
      </div>
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">MISSION STATUS</h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">IN PROGRESS</Badge>
          <Badge variant="success">COMPLETED</Badge>
          <Badge variant="warning">PENDING</Badge>
          <Badge variant="destructive">ABORTED</Badge>
        </div>
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...o.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <h3 className="font-display text-lg text-foreground">FLIGHT PHASES</h3>
      <div className="flex flex-wrap gap-3">
        <Badge variant="secondary">TAXI</Badge>
        <Badge variant="default">TAKEOFF</Badge>
        <Badge variant="success">CRUISE</Badge>
        <Badge variant="warning">APPROACH</Badge>
        <Badge variant="default">LANDING</Badge>
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...g.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <h3 className="font-display text-lg text-foreground">CURRICULUM LEVELS</h3>
      <div className="grid grid-cols-3 gap-2 max-w-md">
        {["LVL 01", "LVL 02", "LVL 03", "LVL 04", "LVL 05", "LVL 06"].map((level, i) => <Badge key={level} variant={i < 3 ? "success" : i < 5 ? "default" : "outline"}>
            {level} {i < 3 ? "COMPLETE" : i < 5 ? "ACTIVE" : "LOCKED"}
          </Badge>)}
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <h3 className="font-display text-lg text-foreground">ALERT LEVELS</h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Badge variant="success">CONDITION GREEN</Badge>
          <span className="text-sm text-muted-foreground">All systems nominal</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="warning">CONDITION YELLOW</Badge>
          <span className="text-sm text-muted-foreground">Elevated awareness</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="destructive">CONDITION RED</Badge>
          <span className="text-sm text-muted-foreground">Emergency protocols active</span>
        </div>
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...p.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">ALL VARIANTS</h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">DEFAULT</Badge>
          <Badge variant="secondary">SECONDARY</Badge>
          <Badge variant="success">SUCCESS</Badge>
          <Badge variant="warning">WARNING</Badge>
          <Badge variant="destructive">DESTRUCTIVE</Badge>
          <Badge variant="outline">OUTLINE</Badge>
          <Badge variant="ghost">GHOST</Badge>
        </div>
      </div>
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">IN CONTEXT</h3>
        <div className="flex items-center gap-4 p-4 border border-border bg-card/50">
          <span className="font-mono text-sm text-foreground">SOFIA v2.4.1</span>
          <Badge variant="success">STABLE</Badge>
          <Badge variant="default">PPO</Badge>
          <Badge variant="secondary">AWBC</Badge>
        </div>
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...x.parameters?.docs?.source}}};const S=["Default","Secondary","Success","Warning","Destructive","Outline","Ghost","StatusIndicators","FlightPhases","TrainingLevels","AlertLevels","AllVariants"];export{p as AlertLevels,x as AllVariants,r as Default,c as Destructive,g as FlightPhases,l as Ghost,i as Outline,n as Secondary,o as StatusIndicators,t as Success,m as TrainingLevels,d as Warning,S as __namedExportsOrder,L as default};
