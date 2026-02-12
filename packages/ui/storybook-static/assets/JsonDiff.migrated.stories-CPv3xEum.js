import{j as e}from"./iframe-CzJrb7DT.js";import{c}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function a({oldJson:t={},newJson:o={},className:d}){const i=JSON.stringify(t,null,2).split(`
`),l=JSON.stringify(o,null,2).split(`
`);return e.jsxs("div",{className:c("grid grid-cols-2 gap-0 border border-border rounded-md overflow-hidden font-mono text-xs",d),children:[e.jsxs("div",{className:"border-r border-border p-2 bg-red-500/5",children:[e.jsx("div",{className:"text-[10px] text-muted-foreground mb-1",children:"Old"}),i.map((s,r)=>e.jsx("div",{className:"text-foreground/80 whitespace-pre",children:s},r))]}),e.jsxs("div",{className:"p-2 bg-emerald-500/5",children:[e.jsx("div",{className:"text-[10px] text-muted-foreground mb-1",children:"New"}),l.map((s,r)=>e.jsx("div",{className:"text-foreground/80 whitespace-pre",children:s},r))]})]})}try{a.displayName="JsonDiff",a.__docgenInfo={description:"JsonDiff - Migrated from",displayName:"JsonDiff",props:{oldJson:{defaultValue:{value:"{}"},description:"",name:"oldJson",required:!1,type:{name:"unknown"}},newJson:{defaultValue:{value:"{}"},description:"",name:"newJson",required:!1,type:{name:"unknown"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const f={title:"Migrations/WebUI/JsonDiff",component:a,tags:["autodocs"]},n={args:{oldJson:{name:"agent-1",status:"idle",version:"1.0.0"},newJson:{name:"agent-1",status:"running",version:"1.1.0",tasks:3}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    oldJson: {
      name: "agent-1",
      status: "idle",
      version: "1.0.0"
    },
    newJson: {
      name: "agent-1",
      status: "running",
      version: "1.1.0",
      tasks: 3
    }
  }
}`,...n.parameters?.docs?.source}}};const g=["Default"];export{n as Default,g as __namedExportsOrder,f as default};
