import{j as e}from"./iframe-CzJrb7DT.js";import{c as t}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function i({data:l,className:s}){const d=(r,a=0)=>e.jsxs("div",{className:"flex flex-col",style:{marginLeft:a*24},children:[e.jsxs("div",{className:"flex items-center gap-2 py-1",children:[a>0&&e.jsx("span",{className:"text-muted-foreground/30",children:"—"}),e.jsx("span",{className:t("text-sm px-2 py-0.5 rounded border",a===0?"border-primary text-primary font-medium":"border-border text-foreground"),children:r.label})]}),r.children?.map(o=>d(o,a+1))]},r.id);return e.jsx("div",{className:t("",s),children:d(l)})}try{i.displayName="MindMap",i.__docgenInfo={description:"MindMap - Migrated from",displayName:"MindMap",props:{data:{defaultValue:null,description:"",name:"data",required:!0,type:{name:"MindMapNode"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const u={title:"Migrations/WebUI/MindMap",component:i,tags:["autodocs"]},n={args:{data:{id:"root",label:"Agent System",children:[{id:"a",label:"Perception",children:[{id:"a1",label:"Vision"},{id:"a2",label:"Audio"}]},{id:"b",label:"Reasoning",children:[{id:"b1",label:"Planning"}]},{id:"c",label:"Action"}]}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    data: {
      id: "root",
      label: "Agent System",
      children: [{
        id: "a",
        label: "Perception",
        children: [{
          id: "a1",
          label: "Vision"
        }, {
          id: "a2",
          label: "Audio"
        }]
      }, {
        id: "b",
        label: "Reasoning",
        children: [{
          id: "b1",
          label: "Planning"
        }]
      }, {
        id: "c",
        label: "Action"
      }]
    }
  }
}`,...n.parameters?.docs?.source}}};const b=["Default"];export{n as Default,b as __namedExportsOrder,u as default};
