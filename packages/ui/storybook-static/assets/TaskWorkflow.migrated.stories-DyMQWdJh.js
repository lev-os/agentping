import{j as e,r as m}from"./iframe-CzJrb7DT.js";import{c as s}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";const g={pending:{border:"border-gray-500/20",bg:"bg-gray-500/5",dot:"bg-gray-500",text:"text-gray-400"},active:{border:"border-cyan-500/30",bg:"bg-cyan-500/5",dot:"bg-cyan-400",text:"text-cyan-300"},completed:{border:"border-green-500/30",bg:"bg-green-500/5",dot:"bg-green-400",text:"text-green-300"},failed:{border:"border-red-500/30",bg:"bg-red-500/5",dot:"bg-red-400",text:"text-red-300"}};function o({stages:i,className:d}){return e.jsxs("div",{className:s("border border-cyan-500/20 bg-black/60 rounded-lg p-4",d),children:[e.jsx("div",{className:"text-xs font-mono text-cyan-400 uppercase tracking-wider mb-4",children:"Workflow Pipeline"}),e.jsx("div",{className:"flex gap-0 overflow-x-auto pb-2",children:i.map((t,c)=>{const a=g[t.status],p=t.tasks.filter(n=>n.done).length;return e.jsxs(m.Fragment,{children:[c>0&&e.jsxs("div",{className:"flex items-center px-1 flex-shrink-0",children:[e.jsx("div",{className:"w-6 h-px bg-cyan-500/20"}),e.jsx("div",{className:"text-cyan-500/30 text-[10px] font-mono",children:"▶"})]}),e.jsxs("div",{className:s("flex-shrink-0 w-48 rounded-lg border p-3",a.border,a.bg),children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx("div",{className:s("w-2 h-2 rounded-full",a.dot)}),e.jsx("span",{className:s("text-xs font-mono font-semibold truncate",a.text),children:t.label})]}),e.jsxs("div",{className:"text-[9px] font-mono text-cyan-500/40 mb-2",children:[p,"/",t.tasks.length," tasks"]}),e.jsx("div",{className:"space-y-1",children:t.tasks.map((n,u)=>e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx("div",{className:s("w-3 h-3 rounded-sm border flex items-center justify-center flex-shrink-0",n.done?"border-green-500/40 bg-green-500/10":"border-cyan-500/10 bg-transparent"),children:n.done&&e.jsx("svg",{width:"8",height:"8",viewBox:"0 0 8 8",fill:"none",children:e.jsx("path",{d:"M1.5 4L3 5.5L6.5 2",stroke:"#4ade80",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round"})})}),e.jsx("span",{className:s("text-[10px] font-mono truncate",n.done?"text-gray-500 line-through":"text-gray-300"),children:n.title})]},u))})]})]},t.id)})})]})}try{o.displayName="TaskWorkflow",o.__docgenInfo={description:"TaskWorkflow - Multi-stage pipeline with checklists",displayName:"TaskWorkflow",props:{stages:{defaultValue:null,description:"",name:"stages",required:!0,type:{name:"WorkflowStage[]"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const h={title:"Migrations/WebUI/Root/TaskWorkflow",component:o,parameters:{layout:"padded"},tags:["autodocs"]},l={args:{stages:[{id:"plan",label:"Planning",status:"completed",tasks:[{title:"Define requirements",done:!0},{title:"Create wireframes",done:!0},{title:"Review with team",done:!0}]},{id:"dev",label:"Development",status:"active",tasks:[{title:"Set up project",done:!0},{title:"Implement API",done:!0},{title:"Build UI components",done:!1},{title:"Write tests",done:!1}]},{id:"qa",label:"QA Testing",status:"pending",tasks:[{title:"Unit tests",done:!1},{title:"Integration tests",done:!1},{title:"UAT sign-off",done:!1}]},{id:"deploy",label:"Deployment",status:"pending",tasks:[{title:"Stage deploy",done:!1},{title:"Production deploy",done:!1}]}]}},r={args:{stages:[{id:"build",label:"Build",status:"completed",tasks:[{title:"Compile",done:!0},{title:"Bundle",done:!0}]},{id:"test",label:"Test",status:"failed",tasks:[{title:"Unit tests",done:!0},{title:"E2E tests",done:!1}]},{id:"ship",label:"Ship",status:"pending",tasks:[{title:"Deploy",done:!1}]}]}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    stages: [{
      id: "plan",
      label: "Planning",
      status: "completed",
      tasks: [{
        title: "Define requirements",
        done: true
      }, {
        title: "Create wireframes",
        done: true
      }, {
        title: "Review with team",
        done: true
      }]
    }, {
      id: "dev",
      label: "Development",
      status: "active",
      tasks: [{
        title: "Set up project",
        done: true
      }, {
        title: "Implement API",
        done: true
      }, {
        title: "Build UI components",
        done: false
      }, {
        title: "Write tests",
        done: false
      }]
    }, {
      id: "qa",
      label: "QA Testing",
      status: "pending",
      tasks: [{
        title: "Unit tests",
        done: false
      }, {
        title: "Integration tests",
        done: false
      }, {
        title: "UAT sign-off",
        done: false
      }]
    }, {
      id: "deploy",
      label: "Deployment",
      status: "pending",
      tasks: [{
        title: "Stage deploy",
        done: false
      }, {
        title: "Production deploy",
        done: false
      }]
    }]
  }
}`,...l.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    stages: [{
      id: "build",
      label: "Build",
      status: "completed",
      tasks: [{
        title: "Compile",
        done: true
      }, {
        title: "Bundle",
        done: true
      }]
    }, {
      id: "test",
      label: "Test",
      status: "failed",
      tasks: [{
        title: "Unit tests",
        done: true
      }, {
        title: "E2E tests",
        done: false
      }]
    }, {
      id: "ship",
      label: "Ship",
      status: "pending",
      tasks: [{
        title: "Deploy",
        done: false
      }]
    }]
  }
}`,...r.parameters?.docs?.source}}};const k=["Default","WithFailure"];export{l as Default,r as WithFailure,k as __namedExportsOrder,h as default};
