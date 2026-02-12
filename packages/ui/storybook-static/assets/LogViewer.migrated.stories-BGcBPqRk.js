import{r as c,j as t}from"./iframe-rZoXeK5l.js";import{c as n}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function o({logs:r,allowSearch:i=!0,className:l}){const[s,d]=c.useState(""),m=s?r.filter(e=>e.message.toLowerCase().includes(s.toLowerCase())):r;return t.jsxs("div",{className:n("flex flex-col border border-border rounded-md overflow-hidden",l),children:[i&&t.jsx("input",{value:s,onChange:e=>d(e.target.value),placeholder:"Filter logs...",className:"px-3 py-2 text-xs bg-muted/50 border-b border-border text-foreground outline-none placeholder:text-muted-foreground"}),t.jsx("div",{className:"font-mono text-xs overflow-auto max-h-72 p-2",children:m.map(e=>t.jsxs("div",{className:"flex gap-2 py-0.5",children:[t.jsx("span",{className:"text-muted-foreground shrink-0",children:e.timestamp}),t.jsxs("span",{className:n("shrink-0 w-12",e.level==="error"?"text-red-400":e.level==="warn"?"text-amber-400":"text-muted-foreground"),children:["[",e.level,"]"]}),t.jsx("span",{className:"text-foreground",children:e.message})]},e.id))})]})}try{o.displayName="LogViewer",o.__docgenInfo={description:"LogViewer - Migrated from",displayName:"LogViewer",props:{logs:{defaultValue:null,description:"",name:"logs",required:!0,type:{name:"LogViewerEntry[]"}},allowSearch:{defaultValue:{value:"true"},description:"",name:"allowSearch",required:!1,type:{name:"boolean"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const f={title:"Migrations/WebUI/LogViewer",component:o,tags:["autodocs"]},a={args:{logs:[{id:"1",timestamp:"09:00:00",level:"info",message:"System initialized"},{id:"2",timestamp:"09:00:05",level:"info",message:"Loading configuration"},{id:"3",timestamp:"09:00:12",level:"warn",message:"Deprecated API endpoint detected"},{id:"4",timestamp:"09:00:18",level:"error",message:"Connection timeout on port 8080"},{id:"5",timestamp:"09:00:25",level:"debug",message:"Retrying with backoff 2s"}]}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    logs: [{
      id: "1",
      timestamp: "09:00:00",
      level: "info",
      message: "System initialized"
    }, {
      id: "2",
      timestamp: "09:00:05",
      level: "info",
      message: "Loading configuration"
    }, {
      id: "3",
      timestamp: "09:00:12",
      level: "warn",
      message: "Deprecated API endpoint detected"
    }, {
      id: "4",
      timestamp: "09:00:18",
      level: "error",
      message: "Connection timeout on port 8080"
    }, {
      id: "5",
      timestamp: "09:00:25",
      level: "debug",
      message: "Retrying with backoff 2s"
    }]
  }
}`,...a.parameters?.docs?.source}}};const x=["Default"];export{a as Default,x as __namedExportsOrder,f as default};
