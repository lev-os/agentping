import{j as e,r as f}from"./iframe-rZoXeK5l.js";import{P as s}from"./progress-ChxuSrKe.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DJNgIyCh.js";import"./index-p5YmI0II.js";import"./index-fvHFeWab.js";import"./index-DBhjKPQa.js";import"./index-DqYXjM1N.js";import"./utils-CDN07tui.js";const R={title:"Components/Progress",component:s,parameters:{layout:"centered",docs:{description:{component:"A progress bar component with SKYNET cyberpunk styling. Features a glowing cyan-to-primary gradient with shadow effects."}}},tags:["autodocs"],argTypes:{value:{control:{type:"range",min:0,max:100},description:"The progress value (0-100)"},indicatorClassName:{control:"text",description:"Additional classes for the progress indicator"}}},r={args:{value:50,className:"w-[300px]"}},n={args:{value:0,className:"w-[300px]"}},t={args:{value:25,className:"w-[300px]"}},o={args:{value:50,className:"w-[300px]"}},c={args:{value:75,className:"w-[300px]"}},d={args:{value:100,className:"w-[300px]"}},l={args:{value:60,className:"w-[300px]",indicatorClassName:"bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_10px_#22c55e]"}},m={args:{value:85,className:"w-[300px]",indicatorClassName:"bg-gradient-to-r from-yellow-500 to-orange-400 shadow-[0_0_10px_#eab308]"}},i={args:{value:95,className:"w-[300px]",indicatorClassName:"bg-gradient-to-r from-red-500 to-rose-400 shadow-[0_0_10px_#ef4444]"}},y=()=>{const[a,v]=f.useState(0);return f.useEffect(()=>{const h=setInterval(()=>{v(N=>N>=100?0:N+2)},100);return()=>clearInterval(h)},[]),e.jsxs("div",{className:"w-[300px] space-y-2",children:[e.jsx(s,{value:a}),e.jsxs("div",{className:"flex justify-between text-xs font-mono text-muted-foreground",children:[e.jsx("span",{children:"LOADING..."}),e.jsxs("span",{children:[a,"%"]})]})]})},p={render:()=>e.jsx(y,{})},x={render:()=>e.jsxs("div",{className:"w-[400px] space-y-6",children:[e.jsx("h3",{className:"font-display text-lg text-foreground",children:"TRAINING METRICS"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx("span",{className:"text-muted-foreground",children:"EPISODE PROGRESS"}),e.jsx("span",{className:"font-mono text-primary",children:"73/100"})]}),e.jsx(s,{value:73})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx("span",{className:"text-muted-foreground",children:"LEVEL COMPLETION"}),e.jsx("span",{className:"font-mono text-primary",children:"5/35"})]}),e.jsx(s,{value:14})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx("span",{className:"text-muted-foreground",children:"SUCCESS RATE"}),e.jsx("span",{className:"font-mono text-primary",children:"89%"})]}),e.jsx(s,{value:89,indicatorClassName:"bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_10px_#22c55e]"})]})]})]}),parameters:{layout:"padded"}},u={render:()=>e.jsxs("div",{className:"w-[350px] space-y-4 p-4 border border-border bg-card/50",children:[e.jsx("h3",{className:"font-display text-sm text-primary",children:"SYSTEM RESOURCES"}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsxs("div",{className:"flex justify-between text-xs font-mono",children:[e.jsx("span",{className:"text-muted-foreground",children:"CPU"}),e.jsx("span",{className:"text-foreground",children:"45%"})]}),e.jsx(s,{value:45,className:"h-1"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsxs("div",{className:"flex justify-between text-xs font-mono",children:[e.jsx("span",{className:"text-muted-foreground",children:"MEMORY"}),e.jsx("span",{className:"text-foreground",children:"72%"})]}),e.jsx(s,{value:72,className:"h-1",indicatorClassName:"bg-gradient-to-r from-yellow-500 to-orange-400 shadow-[0_0_6px_#eab308]"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsxs("div",{className:"flex justify-between text-xs font-mono",children:[e.jsx("span",{className:"text-muted-foreground",children:"GPU"}),e.jsx("span",{className:"text-foreground",children:"91%"})]}),e.jsx(s,{value:91,className:"h-1",indicatorClassName:"bg-gradient-to-r from-red-500 to-rose-400 shadow-[0_0_6px_#ef4444]"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsxs("div",{className:"flex justify-between text-xs font-mono",children:[e.jsx("span",{className:"text-muted-foreground",children:"DISK"}),e.jsx("span",{className:"text-foreground",children:"23%"})]}),e.jsx(s,{value:23,className:"h-1",indicatorClassName:"bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_6px_#22c55e]"})]})]})]}),parameters:{layout:"padded"}},g={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 w-[300px]",children:[e.jsx("h3",{className:"font-display text-lg text-foreground",children:"PROGRESS VALUES"}),e.jsx("div",{className:"space-y-3",children:[0,25,50,75,100].map(a=>e.jsxs("div",{className:"space-y-1",children:[e.jsx("div",{className:"flex justify-between text-xs font-mono text-muted-foreground",children:e.jsxs("span",{children:[a,"%"]})}),e.jsx(s,{value:a})]},a))})]}),parameters:{layout:"padded"}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    value: 50,
    className: "w-[300px]"
  }
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    value: 0,
    className: "w-[300px]"
  }
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    value: 25,
    className: "w-[300px]"
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    value: 50,
    className: "w-[300px]"
  }
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    value: 75,
    className: "w-[300px]"
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    value: 100,
    className: "w-[300px]"
  }
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    value: 60,
    className: "w-[300px]",
    indicatorClassName: "bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_10px_#22c55e]"
  }
}`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    value: 85,
    className: "w-[300px]",
    indicatorClassName: "bg-gradient-to-r from-yellow-500 to-orange-400 shadow-[0_0_10px_#eab308]"
  }
}`,...m.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    value: 95,
    className: "w-[300px]",
    indicatorClassName: "bg-gradient-to-r from-red-500 to-rose-400 shadow-[0_0_10px_#ef4444]"
  }
}`,...i.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <AnimatedProgressDemo />
}`,...p.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[400px] space-y-6">
      <h3 className="font-display text-lg text-foreground">TRAINING METRICS</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">EPISODE PROGRESS</span>
            <span className="font-mono text-primary">73/100</span>
          </div>
          <Progress value={73} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">LEVEL COMPLETION</span>
            <span className="font-mono text-primary">5/35</span>
          </div>
          <Progress value={14} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">SUCCESS RATE</span>
            <span className="font-mono text-primary">89%</span>
          </div>
          <Progress value={89} indicatorClassName="bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_10px_#22c55e]" />
        </div>
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...x.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[350px] space-y-4 p-4 border border-border bg-card/50">
      <h3 className="font-display text-sm text-primary">SYSTEM RESOURCES</h3>

      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted-foreground">CPU</span>
            <span className="text-foreground">45%</span>
          </div>
          <Progress value={45} className="h-1" />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted-foreground">MEMORY</span>
            <span className="text-foreground">72%</span>
          </div>
          <Progress value={72} className="h-1" indicatorClassName="bg-gradient-to-r from-yellow-500 to-orange-400 shadow-[0_0_6px_#eab308]" />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted-foreground">GPU</span>
            <span className="text-foreground">91%</span>
          </div>
          <Progress value={91} className="h-1" indicatorClassName="bg-gradient-to-r from-red-500 to-rose-400 shadow-[0_0_6px_#ef4444]" />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted-foreground">DISK</span>
            <span className="text-foreground">23%</span>
          </div>
          <Progress value={23} className="h-1" indicatorClassName="bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_6px_#22c55e]" />
        </div>
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...u.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 w-[300px]">
      <h3 className="font-display text-lg text-foreground">PROGRESS VALUES</h3>
      <div className="space-y-3">
        {[0, 25, 50, 75, 100].map(value => <div key={value} className="space-y-1">
            <div className="flex justify-between text-xs font-mono text-muted-foreground">
              <span>{value}%</span>
            </div>
            <Progress value={value} />
          </div>)}
      </div>
    </div>,
  parameters: {
    layout: "padded"
  }
}`,...g.parameters?.docs?.source}}};const T=["Default","Empty","Quarter","Half","ThreeQuarters","Complete","CustomIndicator","WarningIndicator","CriticalIndicator","Animated","TrainingProgress","SystemHealth","AllValues"];export{g as AllValues,p as Animated,d as Complete,i as CriticalIndicator,l as CustomIndicator,r as Default,n as Empty,o as Half,t as Quarter,u as SystemHealth,c as ThreeQuarters,x as TrainingProgress,m as WarningIndicator,T as __namedExportsOrder,R as default};
