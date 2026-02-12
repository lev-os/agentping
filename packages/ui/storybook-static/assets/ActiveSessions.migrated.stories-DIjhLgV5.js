import{j as e}from"./iframe-rZoXeK5l.js";import{c as a}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function r({sessions:i,className:n,onTerminate:d}){return e.jsx("div",{className:a("flex flex-col gap-2",n),children:i.map(s=>e.jsxs("div",{className:"flex items-center gap-3 px-3 py-2 rounded-md bg-card border border-border",children:[e.jsx("div",{className:a("h-2 w-2 rounded-full shrink-0",s.status==="active"?"bg-emerald-500":"bg-amber-500")}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("div",{className:"text-sm font-medium text-foreground truncate",children:s.user}),e.jsxs("div",{className:"text-xs text-muted-foreground truncate",children:[s.ip," • ",s.device]})]}),e.jsx("div",{className:"text-xs text-muted-foreground shrink-0",children:s.duration}),e.jsx("button",{className:"text-muted-foreground hover:text-destructive text-lg leading-none shrink-0",title:"Terminate Session",onClick:()=>d?.(s.id),children:"×"})]},s.id))})}try{r.displayName="ActiveSessions",r.__docgenInfo={description:"ActiveSessions - Migrated from",displayName:"ActiveSessions",props:{sessions:{defaultValue:null,description:"",name:"sessions",required:!0,type:{name:"Session[]"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},onTerminate:{defaultValue:null,description:"",name:"onTerminate",required:!1,type:{name:"((sessionId: string) => void)"}}}}}catch{}const m={title:"Migrations/WebUI/ActiveSessions",component:r,tags:["autodocs"]},t={args:{sessions:[{id:"1",user:"alice",ip:"192.168.1.1",duration:"2h 15m",device:"Chrome",status:"active"},{id:"2",user:"bob",ip:"10.0.0.5",duration:"45m",device:"Firefox",status:"idle"}]}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    sessions: [{
      id: "1",
      user: "alice",
      ip: "192.168.1.1",
      duration: "2h 15m",
      device: "Chrome",
      status: "active"
    }, {
      id: "2",
      user: "bob",
      ip: "10.0.0.5",
      duration: "45m",
      device: "Firefox",
      status: "idle"
    }]
  }
}`,...t.parameters?.docs?.source}}};const u=["Default"];export{t as Default,u as __namedExportsOrder,m as default};
