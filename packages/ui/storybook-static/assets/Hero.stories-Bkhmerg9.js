import{j as e}from"./iframe-CzJrb7DT.js";import{H as r}from"./hero-DHkmmxBa.js";import{B as u}from"./button-D3q81IEX.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CDN07tui.js";import"./badge-HMrpZ3Xg.js";import"./index-B_jtOnfb.js";import"./shimmer-text-DznOLPYb.js";import"./proxy-CWA1ba3P.js";import"./glow-orb-BnHQjORS.js";import"./index-DiN5Zsj0.js";import"./index-Czr-OA3y.js";const w={title:"Recipes/Hero",component:r,parameters:{layout:"fullscreen",docs:{description:{component:"A full-width hero section with configurable background types. Uses grid pattern with blur orbs by default."}}},tags:["autodocs"],argTypes:{title:{control:"text",description:"Main headline text displayed with glow animation"},subtitle:{control:"text",description:"Secondary text below the headline"},version:{control:"text",description:"Optional version/status badge content"},titleSize:{control:"select",options:["md","lg","xl","2xl"],description:"Size variant for the headline"},bgType:{control:"select",options:["grid","shimmer","gradient","color","transparent"],description:"Background type - grid (default) shows grid pattern with blur orbs"},glowSpeed:{control:{type:"range",min:6,max:30,step:1},description:"Glow animation speed (seconds) - higher = slower"}}},t={args:{version:"v1.0.0 // OPERATIONAL",title:"SKYNET DESIGN SYSTEM",subtitle:"Cyberpunk/Military Tactical Aesthetic for High-Performance Mission Control Interfaces",features:[{label:"ZERO RADIUS",color:"cyan"},{label:"NEON GLOW",color:"purple"},{label:"GRID PATTERN",color:"yellow"},{label:"DARK MODE",color:"green"}],titleSize:"xl",bgType:"grid",glowSpeed:12}},n={args:{title:"GRID PATTERN",subtitle:"Grid lines with subtle blur orbs overlay",bgType:"grid",titleSize:"xl",glowSpeed:12}},o={args:{title:"SHIMMER EFFECT",subtitle:"Animated shimmer overlay with atmospheric orbs",bgType:"shimmer",titleSize:"xl",glowSpeed:12}},s={args:{title:"GRADIENT STYLE",subtitle:"Smooth gradient from primary to secondary colors",bgType:"gradient",titleSize:"xl",glowSpeed:12}},a={args:{title:"SOLID COLOR",subtitle:"Simple solid background color",bgType:"color",titleSize:"xl",glowSpeed:12}},i={args:{title:"TRANSPARENT",subtitle:"No background, just shimmer text and content",bgType:"transparent",titleSize:"xl",glowSpeed:12}},l={args:{version:"LAUNCHING NOW",title:"SOFIA AGENT",subtitle:"Self-Organizing Flight Intelligence Agent. The future of autonomous aviation.",features:[{label:"NEURAL CONTROL",color:"cyan"},{label:"REAL-TIME",color:"green"},{label:"MISSION READY",color:"purple"}],titleSize:"2xl",bgType:"grid",glowSpeed:14},render:m=>e.jsx(r,{...m,children:e.jsxs("div",{className:"flex flex-wrap justify-center gap-4 mt-4",children:[e.jsx(u,{size:"lg",children:"GET STARTED"}),e.jsx(u,{variant:"outline",size:"lg",children:"VIEW DOCS"})]})})},c={args:{version:"NEW FEATURE",title:"TACTICAL DASHBOARD",subtitle:"Real-time telemetry visualization with military-grade precision",features:[{label:"LIVE DATA",color:"green"},{label:"20HZ UPDATES",color:"cyan"}],titleSize:"lg",bgType:"grid",glowSpeed:10}},d={args:{version:"⚠ SYSTEM ALERT",title:"CRITICAL UPDATE",subtitle:"Emergency maintenance required. All systems standby.",features:[{label:"PRIORITY: HIGH",color:"red"},{label:"ETA: 2 HOURS",color:"yellow"}],titleSize:"lg",bgType:"grid"}},p={args:{title:"COMPARISON"},render:()=>e.jsxs("div",{className:"space-y-0 bg-background",children:[e.jsx(r,{title:"GRID",subtitle:"Default - grid pattern with blur orbs",bgType:"grid",titleSize:"lg",className:"border-none"}),e.jsx(r,{title:"SHIMMER",subtitle:"Animated shimmer with blur orbs",bgType:"shimmer",titleSize:"lg",className:"border-none"}),e.jsx(r,{title:"GRADIENT",subtitle:"Cyber gradient background",bgType:"gradient",titleSize:"lg",className:"border-none"}),e.jsx(r,{title:"COLOR",subtitle:"Solid color background",bgType:"color",titleSize:"lg",className:"border-none"}),e.jsx(r,{title:"TRANSPARENT",subtitle:"No background",bgType:"transparent",titleSize:"lg",className:"border-none"})]}),parameters:{layout:"fullscreen"}},g={args:{title:"SIZES"},render:()=>e.jsxs("div",{className:"space-y-12 bg-background py-8",children:[e.jsx(r,{title:"MEDIUM SIZE",titleSize:"md",bgType:"transparent",className:"border-none py-8"}),e.jsx(r,{title:"LARGE SIZE",titleSize:"lg",bgType:"transparent",className:"border-none py-8"}),e.jsx(r,{title:"EXTRA LARGE",titleSize:"xl",bgType:"transparent",className:"border-none py-8"}),e.jsx(r,{title:"2X LARGE",titleSize:"2xl",bgType:"transparent",className:"border-none py-8"})]}),parameters:{layout:"fullscreen"}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    version: 'v1.0.0 // OPERATIONAL',
    title: 'SKYNET DESIGN SYSTEM',
    subtitle: 'Cyberpunk/Military Tactical Aesthetic for High-Performance Mission Control Interfaces',
    features: [{
      label: 'ZERO RADIUS',
      color: 'cyan'
    }, {
      label: 'NEON GLOW',
      color: 'purple'
    }, {
      label: 'GRID PATTERN',
      color: 'yellow'
    }, {
      label: 'DARK MODE',
      color: 'green'
    }],
    titleSize: 'xl',
    bgType: 'grid',
    glowSpeed: 12
  }
}`,...t.parameters?.docs?.source},description:{story:"Default hero with grid background and blur orbs.",...t.parameters?.docs?.description}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'GRID PATTERN',
    subtitle: 'Grid lines with subtle blur orbs overlay',
    bgType: 'grid',
    titleSize: 'xl',
    glowSpeed: 12
  }
}`,...n.parameters?.docs?.source},description:{story:"Grid background - the default with visible grid pattern and blur orbs.",...n.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'SHIMMER EFFECT',
    subtitle: 'Animated shimmer overlay with atmospheric orbs',
    bgType: 'shimmer',
    titleSize: 'xl',
    glowSpeed: 12
  }
}`,...o.parameters?.docs?.source},description:{story:"Shimmer background with animated overlay.",...o.parameters?.docs?.description}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'GRADIENT STYLE',
    subtitle: 'Smooth gradient from primary to secondary colors',
    bgType: 'gradient',
    titleSize: 'xl',
    glowSpeed: 12
  }
}`,...s.parameters?.docs?.source},description:{story:"Gradient background - cyber gradient.",...s.parameters?.docs?.description}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'SOLID COLOR',
    subtitle: 'Simple solid background color',
    bgType: 'color',
    titleSize: 'xl',
    glowSpeed: 12
  }
}`,...a.parameters?.docs?.source},description:{story:"Solid color background.",...a.parameters?.docs?.description}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'TRANSPARENT',
    subtitle: 'No background, just shimmer text and content',
    bgType: 'transparent',
    titleSize: 'xl',
    glowSpeed: 12
  }
}`,...i.parameters?.docs?.source},description:{story:"Transparent background - just the content.",...i.parameters?.docs?.description}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    version: 'LAUNCHING NOW',
    title: 'SOFIA AGENT',
    subtitle: 'Self-Organizing Flight Intelligence Agent. The future of autonomous aviation.',
    features: [{
      label: 'NEURAL CONTROL',
      color: 'cyan'
    }, {
      label: 'REAL-TIME',
      color: 'green'
    }, {
      label: 'MISSION READY',
      color: 'purple'
    }],
    titleSize: '2xl',
    bgType: 'grid',
    glowSpeed: 14
  },
  render: args => <Hero {...args}>
      <div className='flex flex-wrap justify-center gap-4 mt-4'>
        <Button size='lg'>GET STARTED</Button>
        <Button variant='outline' size='lg'>
          VIEW DOCS
        </Button>
      </div>
    </Hero>
}`,...l.parameters?.docs?.source},description:{story:"Product launch hero with call-to-action buttons.",...l.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    version: 'NEW FEATURE',
    title: 'TACTICAL DASHBOARD',
    subtitle: 'Real-time telemetry visualization with military-grade precision',
    features: [{
      label: 'LIVE DATA',
      color: 'green'
    }, {
      label: '20HZ UPDATES',
      color: 'cyan'
    }],
    titleSize: 'lg',
    bgType: 'grid',
    glowSpeed: 10
  }
}`,...c.parameters?.docs?.source},description:{story:"Feature announcement with focused messaging.",...c.parameters?.docs?.description}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    version: '⚠ SYSTEM ALERT',
    title: 'CRITICAL UPDATE',
    subtitle: 'Emergency maintenance required. All systems standby.',
    features: [{
      label: 'PRIORITY: HIGH',
      color: 'red'
    }, {
      label: 'ETA: 2 HOURS',
      color: 'yellow'
    }],
    titleSize: 'lg',
    bgType: 'grid'
  }
}`,...d.parameters?.docs?.source},description:{story:"Error or warning state hero.",...d.parameters?.docs?.description}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'COMPARISON'
  },
  render: () => <div className='space-y-0 bg-background'>
      <Hero title='GRID' subtitle='Default - grid pattern with blur orbs' bgType='grid' titleSize='lg' className='border-none' />
      <Hero title='SHIMMER' subtitle='Animated shimmer with blur orbs' bgType='shimmer' titleSize='lg' className='border-none' />
      <Hero title='GRADIENT' subtitle='Cyber gradient background' bgType='gradient' titleSize='lg' className='border-none' />
      <Hero title='COLOR' subtitle='Solid color background' bgType='color' titleSize='lg' className='border-none' />
      <Hero title='TRANSPARENT' subtitle='No background' bgType='transparent' titleSize='lg' className='border-none' />
    </div>,
  parameters: {
    layout: 'fullscreen'
  }
}`,...p.parameters?.docs?.source},description:{story:"All background types comparison.",...p.parameters?.docs?.description}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'SIZES'
  },
  render: () => <div className='space-y-12 bg-background py-8'>
      <Hero title='MEDIUM SIZE' titleSize='md' bgType='transparent' className='border-none py-8' />
      <Hero title='LARGE SIZE' titleSize='lg' bgType='transparent' className='border-none py-8' />
      <Hero title='EXTRA LARGE' titleSize='xl' bgType='transparent' className='border-none py-8' />
      <Hero title='2X LARGE' titleSize='2xl' bgType='transparent' className='border-none py-8' />
    </div>,
  parameters: {
    layout: 'fullscreen'
  }
}`,...g.parameters?.docs?.source},description:{story:"Different title sizes comparison.",...g.parameters?.docs?.description}}};const z=["Default","GridBackground","ShimmerBackground","GradientBackground","ColorBackground","TransparentBackground","ProductLaunch","FeatureAnnouncement","AlertState","AllBackgroundTypes","TitleSizes"];export{d as AlertState,p as AllBackgroundTypes,a as ColorBackground,t as Default,c as FeatureAnnouncement,s as GradientBackground,n as GridBackground,l as ProductLaunch,o as ShimmerBackground,g as TitleSizes,i as TransparentBackground,z as __namedExportsOrder,w as default};
