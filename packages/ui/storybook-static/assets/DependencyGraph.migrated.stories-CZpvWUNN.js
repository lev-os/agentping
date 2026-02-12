import{j as n}from"./iframe-CzJrb7DT.js";import{c as o}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function s({nodes:r,onNodeClick:t,className:d}){const i={ok:"border-emerald-500",warning:"border-amber-500",error:"border-red-500"};return n.jsx("div",{className:o("flex flex-wrap gap-3",d),children:r.map(e=>n.jsxs("button",{onClick:()=>t?.(e),className:o("px-3 py-2 rounded-md border-2 bg-card text-sm text-foreground hover:bg-muted transition-colors text-left",i[e.status??"ok"]),children:[n.jsx("div",{className:"font-medium",children:e.label}),e.deps.length>0&&n.jsxs("div",{className:"text-xs text-muted-foreground mt-1",children:["deps: ",e.deps.join(", ")]})]},e.id))})}try{s.displayName="DependencyGraph",s.__docgenInfo={description:"DependencyGraph - Migrated from",displayName:"DependencyGraph",props:{nodes:{defaultValue:null,description:"",name:"nodes",required:!0,type:{name:"DependencyNode[]"}},onNodeClick:{defaultValue:null,description:"",name:"onNodeClick",required:!1,type:{name:"((node: DependencyNode) => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const u={title:"Migrations/WebUI/DependencyGraph",component:s,tags:["autodocs"]},a={args:{nodes:[{id:"core",label:"core",deps:[],status:"ok"},{id:"ui",label:"ui",deps:["core"],status:"ok"},{id:"daemon",label:"daemon",deps:["core"],status:"warning"},{id:"studio",label:"studio",deps:["ui","daemon"],status:"ok"}]}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: [{
      id: "core",
      label: "core",
      deps: [],
      status: "ok"
    }, {
      id: "ui",
      label: "ui",
      deps: ["core"],
      status: "ok"
    }, {
      id: "daemon",
      label: "daemon",
      deps: ["core"],
      status: "warning"
    }, {
      id: "studio",
      label: "studio",
      deps: ["ui", "daemon"],
      status: "ok"
    }]
  }
}`,...a.parameters?.docs?.source}}};const m=["Default"];export{a as Default,m as __namedExportsOrder,u as default};
