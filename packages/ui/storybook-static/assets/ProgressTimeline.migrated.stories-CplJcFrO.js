import{j as e}from"./iframe-rZoXeK5l.js";import{c as n}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function r({steps:a=[],className:l}){const o={completed:{dot:"bg-green-500 border-green-500",text:"text-green-400"},active:{dot:"bg-cyan-400 border-cyan-400 animate-pulse",text:"text-cyan-300"},pending:{dot:"bg-transparent border-cyan-500/30",text:"text-cyan-500/40"}};return e.jsx("div",{className:n("space-y-0",l),children:a.map((s,d)=>{const i=o[s.status];return e.jsxs("div",{className:"flex gap-3",children:[e.jsxs("div",{className:"flex flex-col items-center",children:[e.jsx("div",{className:n("w-3 h-3 rounded-full border-2",i.dot)}),d<a.length-1&&e.jsx("div",{className:"w-px flex-1 min-h-[24px] bg-cyan-500/10"})]}),e.jsxs("div",{className:"pb-4",children:[e.jsx("div",{className:n("text-xs font-mono",i.text),children:s.label}),s.description&&e.jsx("div",{className:"text-[10px] font-mono text-cyan-500/30 mt-0.5",children:s.description})]})]},s.id)})})}try{r.displayName="ProgressTimeline",r.__docgenInfo={description:"ProgressTimeline - Migrated from",displayName:"ProgressTimeline",props:{steps:{defaultValue:{value:"[]"},description:"",name:"steps",required:!1,type:{name:"ProgressStep[]"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const u={title:"Migrations/WebUI/Root/ProgressTimeline",component:r,parameters:{layout:"centered"},tags:["autodocs"]},t={args:{steps:[{id:"1",label:"Build",status:"completed",description:"Compiled successfully"},{id:"2",label:"Test",status:"completed",description:"42 tests passed"},{id:"3",label:"Deploy",status:"active",description:"Deploying to staging..."},{id:"4",label:"Verify",status:"pending"}]}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    steps: [{
      id: "1",
      label: "Build",
      status: "completed",
      description: "Compiled successfully"
    }, {
      id: "2",
      label: "Test",
      status: "completed",
      description: "42 tests passed"
    }, {
      id: "3",
      label: "Deploy",
      status: "active",
      description: "Deploying to staging..."
    }, {
      id: "4",
      label: "Verify",
      status: "pending"
    }]
  }
}`,...t.parameters?.docs?.source}}};const g=["Default"];export{t as Default,g as __namedExportsOrder,u as default};
