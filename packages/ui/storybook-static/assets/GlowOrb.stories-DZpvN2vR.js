import{j as e}from"./iframe-rZoXeK5l.js";import{G as n}from"./glow-orb-BkGXUZfb.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B_jtOnfb.js";import"./utils-CDN07tui.js";const h={title:"Components/GlowOrb",component:n,parameters:{layout:"centered",docs:{description:{component:"Atmospheric blurry circle component for creating ambient background effects. Supports blend modes and pulse animations."}}},tags:["autodocs"],argTypes:{size:{control:"select",options:["sm","md","lg","xl","2xl"],description:"Size of the glow orb"},color:{control:"select",options:["cyan","purple","yellow","green","red","orange"],description:"Color of the glow"},intensity:{control:"select",options:["subtle","low","medium","high","intense"],description:"Opacity/intensity level"},blur:{control:"select",options:["sm","md","lg","xl","2xl"],description:"Blur amount"},blendMode:{control:"select",options:["normal","screen","overlay","soft-light","color-dodge","multiply"],description:"CSS blend mode"},pulse:{control:"boolean",description:"Enable pulse animation"},pulseDuration:{control:{type:"range",min:4,max:24,step:2},description:"Pulse animation duration in seconds"}},decorators:[r=>e.jsxs("div",{className:"relative w-[600px] h-[400px] bg-background border border-border overflow-hidden",children:[e.jsx(r,{}),e.jsx("div",{className:"absolute inset-0 flex items-center justify-center pointer-events-none",children:e.jsx("span",{className:"font-mono text-xs text-muted-foreground",children:"PREVIEW CONTAINER"})})]})]},o={args:{size:"lg",color:"cyan",intensity:"medium",blur:"lg",x:"50%",y:"50%",blendMode:"screen"}},s={args:{size:"xl",color:"cyan",intensity:"medium",blur:"xl",x:"50%",y:"50%",blendMode:"screen"}},l={args:{size:"xl",color:"purple",intensity:"medium",blur:"xl",x:"50%",y:"50%",blendMode:"screen"}},t={args:{size:"lg",color:"yellow",intensity:"low",blur:"lg",x:"50%",y:"50%",blendMode:"screen"}},i={args:{size:"xl",color:"cyan",intensity:"medium",blur:"xl",x:"50%",y:"50%",blendMode:"screen",pulse:!0,pulseDuration:8}},a={args:{size:"lg",color:"cyan",intensity:"low",blur:"lg",x:"50%",y:"50%",blendMode:"color-dodge"}},c={render:()=>e.jsxs(e.Fragment,{children:[e.jsx(n,{color:"cyan",size:"xl",intensity:"medium",blur:"xl",x:"30%",y:"40%",blendMode:"screen"}),e.jsx(n,{color:"purple",size:"lg",intensity:"low",blur:"lg",x:"70%",y:"60%",blendMode:"screen"}),e.jsx(n,{color:"yellow",size:"md",intensity:"subtle",blur:"lg",x:"50%",y:"30%",blendMode:"color-dodge"})]})},d={render:()=>e.jsxs(e.Fragment,{children:[e.jsx(n,{color:"cyan",size:"2xl",intensity:"low",blur:"2xl",x:"25%",y:"35%",blendMode:"screen",pulse:!0,pulseDuration:12}),e.jsx(n,{color:"purple",size:"xl",intensity:"subtle",blur:"2xl",x:"75%",y:"65%",blendMode:"screen",pulse:!0,pulseDuration:16})]})},u={render:()=>e.jsx("div",{className:"flex gap-4",children:["subtle","low","medium","high","intense"].map((r,p)=>e.jsxs("div",{className:"relative w-24 h-24",children:[e.jsx(n,{color:"cyan",size:"md",intensity:r,blur:"md",x:"50%",y:"50%"}),e.jsx("span",{className:"absolute bottom-0 left-0 right-0 text-center font-mono text-[10px] text-muted-foreground",children:r})]},r))}),decorators:[r=>e.jsx("div",{className:"relative w-[600px] h-[200px] bg-background border border-border overflow-hidden flex items-center justify-center",children:e.jsx(r,{})})]},m={render:()=>e.jsx("div",{className:"grid grid-cols-3 gap-8",children:["cyan","purple","yellow","green","red","orange"].map(r=>e.jsxs("div",{className:"relative w-32 h-32",children:[e.jsx(n,{color:r,size:"lg",intensity:"medium",blur:"lg",x:"50%",y:"50%",blendMode:"screen"}),e.jsx("span",{className:"absolute bottom-2 left-0 right-0 text-center font-mono text-[10px] text-muted-foreground",children:r})]},r))}),decorators:[r=>e.jsx("div",{className:"relative w-[500px] h-[300px] bg-background border border-border overflow-hidden flex items-center justify-center",children:e.jsx(r,{})})]};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    size: "lg",
    color: "cyan",
    intensity: "medium",
    blur: "lg",
    x: "50%",
    y: "50%",
    blendMode: "screen"
  }
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    size: "xl",
    color: "cyan",
    intensity: "medium",
    blur: "xl",
    x: "50%",
    y: "50%",
    blendMode: "screen"
  }
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    size: "xl",
    color: "purple",
    intensity: "medium",
    blur: "xl",
    x: "50%",
    y: "50%",
    blendMode: "screen"
  }
}`,...l.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    size: "lg",
    color: "yellow",
    intensity: "low",
    blur: "lg",
    x: "50%",
    y: "50%",
    blendMode: "screen"
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    size: "xl",
    color: "cyan",
    intensity: "medium",
    blur: "xl",
    x: "50%",
    y: "50%",
    blendMode: "screen",
    pulse: true,
    pulseDuration: 8
  }
}`,...i.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    size: "lg",
    color: "cyan",
    intensity: "low",
    blur: "lg",
    x: "50%",
    y: "50%",
    blendMode: "color-dodge"
  }
}`,...a.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <>
      <GlowOrb color="cyan" size="xl" intensity="medium" blur="xl" x="30%" y="40%" blendMode="screen" />
      <GlowOrb color="purple" size="lg" intensity="low" blur="lg" x="70%" y="60%" blendMode="screen" />
      <GlowOrb color="yellow" size="md" intensity="subtle" blur="lg" x="50%" y="30%" blendMode="color-dodge" />
    </>
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <>
      <GlowOrb color="cyan" size="2xl" intensity="low" blur="2xl" x="25%" y="35%" blendMode="screen" pulse pulseDuration={12} />
      <GlowOrb color="purple" size="xl" intensity="subtle" blur="2xl" x="75%" y="65%" blendMode="screen" pulse pulseDuration={16} />
    </>
}`,...d.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4">
      {["subtle", "low", "medium", "high", "intense"].map((intensity, i) => <div key={intensity} className="relative w-24 h-24">
          <GlowOrb color="cyan" size="md" intensity={intensity as "subtle" | "low" | "medium" | "high" | "intense"} blur="md" x="50%" y="50%" />
          <span className="absolute bottom-0 left-0 right-0 text-center font-mono text-[10px] text-muted-foreground">
            {intensity}
          </span>
        </div>)}
    </div>,
  decorators: [Story => <div className="relative w-[600px] h-[200px] bg-background border border-border overflow-hidden flex items-center justify-center">
        <Story />
      </div>]
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-3 gap-8">
      {["cyan", "purple", "yellow", "green", "red", "orange"].map(color => <div key={color} className="relative w-32 h-32">
          <GlowOrb color={color as "cyan" | "purple" | "yellow" | "green" | "red" | "orange"} size="lg" intensity="medium" blur="lg" x="50%" y="50%" blendMode="screen" />
          <span className="absolute bottom-2 left-0 right-0 text-center font-mono text-[10px] text-muted-foreground">
            {color}
          </span>
        </div>)}
    </div>,
  decorators: [Story => <div className="relative w-[500px] h-[300px] bg-background border border-border overflow-hidden flex items-center justify-center">
        <Story />
      </div>]
}`,...m.parameters?.docs?.source}}};const f=["Default","Cyan","Purple","Yellow","WithPulse","ColorDodge","MultipleOrbs","AnimatedComposition","IntensityLevels","AllColors"];export{m as AllColors,d as AnimatedComposition,a as ColorDodge,s as Cyan,o as Default,u as IntensityLevels,c as MultipleOrbs,l as Purple,i as WithPulse,t as Yellow,f as __namedExportsOrder,h as default};
