import{j as e}from"./iframe-rZoXeK5l.js";import{c as d}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function a({logs:o=[],className:s}){return e.jsx("div",{className:d("border border-border rounded-md overflow-hidden",s),children:e.jsxs("table",{className:"w-full text-sm",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-border bg-muted/50",children:[e.jsx("th",{className:"px-3 py-2 text-left font-medium text-muted-foreground",children:"Time"}),e.jsx("th",{className:"px-3 py-2 text-left font-medium text-muted-foreground",children:"Actor"}),e.jsx("th",{className:"px-3 py-2 text-left font-medium text-muted-foreground",children:"Action"}),e.jsx("th",{className:"px-3 py-2 text-left font-medium text-muted-foreground",children:"Resource"})]})}),e.jsx("tbody",{children:o.map(t=>e.jsxs("tr",{className:"border-b border-border last:border-0 hover:bg-muted/30",children:[e.jsx("td",{className:"px-3 py-2 text-muted-foreground whitespace-nowrap",children:t.timestamp}),e.jsx("td",{className:"px-3 py-2 text-foreground",children:t.actor}),e.jsx("td",{className:"px-3 py-2 text-foreground",children:t.action}),e.jsx("td",{className:"px-3 py-2 text-foreground",children:t.resource})]},t.id))})]})})}try{a.displayName="AuditLogViewer",a.__docgenInfo={description:"AuditLogViewer - Migrated from",displayName:"AuditLogViewer",props:{logs:{defaultValue:{value:"[]"},description:"",name:"logs",required:!1,type:{name:"AuditEntry[]"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const m={title:"Migrations/WebUI/AuditLogViewer",component:a,tags:["autodocs"]},r={args:{logs:[{id:"1",timestamp:"2025-01-15 14:32",actor:"admin@kingly.ai",action:"updated",resource:"agent/nova-7"},{id:"2",timestamp:"2025-01-15 14:30",actor:"system",action:"deployed",resource:"service/gateway"},{id:"3",timestamp:"2025-01-15 14:28",actor:"jsmith",action:"created",resource:"workflow/etl-pipeline"}]}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    logs: [{
      id: "1",
      timestamp: "2025-01-15 14:32",
      actor: "admin@kingly.ai",
      action: "updated",
      resource: "agent/nova-7"
    }, {
      id: "2",
      timestamp: "2025-01-15 14:30",
      actor: "system",
      action: "deployed",
      resource: "service/gateway"
    }, {
      id: "3",
      timestamp: "2025-01-15 14:28",
      actor: "jsmith",
      action: "created",
      resource: "workflow/etl-pipeline"
    }]
  }
}`,...r.parameters?.docs?.source}}};const l=["Default"];export{r as Default,l as __namedExportsOrder,m as default};
