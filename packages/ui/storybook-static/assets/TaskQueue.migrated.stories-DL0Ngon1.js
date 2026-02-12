import{j as t}from"./iframe-CzJrb7DT.js";import{c as i}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";const c={queued:"bg-cyan-500/10 text-cyan-400 border-cyan-500/30",running:"bg-amber-500/10 text-amber-400 border-amber-500/30",done:"bg-emerald-500/10 text-emerald-400 border-emerald-500/30",failed:"bg-red-500/10 text-red-400 border-red-500/30"},u=e=>e===void 0?null:e>=8?{text:"P0",cls:"text-red-400"}:e>=5?{text:"P1",cls:"text-amber-400"}:{text:"P2",cls:"text-cyan-500/50"};function d({tasks:e=[],className:o}){return t.jsxs("div",{className:i("border border-cyan-500/20 bg-black/60 rounded-lg font-mono divide-y divide-cyan-500/10",o),children:[e.length===0&&t.jsx("div",{className:"p-4 text-xs text-cyan-500/30",children:"Queue empty"}),e.map(r=>{const n=u(r.priority);return t.jsxs("div",{className:"flex items-center gap-3 px-4 py-2.5 hover:bg-cyan-500/5 transition-colors",children:[n&&t.jsx("span",{className:i("text-[10px] font-bold w-6",n.cls),children:n.text}),t.jsx("span",{className:"flex-1 text-sm text-cyan-100 truncate",children:r.title}),t.jsx("span",{className:i("text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider",c[r.status]),children:r.status})]},r.id)})]})}try{d.displayName="TaskQueue",d.__docgenInfo={description:"",displayName:"TaskQueue",props:{tasks:{defaultValue:{value:"[]"},description:"",name:"tasks",required:!1,type:{name:"Task[]"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const y={title:"Migrations/WebUI/Root/TaskQueue",component:d,parameters:{layout:"centered"},tags:["autodocs"]},a={args:{tasks:[{id:"1",title:"Migrate database schema",status:"done",priority:9},{id:"2",title:"Update API endpoints",status:"running",priority:7},{id:"3",title:"Write integration tests",status:"queued",priority:5},{id:"4",title:"Deploy to staging",status:"queued",priority:3},{id:"5",title:"Seed test data",status:"failed",priority:6}]}},s={args:{tasks:[]}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    tasks: [{
      id: "1",
      title: "Migrate database schema",
      status: "done",
      priority: 9
    }, {
      id: "2",
      title: "Update API endpoints",
      status: "running",
      priority: 7
    }, {
      id: "3",
      title: "Write integration tests",
      status: "queued",
      priority: 5
    }, {
      id: "4",
      title: "Deploy to staging",
      status: "queued",
      priority: 3
    }, {
      id: "5",
      title: "Seed test data",
      status: "failed",
      priority: 6
    }]
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    tasks: []
  }
}`,...s.parameters?.docs?.source}}};const x=["Default","Empty"];export{a as Default,s as Empty,x as __namedExportsOrder,y as default};
