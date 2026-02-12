import{j as e}from"./iframe-CzJrb7DT.js";import{B as r}from"./button-D3q81IEX.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DiN5Zsj0.js";import"./index-Czr-OA3y.js";import"./index-B_jtOnfb.js";import"./utils-CDN07tui.js";const S={title:"Components/Button",component:r,parameters:{layout:"centered",docs:{description:{component:"A button component with SKYNET cyberpunk styling. Features sharp edges, glow effects, and multiple variants."}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","destructive","outline","secondary","ghost","link"],description:"The visual style variant"},size:{control:"select",options:["default","sm","lg","icon"],description:"The size of the button"},asChild:{control:"boolean",description:"Render as child element for composition"}}},a={args:{children:"ENGAGE",variant:"default",size:"default"}},t={args:{children:"STANDBY",variant:"secondary"}},n={args:{children:"ABORT MISSION",variant:"destructive"}},s={args:{children:"CONFIGURE",variant:"outline"}},o={args:{children:"DISMISS",variant:"ghost"}},i={args:{children:"VIEW DETAILS",variant:"link"}},c={args:{children:"CONFIRM",size:"sm"}},l={args:{children:"INITIALIZE SYSTEM",size:"lg"}},d={render:()=>e.jsxs("div",{className:"flex flex-col gap-8",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"font-display text-lg text-foreground mb-4",children:"VARIANTS"}),e.jsxs("div",{className:"flex flex-wrap gap-4",children:[e.jsx(r,{variant:"default",children:"DEFAULT"}),e.jsx(r,{variant:"secondary",children:"SECONDARY"}),e.jsx(r,{variant:"destructive",children:"DESTRUCTIVE"}),e.jsx(r,{variant:"outline",children:"OUTLINE"}),e.jsx(r,{variant:"ghost",children:"GHOST"}),e.jsx(r,{variant:"link",children:"LINK"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-display text-lg text-foreground mb-4",children:"SIZES"}),e.jsxs("div",{className:"flex flex-wrap items-center gap-4",children:[e.jsx(r,{size:"sm",children:"SMALL"}),e.jsx(r,{size:"default",children:"DEFAULT"}),e.jsx(r,{size:"lg",children:"LARGE"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-display text-lg text-foreground mb-4",children:"STATES"}),e.jsxs("div",{className:"flex flex-wrap gap-4",children:[e.jsx(r,{children:"ENABLED"}),e.jsx(r,{disabled:!0,children:"DISABLED"})]})]})]}),parameters:{layout:"padded"}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    children: "ENGAGE",
    variant: "default",
    size: "default"
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    children: "STANDBY",
    variant: "secondary"
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    children: "ABORT MISSION",
    variant: "destructive"
  }
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: "CONFIGURE",
    variant: "outline"
  }
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    children: "DISMISS",
    variant: "ghost"
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    children: "VIEW DETAILS",
    variant: "link"
  }
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    children: "CONFIRM",
    size: "sm"
  }
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: "INITIALIZE SYSTEM",
    size: "lg"
  }
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-8">
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">VARIANTS</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">DEFAULT</Button>
          <Button variant="secondary">SECONDARY</Button>
          <Button variant="destructive">DESTRUCTIVE</Button>
          <Button variant="outline">OUTLINE</Button>
          <Button variant="ghost">GHOST</Button>
          <Button variant="link">LINK</Button>
        </div>
      </div>
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">SIZES</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">SMALL</Button>
          <Button size="default">DEFAULT</Button>
          <Button size="lg">LARGE</Button>
        </div>
      </div>
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">STATES</h3>
        <div className="flex flex-wrap gap-4">
          <Button>ENABLED</Button>
          <Button disabled>DISABLED</Button>
        </div>
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...d.parameters?.docs?.source}}};const f=["Default","Secondary","Destructive","Outline","Ghost","Link","Small","Large","AllVariants"];export{d as AllVariants,a as Default,n as Destructive,o as Ghost,l as Large,i as Link,s as Outline,t as Secondary,c as Small,f as __namedExportsOrder,S as default};
