import{j as t}from"./iframe-rZoXeK5l.js";import{c as s}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function n({stages:r,className:o}){const i={pending:"○",loading:"◔",complete:"✓",error:"✗"},l={pending:"text-muted-foreground",loading:"text-primary animate-spin",complete:"text-emerald-400",error:"text-red-400"};return t.jsx("div",{className:s("flex flex-col gap-2",o),children:r.map(e=>t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("span",{className:s("text-sm",l[e.status]),children:i[e.status]}),t.jsx("span",{className:s("text-sm",e.status==="complete"?"text-foreground":"text-muted-foreground"),children:e.label})]},e.id))})}try{n.displayName="LoadingProgress",n.__docgenInfo={description:"LoadingProgress - Migrated from",displayName:"LoadingProgress",props:{stages:{defaultValue:null,description:"",name:"stages",required:!0,type:{name:"LoadingStage[]"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const m={title:"Migrations/WebUI/LoadingProgress",component:n,tags:["autodocs"]},a={args:{stages:[{id:"1",label:"Connecting",status:"complete"},{id:"2",label:"Authenticating",status:"complete"},{id:"3",label:"Loading data",status:"loading"},{id:"4",label:"Initializing UI",status:"pending"}]}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    stages: [{
      id: "1",
      label: "Connecting",
      status: "complete"
    }, {
      id: "2",
      label: "Authenticating",
      status: "complete"
    }, {
      id: "3",
      label: "Loading data",
      status: "loading"
    }, {
      id: "4",
      label: "Initializing UI",
      status: "pending"
    }]
  }
}`,...a.parameters?.docs?.source}}};const p=["Default"];export{a as Default,p as __namedExportsOrder,m as default};
