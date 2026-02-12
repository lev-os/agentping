import{j as e}from"./iframe-rZoXeK5l.js";import{c as d}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function i({columns:r=[],className:a}){return e.jsx("div",{className:d("flex gap-4 overflow-x-auto pb-2",a),children:r.map(t=>e.jsxs("div",{className:"flex-shrink-0 w-64 flex flex-col",children:[e.jsxs("div",{className:"text-sm font-medium text-foreground mb-2 flex items-center gap-2",children:[t.title,e.jsx("span",{className:"text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded",children:t.items.length})]}),e.jsx("div",{className:"flex flex-col gap-2 flex-1",children:t.items.map(n=>e.jsxs("div",{className:"p-3 rounded-md border border-border bg-card hover:bg-muted/50 transition-colors",children:[e.jsx("div",{className:"text-sm text-foreground",children:n.title}),n.description&&e.jsx("div",{className:"text-xs text-muted-foreground mt-1",children:n.description})]},n.id))})]},t.id))})}try{i.displayName="KanbanBoard",i.__docgenInfo={description:"KanbanBoard - Migrated from",displayName:"KanbanBoard",props:{columns:{defaultValue:{value:"[]"},description:"",name:"columns",required:!1,type:{name:"KanbanColumn[]"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const c={title:"Migrations/WebUI/KanbanBoard",component:i,tags:["autodocs"]},s={args:{columns:[{id:"todo",title:"To Do",items:[{id:"1",title:"Review PR #42",description:"Code review pending"}]},{id:"in-progress",title:"In Progress",items:[{id:"2",title:"Fix auth bug"},{id:"3",title:"Update docs"}]},{id:"done",title:"Done",items:[{id:"4",title:"Deploy v2.0"}]}]}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    columns: [{
      id: "todo",
      title: "To Do",
      items: [{
        id: "1",
        title: "Review PR #42",
        description: "Code review pending"
      }]
    }, {
      id: "in-progress",
      title: "In Progress",
      items: [{
        id: "2",
        title: "Fix auth bug"
      }, {
        id: "3",
        title: "Update docs"
      }]
    }, {
      id: "done",
      title: "Done",
      items: [{
        id: "4",
        title: "Deploy v2.0"
      }]
    }]
  }
}`,...s.parameters?.docs?.source}}};const p=["Default"];export{s as Default,p as __namedExportsOrder,c as default};
