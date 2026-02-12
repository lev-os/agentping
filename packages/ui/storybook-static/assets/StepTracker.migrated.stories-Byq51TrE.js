import{j as t}from"./iframe-rZoXeK5l.js";import{c as s}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";const d={pending:"○",active:"●",completed:"✓",error:"✗"},i={pending:"text-cyan-500/30 border-cyan-500/20",active:"text-cyan-400 border-cyan-400",completed:"text-emerald-400 border-emerald-400",error:"text-red-400 border-red-400"},p={pending:"bg-cyan-500/15",active:"bg-cyan-400/40",completed:"bg-emerald-400/50",error:"bg-red-400/50"};function l({steps:a=[],className:c}){return t.jsxs("div",{className:s("border border-cyan-500/20 bg-black/60 rounded-lg p-4 font-mono",c),children:[a.length===0&&t.jsx("div",{className:"text-xs text-cyan-500/30",children:"No steps defined"}),a.map((e,o)=>t.jsxs("div",{className:"flex items-start gap-3",children:[t.jsxs("div",{className:"flex flex-col items-center",children:[t.jsx("span",{className:s("w-6 h-6 flex items-center justify-center rounded-full border text-xs",i[e.status]),children:d[e.status]}),o<a.length-1&&t.jsx("div",{className:s("w-px h-6 my-1",p[e.status])})]}),t.jsx("span",{className:s("text-sm pt-0.5",e.status==="active"?"text-cyan-100":e.status==="completed"?"text-emerald-300/80":e.status==="error"?"text-red-300/80":"text-cyan-500/50"),children:e.label})]},o))]})}try{l.displayName="StepTracker",l.__docgenInfo={description:"",displayName:"StepTracker",props:{steps:{defaultValue:{value:"[]"},description:"",name:"steps",required:!1,type:{name:"Step[]"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const b={title:"Migrations/WebUI/Root/StepTracker",component:l,parameters:{layout:"centered"},tags:["autodocs"]},r={args:{steps:[{label:"Initialize project",status:"completed"},{label:"Install dependencies",status:"completed"},{label:"Configure environment",status:"active"},{label:"Run migrations",status:"pending"},{label:"Deploy",status:"pending"}]}},n={args:{steps:[{label:"Build",status:"completed"},{label:"Test",status:"error"},{label:"Deploy",status:"pending"}]}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    steps: [{
      label: "Initialize project",
      status: "completed"
    }, {
      label: "Install dependencies",
      status: "completed"
    }, {
      label: "Configure environment",
      status: "active"
    }, {
      label: "Run migrations",
      status: "pending"
    }, {
      label: "Deploy",
      status: "pending"
    }]
  }
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    steps: [{
      label: "Build",
      status: "completed"
    }, {
      label: "Test",
      status: "error"
    }, {
      label: "Deploy",
      status: "pending"
    }]
  }
}`,...n.parameters?.docs?.source}}};const x=["Default","WithError"];export{r as Default,n as WithError,x as __namedExportsOrder,b as default};
