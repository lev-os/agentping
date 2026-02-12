import{j as t}from"./iframe-CzJrb7DT.js";import{c as i}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function r({activities:s=[],className:n,maxHeight:o=300}){const c={deploy:"text-blue-400",alert:"text-amber-400",error:"text-red-400",success:"text-emerald-400",info:"text-muted-foreground"},d=e=>{switch(e){case"deploy":return"🚀";case"alert":return"⚠️";case"error":return"✗";case"success":return"✓";default:return"ℹ️"}};return t.jsx("div",{className:i("overflow-y-auto",n),style:{maxHeight:o},children:s.map(e=>t.jsxs("div",{className:"flex gap-3 px-3 py-2 border-b border-border last:border-0",children:[t.jsx("div",{className:i("text-sm shrink-0 pt-0.5",c[e.type]),children:d(e.type)}),t.jsxs("div",{className:"flex-1 min-w-0",children:[t.jsxs("div",{className:"text-sm",children:[t.jsx("span",{className:"font-medium text-foreground",children:e.user})," ",t.jsx("span",{className:"text-muted-foreground",children:e.action})," ",t.jsx("span",{className:"text-foreground",children:e.target})]}),t.jsx("div",{className:"text-xs text-muted-foreground mt-0.5",children:e.timestamp})]})]},e.id))})}try{r.displayName="ActivityFeed",r.__docgenInfo={description:"ActivityFeed - Migrated from",displayName:"ActivityFeed",props:{activities:{defaultValue:{value:"[]"},description:"",name:"activities",required:!1,type:{name:"ActivityItem[]"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},maxHeight:{defaultValue:{value:"300"},description:"",name:"maxHeight",required:!1,type:{name:"number"}}}}}catch{}const u={title:"Migrations/WebUI/ActivityFeed",component:r,tags:["autodocs"]},a={args:{activities:[{id:"1",user:"Alice",action:"deployed",target:"main-service",timestamp:"2 min ago",type:"deploy"},{id:"2",user:"Bot",action:"flagged",target:"memory spike",timestamp:"5 min ago",type:"alert"}]}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    activities: [{
      id: "1",
      user: "Alice",
      action: "deployed",
      target: "main-service",
      timestamp: "2 min ago",
      type: "deploy"
    }, {
      id: "2",
      user: "Bot",
      action: "flagged",
      target: "memory spike",
      timestamp: "5 min ago",
      type: "alert"
    }]
  }
}`,...a.parameters?.docs?.source}}};const y=["Default"];export{a as Default,y as __namedExportsOrder,u as default};
