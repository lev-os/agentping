import{j as e}from"./iframe-rZoXeK5l.js";import{c as d}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function s({node:r,depth:a=0}){return e.jsxs("div",{className:"flex flex-col items-center",children:[e.jsxs("div",{className:"border border-cyan-500/20 bg-black/60 rounded-lg p-2 text-center min-w-[100px]",children:[e.jsx("div",{className:"w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 mx-auto mb-1 flex items-center justify-center text-[10px] font-mono text-cyan-400",children:r.name.charAt(0)}),e.jsx("div",{className:"text-xs font-mono text-cyan-300",children:r.name}),e.jsx("div",{className:"text-[10px] font-mono text-cyan-500/40",children:r.role})]}),r.children&&r.children.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-px h-4 bg-cyan-500/20"}),e.jsx("div",{className:"flex gap-4",children:r.children.map(o=>e.jsx(s,{node:o,depth:a+1},o.id))})]})]})}function t({data:r,className:a}){return r?e.jsx("div",{className:d("border border-cyan-500/20 bg-black/60 rounded-lg p-4 overflow-x-auto",a),children:e.jsx(s,{node:r})}):null}try{t.displayName="OrgChart",t.__docgenInfo={description:"OrgChart - Migrated from",displayName:"OrgChart",props:{data:{defaultValue:null,description:"",name:"data",required:!1,type:{name:"OrgNode"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const m={title:"Migrations/WebUI/Root/OrgChart",component:t,parameters:{layout:"centered"},tags:["autodocs"]},n={args:{data:{id:"ceo",name:"Agent Prime",role:"Orchestrator",children:[{id:"eng",name:"Builder",role:"Engineer",children:[{id:"fe",name:"Pixel",role:"Frontend"},{id:"be",name:"Logic",role:"Backend"}]},{id:"ops",name:"Runner",role:"DevOps"}]}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    data: {
      id: "ceo",
      name: "Agent Prime",
      role: "Orchestrator",
      children: [{
        id: "eng",
        name: "Builder",
        role: "Engineer",
        children: [{
          id: "fe",
          name: "Pixel",
          role: "Frontend"
        }, {
          id: "be",
          name: "Logic",
          role: "Backend"
        }]
      }, {
        id: "ops",
        name: "Runner",
        role: "DevOps"
      }]
    }
  }
}`,...n.parameters?.docs?.source}}};const p=["Default"];export{n as Default,p as __namedExportsOrder,m as default};
