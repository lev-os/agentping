import{j as t}from"./iframe-rZoXeK5l.js";import{c as m}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function e({label:s,value:n,color:l}){return t.jsxs("div",{className:"text-center",children:[t.jsx("div",{className:"text-sm text-white/50 mb-2",children:s}),t.jsx("div",{className:"text-3xl font-bold",style:{color:l},children:n})]})}function o({dashboards:s,className:n}){const l=s.length,i=s.filter(a=>a.status.status==="online").length,d=s.reduce((a,u)=>a+u.status.restartAttempts,0),c=s.filter(a=>a.status.status==="failed").length;return t.jsxs("div",{className:m("grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8 p-4 bg-white/[0.02] rounded-lg border border-white/5",n),children:[t.jsx(e,{label:"Total Dashboards",value:l,color:"#3b82f6"}),t.jsx(e,{label:"Online",value:i,color:"#22c55e"}),t.jsx(e,{label:"Total Restarts",value:d,color:"#f59e0b"}),t.jsx(e,{label:"Failed",value:c,color:"#ef4444"})]})}try{o.displayName="DmAnalyticsPanel",o.__docgenInfo={description:"DmAnalyticsPanel - Migrated from dashboard-manager-ui",displayName:"DmAnalyticsPanel",props:{dashboards:{defaultValue:null,description:"",name:"dashboards",required:!0,type:{name:"Dashboard[]"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const g={title:"Migrations/DashboardManager/AnalyticsPanel",component:o,parameters:{layout:"padded"},tags:["autodocs"]},r={args:{dashboards:[{status:{status:"online",restartAttempts:0}},{status:{status:"online",restartAttempts:2}},{status:{status:"failed",restartAttempts:5}},{status:{status:"stopped",restartAttempts:0}}]}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    dashboards: [{
      status: {
        status: "online",
        restartAttempts: 0
      }
    }, {
      status: {
        status: "online",
        restartAttempts: 2
      }
    }, {
      status: {
        status: "failed",
        restartAttempts: 5
      }
    }, {
      status: {
        status: "stopped",
        restartAttempts: 0
      }
    }]
  }
}`,...r.parameters?.docs?.source}}};const h=["Default"];export{r as Default,h as __namedExportsOrder,g as default};
