import{j as e}from"./iframe-CzJrb7DT.js";import{S as r}from"./shimmer-text-DznOLPYb.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B_jtOnfb.js";import"./utils-CDN07tui.js";import"./proxy-CWA1ba3P.js";const I={title:"Components/ShimmerText",component:r,parameters:{layout:"centered",backgrounds:{default:"dark"},docs:{description:{component:"Animated text with ethereal glow using layered text. Perfect for hero headlines."}}},tags:["autodocs"],argTypes:{size:{control:"select",options:["sm","md","lg","xl","2xl"],description:"Text size variant"},color:{control:"select",options:["cyan","purple","yellow","green","white"],description:"Base color theme for text and glow"},glow:{control:"boolean",description:"Enable glow effect"},glowSpeed:{control:{type:"range",min:6,max:30,step:1},description:"Glow animation speed (seconds) - higher = slower"},glowIntensity:{control:{type:"range",min:.3,max:2,step:.1},description:"Glow intensity - affects blur and offset distance"},glowBrightness:{control:{type:"range",min:.5,max:2,step:.1},description:"Glow brightness - affects opacity and lightness"},textShadow:{control:{type:"range",min:0,max:1,step:.1},description:"Text shadow intensity (0 = none)"}}},n={args:{children:"SKYNET DESIGN",size:"xl",color:"cyan",glow:!0,glowSpeed:12,glowIntensity:1}},o={args:{children:"POWER MODE",size:"xl",color:"cyan",glow:!0,glowSpeed:10,glowIntensity:1.5}},s={args:{children:"ATMOSPHERIC",size:"xl",color:"cyan",glow:!0,glowSpeed:20,glowIntensity:.8}},t={args:{children:"ENERGIZED",size:"xl",color:"cyan",glow:!0,glowSpeed:6,glowIntensity:1.2}},l={args:{children:"NEURAL ACTIVE",size:"xl",color:"purple",glow:!0,glowSpeed:14,glowIntensity:1}},a={args:{children:"CAUTION",size:"xl",color:"yellow",glow:!0,glowSpeed:12,glowIntensity:1}},c={args:{children:"ONLINE",size:"xl",color:"green",glow:!0,glowSpeed:12,glowIntensity:1}},i={args:{children:"PLAIN TEXT",size:"xl",color:"cyan",glow:!1}},d={args:{children:"MASSIVE",size:"2xl",color:"cyan",glow:!0,glowSpeed:16,glowIntensity:1.2}},m={args:{children:"COLOR DEMO"},render:()=>e.jsxs("div",{className:"flex flex-col items-center gap-16 py-8",children:[e.jsx(r,{size:"lg",color:"cyan",glowSpeed:12,children:"CYBER CYAN"}),e.jsx(r,{size:"lg",color:"purple",glowSpeed:14,children:"CYBER PURPLE"}),e.jsx(r,{size:"lg",color:"yellow",glowSpeed:12,children:"CYBER YELLOW"}),e.jsx(r,{size:"lg",color:"green",glowSpeed:12,children:"CYBER GREEN"}),e.jsx(r,{size:"lg",color:"white",glowSpeed:14,children:"PURE WHITE"})]}),parameters:{layout:"padded"}},p={args:{children:"SIZE DEMO"},render:()=>e.jsxs("div",{className:"flex flex-col items-center gap-14 py-8",children:[e.jsx(r,{size:"sm",color:"cyan",children:"SMALL"}),e.jsx(r,{size:"md",color:"cyan",children:"MEDIUM"}),e.jsx(r,{size:"lg",color:"cyan",children:"LARGE"}),e.jsx(r,{size:"xl",color:"cyan",children:"EXTRA LARGE"}),e.jsx(r,{size:"2xl",color:"cyan",children:"2X LARGE"})]}),parameters:{layout:"padded"}},g={args:{children:"INTENSITY DEMO"},render:()=>e.jsxs("div",{className:"flex flex-col items-center gap-16 py-8",children:[e.jsxs("div",{className:"text-center",children:[e.jsx("p",{className:"text-xs font-mono text-muted-foreground mb-6",children:"0.5 - Subtle"}),e.jsx(r,{size:"lg",color:"cyan",glowIntensity:.5,children:"SUBTLE GLOW"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("p",{className:"text-xs font-mono text-muted-foreground mb-6",children:"1.0 - Default"}),e.jsx(r,{size:"lg",color:"cyan",glowIntensity:1,children:"DEFAULT GLOW"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("p",{className:"text-xs font-mono text-muted-foreground mb-6",children:"1.5 - Intense"}),e.jsx(r,{size:"lg",color:"cyan",glowIntensity:1.5,children:"INTENSE GLOW"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("p",{className:"text-xs font-mono text-muted-foreground mb-6",children:"2.0 - Maximum"}),e.jsx(r,{size:"lg",color:"cyan",glowIntensity:2,children:"MAXIMUM GLOW"})]})]}),parameters:{layout:"padded"}},x={args:{children:"HERO DEMO"},render:()=>e.jsxs("div",{className:"text-center space-y-8 py-16 px-8",children:[e.jsx(r,{size:"2xl",color:"cyan",glowSpeed:14,glowIntensity:1.1,children:"SKYNET DESIGN SYSTEM"}),e.jsx("p",{className:"font-body text-xl text-muted-foreground max-w-2xl mx-auto",children:"Cyberpunk/Military Tactical Aesthetic for High-Performance Interfaces"})]}),parameters:{layout:"padded"}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    children: "SKYNET DESIGN",
    size: "xl",
    color: "cyan",
    glow: true,
    glowSpeed: 12,
    glowIntensity: 1
  }
}`,...n.parameters?.docs?.source},description:{story:"Default ethereal glow.",...n.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    children: "POWER MODE",
    size: "xl",
    color: "cyan",
    glow: true,
    glowSpeed: 10,
    glowIntensity: 1.5
  }
}`,...o.parameters?.docs?.source},description:{story:"Intense glow with higher intensity.",...o.parameters?.docs?.description}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: "ATMOSPHERIC",
    size: "xl",
    color: "cyan",
    glow: true,
    glowSpeed: 20,
    glowIntensity: 0.8
  }
}`,...s.parameters?.docs?.source},description:{story:"Slow, subtle atmospheric glow.",...s.parameters?.docs?.description}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    children: "ENERGIZED",
    size: "xl",
    color: "cyan",
    glow: true,
    glowSpeed: 6,
    glowIntensity: 1.2
  }
}`,...t.parameters?.docs?.source},description:{story:"Fast shimmer for energetic feel.",...t.parameters?.docs?.description}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: "NEURAL ACTIVE",
    size: "xl",
    color: "purple",
    glow: true,
    glowSpeed: 14,
    glowIntensity: 1
  }
}`,...l.parameters?.docs?.source},description:{story:"Purple ethereal variant.",...l.parameters?.docs?.description}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    children: "CAUTION",
    size: "xl",
    color: "yellow",
    glow: true,
    glowSpeed: 12,
    glowIntensity: 1
  }
}`,...a.parameters?.docs?.source},description:{story:"Yellow/gold warning aesthetic.",...a.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    children: "ONLINE",
    size: "xl",
    color: "green",
    glow: true,
    glowSpeed: 12,
    glowIntensity: 1
  }
}`,...c.parameters?.docs?.source},description:{story:"Green system active.",...c.parameters?.docs?.description}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    children: "PLAIN TEXT",
    size: "xl",
    color: "cyan",
    glow: false
  }
}`,...i.parameters?.docs?.source},description:{story:"No glow - plain text.",...i.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    children: "MASSIVE",
    size: "2xl",
    color: "cyan",
    glow: true,
    glowSpeed: 16,
    glowIntensity: 1.2
  }
}`,...d.parameters?.docs?.source},description:{story:"Extra large 2xl size.",...d.parameters?.docs?.description}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    children: "COLOR DEMO"
  },
  render: () => <div className="flex flex-col items-center gap-16 py-8">
      <ShimmerText size="lg" color="cyan" glowSpeed={12}>
        CYBER CYAN
      </ShimmerText>
      <ShimmerText size="lg" color="purple" glowSpeed={14}>
        CYBER PURPLE
      </ShimmerText>
      <ShimmerText size="lg" color="yellow" glowSpeed={12}>
        CYBER YELLOW
      </ShimmerText>
      <ShimmerText size="lg" color="green" glowSpeed={12}>
        CYBER GREEN
      </ShimmerText>
      <ShimmerText size="lg" color="white" glowSpeed={14}>
        PURE WHITE
      </ShimmerText>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...m.parameters?.docs?.source},description:{story:"All color variants.",...m.parameters?.docs?.description}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    children: "SIZE DEMO"
  },
  render: () => <div className="flex flex-col items-center gap-14 py-8">
      <ShimmerText size="sm" color="cyan">SMALL</ShimmerText>
      <ShimmerText size="md" color="cyan">MEDIUM</ShimmerText>
      <ShimmerText size="lg" color="cyan">LARGE</ShimmerText>
      <ShimmerText size="xl" color="cyan">EXTRA LARGE</ShimmerText>
      <ShimmerText size="2xl" color="cyan">2X LARGE</ShimmerText>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...p.parameters?.docs?.source},description:{story:"Size comparison.",...p.parameters?.docs?.description}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    children: "INTENSITY DEMO"
  },
  render: () => <div className="flex flex-col items-center gap-16 py-8">
      <div className="text-center">
        <p className="text-xs font-mono text-muted-foreground mb-6">0.5 - Subtle</p>
        <ShimmerText size="lg" color="cyan" glowIntensity={0.5}>
          SUBTLE GLOW
        </ShimmerText>
      </div>
      <div className="text-center">
        <p className="text-xs font-mono text-muted-foreground mb-6">1.0 - Default</p>
        <ShimmerText size="lg" color="cyan" glowIntensity={1.0}>
          DEFAULT GLOW
        </ShimmerText>
      </div>
      <div className="text-center">
        <p className="text-xs font-mono text-muted-foreground mb-6">1.5 - Intense</p>
        <ShimmerText size="lg" color="cyan" glowIntensity={1.5}>
          INTENSE GLOW
        </ShimmerText>
      </div>
      <div className="text-center">
        <p className="text-xs font-mono text-muted-foreground mb-6">2.0 - Maximum</p>
        <ShimmerText size="lg" color="cyan" glowIntensity={2.0}>
          MAXIMUM GLOW
        </ShimmerText>
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...g.parameters?.docs?.source},description:{story:"Glow intensity comparison.",...g.parameters?.docs?.description}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    children: "HERO DEMO"
  },
  render: () => <div className="text-center space-y-8 py-16 px-8">
      <ShimmerText size="2xl" color="cyan" glowSpeed={14} glowIntensity={1.1}>
        SKYNET DESIGN SYSTEM
      </ShimmerText>
      <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
        Cyberpunk/Military Tactical Aesthetic for High-Performance Interfaces
      </p>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...x.parameters?.docs?.source},description:{story:"Hero headline example.",...x.parameters?.docs?.description}}};const T=["Default","IntenseGlow","SlowAtmospheric","FastShimmer","PurpleEthereal","GoldenWarning","SystemActive","NoGlow","ExtraLarge","AllColors","AllSizes","GlowIntensityLevels","HeroExample"];export{m as AllColors,p as AllSizes,n as Default,d as ExtraLarge,t as FastShimmer,g as GlowIntensityLevels,a as GoldenWarning,x as HeroExample,o as IntenseGlow,i as NoGlow,l as PurpleEthereal,s as SlowAtmospheric,c as SystemActive,T as __namedExportsOrder,I as default};
