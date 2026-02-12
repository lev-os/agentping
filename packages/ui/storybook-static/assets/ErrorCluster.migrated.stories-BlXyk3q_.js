import{j as e}from"./iframe-CzJrb7DT.js";import{c as n}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function t({errors:a=[],className:o}){return e.jsx("div",{className:n("flex flex-col gap-2",o),children:a.map(r=>e.jsxs("div",{className:"flex items-start gap-3 px-3 py-2 rounded-md border border-destructive/30 bg-destructive/5",children:[e.jsxs("span",{className:"text-xs font-mono font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded shrink-0",children:[r.count,"x"]}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("div",{className:"text-sm text-foreground truncate",children:r.message}),e.jsx("div",{className:"text-xs text-muted-foreground mt-0.5",children:r.lastSeen})]})]},r.id))})}try{t.displayName="ErrorCluster",t.__docgenInfo={description:"ErrorCluster - Migrated from",displayName:"ErrorCluster",props:{errors:{defaultValue:{value:"[]"},description:"",name:"errors",required:!1,type:{name:"ErrorGroup[]"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const l={title:"Migrations/WebUI/ErrorCluster",component:t,tags:["autodocs"]},s={args:{errors:[{id:"1",message:"TypeError: Cannot read property 'map' of undefined",count:12,lastSeen:"2m ago"},{id:"2",message:"ReferenceError: ws is not defined",count:3,lastSeen:"15m ago"}]}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    errors: [{
      id: "1",
      message: "TypeError: Cannot read property 'map' of undefined",
      count: 12,
      lastSeen: "2m ago"
    }, {
      id: "2",
      message: "ReferenceError: ws is not defined",
      count: 3,
      lastSeen: "15m ago"
    }]
  }
}`,...s.parameters?.docs?.source}}};const m=["Default"];export{s as Default,m as __namedExportsOrder,l as default};
