import{r as m,j as e}from"./iframe-rZoXeK5l.js";import{c as i}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";const p={info:"text-blue-400",warn:"text-amber-400",error:"text-red-400",debug:"text-muted-foreground"};function r({entries:t,autoScroll:n=!0,maxLines:l=200,className:d}){const o=m.useRef(null),c=t.slice(-l);return m.useEffect(()=>{n&&o.current?.scrollIntoView({behavior:"smooth"})},[t.length,n]),e.jsxs("div",{className:i("font-mono text-xs overflow-auto bg-card border border-border rounded-md p-2 max-h-80",d),children:[c.map(s=>e.jsxs("div",{className:"flex gap-2 py-0.5",children:[e.jsx("span",{className:"text-muted-foreground shrink-0",children:s.timestamp}),e.jsxs("span",{className:i("shrink-0 uppercase w-12",p[s.level]),children:["[",s.level,"]"]}),e.jsx("span",{className:"text-foreground",children:s.message})]},s.id)),e.jsx("div",{ref:o})]})}try{r.displayName="LogStream",r.__docgenInfo={description:"LogStream - Migrated from",displayName:"LogStream",props:{entries:{defaultValue:null,description:"",name:"entries",required:!0,type:{name:"LogEntry[]"}},autoScroll:{defaultValue:{value:"true"},description:"",name:"autoScroll",required:!1,type:{name:"boolean"}},maxLines:{defaultValue:{value:"200"},description:"",name:"maxLines",required:!1,type:{name:"number"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const v={title:"Migrations/WebUI/LogStream",component:r,tags:["autodocs"]},a={args:{entries:[{id:"1",timestamp:"09:00:00",level:"info",message:"Stream connected"},{id:"2",timestamp:"09:00:03",level:"debug",message:"Heartbeat received"},{id:"3",timestamp:"09:00:07",level:"warn",message:"Slow response from upstream"},{id:"4",timestamp:"09:00:12",level:"error",message:"Timeout exceeded for /api/v2/status"},{id:"5",timestamp:"09:00:15",level:"info",message:"Reconnecting..."}]}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    entries: [{
      id: "1",
      timestamp: "09:00:00",
      level: "info",
      message: "Stream connected"
    }, {
      id: "2",
      timestamp: "09:00:03",
      level: "debug",
      message: "Heartbeat received"
    }, {
      id: "3",
      timestamp: "09:00:07",
      level: "warn",
      message: "Slow response from upstream"
    }, {
      id: "4",
      timestamp: "09:00:12",
      level: "error",
      message: "Timeout exceeded for /api/v2/status"
    }, {
      id: "5",
      timestamp: "09:00:15",
      level: "info",
      message: "Reconnecting..."
    }]
  }
}`,...a.parameters?.docs?.source}}};const x=["Default"];export{a as Default,x as __namedExportsOrder,v as default};
