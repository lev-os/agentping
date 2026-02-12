import{j as e}from"./iframe-CzJrb7DT.js";import{c as a}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function d(n){return n>=90?"bg-red-500":n>=70?"bg-yellow-500":"bg-cyan-500"}function x(n){return n>=90?"text-red-400":n>=70?"text-yellow-400":"text-cyan-400"}function l({resources:n,className:i}){return e.jsxs("div",{className:a("border border-cyan-500/20 bg-black/60 rounded-lg p-4",i),children:[e.jsx("div",{className:"text-xs font-mono text-cyan-400 uppercase tracking-wider mb-4",children:"Resource Monitor"}),e.jsx("div",{className:"space-y-4",children:n.map((r,u)=>{const t=r.max>0?Math.min(r.current/r.max*100,100):0,m=d(t),c=x(t);return e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-baseline justify-between mb-1.5",children:[e.jsx("span",{className:"text-xs font-mono text-gray-300",children:r.label}),e.jsxs("div",{className:"flex items-baseline gap-1.5",children:[e.jsx("span",{className:a("text-sm font-mono font-bold tabular-nums",c),children:r.current.toLocaleString()}),e.jsxs("span",{className:"text-[10px] font-mono text-cyan-500/40",children:["/ ",r.max.toLocaleString()," ",r.unit]})]})]}),e.jsx("div",{className:"h-2 rounded-full bg-cyan-500/10 overflow-hidden",children:e.jsx("div",{className:a("h-full rounded-full transition-all duration-500",m),style:{width:`${t}%`,opacity:.8}})}),e.jsx("div",{className:"flex justify-end mt-0.5",children:e.jsxs("span",{className:a("text-[10px] font-mono tabular-nums",c),children:[t.toFixed(1),"%"]})})]},u)})})]})}try{l.displayName="ResourceView",l.__docgenInfo={description:"ResourceView - Detailed resource monitor with bars",displayName:"ResourceView",props:{resources:{defaultValue:null,description:"",name:"resources",required:!0,type:{name:"ResourceEntry[]"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const y={title:"Migrations/WebUI/Root/ResourceView",component:l,parameters:{layout:"centered"},tags:["autodocs"]},s={args:{resources:[{label:"CPU",current:67,max:100,unit:"%"},{label:"Memory",current:12400,max:16384,unit:"MB"},{label:"Disk",current:380,max:512,unit:"GB"},{label:"Network",current:245,max:1e3,unit:"Mbps"}]}},o={args:{resources:[{label:"CPU",current:95,max:100,unit:"%"},{label:"Memory",current:15800,max:16384,unit:"MB"},{label:"Disk",current:490,max:512,unit:"GB"},{label:"GPU",current:88,max:100,unit:"%"}]}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    resources: [{
      label: "CPU",
      current: 67,
      max: 100,
      unit: "%"
    }, {
      label: "Memory",
      current: 12400,
      max: 16384,
      unit: "MB"
    }, {
      label: "Disk",
      current: 380,
      max: 512,
      unit: "GB"
    }, {
      label: "Network",
      current: 245,
      max: 1000,
      unit: "Mbps"
    }]
  }
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    resources: [{
      label: "CPU",
      current: 95,
      max: 100,
      unit: "%"
    }, {
      label: "Memory",
      current: 15800,
      max: 16384,
      unit: "MB"
    }, {
      label: "Disk",
      current: 490,
      max: 512,
      unit: "GB"
    }, {
      label: "GPU",
      current: 88,
      max: 100,
      unit: "%"
    }]
  }
}`,...o.parameters?.docs?.source}}};const g=["Default","CriticalLoad"];export{o as CriticalLoad,s as Default,g as __namedExportsOrder,y as default};
