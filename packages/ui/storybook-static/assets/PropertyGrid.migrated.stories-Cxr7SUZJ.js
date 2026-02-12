import{j as e}from"./iframe-rZoXeK5l.js";import{c as i}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function a({items:n=[],title:s,className:o}){return e.jsxs("div",{className:i("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden",o),children:[s&&e.jsx("div",{className:"px-4 py-2 border-b border-cyan-500/10",children:e.jsx("span",{className:"text-xs font-mono text-cyan-400 uppercase tracking-wider",children:s})}),e.jsx("div",{className:"divide-y divide-cyan-500/5",children:n.map(t=>e.jsxs("div",{className:"flex items-center gap-3 px-4 py-1.5",children:[e.jsx("span",{className:"text-xs font-mono text-cyan-500/60 w-32 truncate",children:t.key}),e.jsx("span",{className:"text-xs font-mono text-cyan-300/80 flex-1",children:String(t.value)})]},t.key))})]})}try{a.displayName="PropertyGrid",a.__docgenInfo={description:"PropertyGrid - Migrated from",displayName:"PropertyGrid",props:{items:{defaultValue:{value:"[]"},description:"",name:"items",required:!1,type:{name:"PropertyGridItem[]"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const m={title:"Migrations/WebUI/Root/PropertyGrid",component:a,parameters:{layout:"centered"},tags:["autodocs"]},r={args:{title:"Node Properties",items:[{key:"status",value:"running",category:"runtime"},{key:"uptime",value:3600,category:"runtime"},{key:"version",value:"2.1.0",category:"meta"},{key:"healthy",value:!0,category:"health"}]}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Node Properties",
    items: [{
      key: "status",
      value: "running",
      category: "runtime"
    }, {
      key: "uptime",
      value: 3600,
      category: "runtime"
    }, {
      key: "version",
      value: "2.1.0",
      category: "meta"
    }, {
      key: "healthy",
      value: true,
      category: "health"
    }]
  }
}`,...r.parameters?.docs?.source}}};const u=["Default"];export{r as Default,u as __namedExportsOrder,m as default};
