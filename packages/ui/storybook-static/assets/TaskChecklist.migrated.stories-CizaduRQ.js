import{j as e}from"./iframe-rZoXeK5l.js";import{c as a}from"./utils-CDN07tui.js";import{C as m}from"./clock-DCgZofSP.js";import{C as u}from"./circle-alert-JWRrnpzD.js";import{C as x}from"./circle-check-big-De4I2Jce.js";import{L as g}from"./loader-circle-DU_QOWZs.js";import{C as f}from"./circle-Q3hm3bTk.js";import"./preload-helper-PPVm8Dsz.js";import"./createLucideIcon-oH0TnkMA.js";const h={pending:{icon:e.jsx(f,{size:16}),color:"text-zinc-500"},in_progress:{icon:e.jsx(g,{size:16,className:"animate-spin"}),color:"text-cyan-400"},complete:{icon:e.jsx(x,{size:16}),color:"text-emerald-400"},failed:{icon:e.jsx(u,{size:16}),color:"text-red-400"},waiting_approval:{icon:e.jsx(m,{size:16}),color:"text-amber-400"}};function i({steps:s,onApproveStep:r,onRejectStep:o,className:d}){const l=s.filter(t=>t.status==="complete").length;return e.jsxs("div",{className:a("flex flex-col",d),children:[e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsx("span",{className:"text-xs font-medium text-zinc-300",children:"Task Progress"}),e.jsxs("span",{className:"text-xs text-zinc-500",children:[l,"/",s.length," complete"]})]}),e.jsx("div",{className:"h-1.5 rounded-full bg-zinc-800 overflow-hidden mb-4",children:e.jsx("div",{className:"h-full rounded-full bg-cyan-500 transition-all duration-500",style:{width:`${s.length>0?l/s.length*100:0}%`}})}),e.jsx("div",{className:"space-y-1",children:s.map((t,p)=>{const c=h[t.status];return e.jsxs("div",{className:a("flex items-start gap-3 px-3 py-2 rounded-lg","transition-colors",t.status==="waiting_approval"&&"bg-amber-500/5"),children:[e.jsxs("div",{className:"flex flex-col items-center",children:[e.jsx("span",{className:a("flex-shrink-0",c.color),children:c.icon}),p<s.length-1&&e.jsx("div",{className:"w-px h-full min-h-[16px] bg-zinc-800 mt-1"})]}),e.jsxs("div",{className:"flex-1 min-w-0 pb-2",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:a("text-sm",t.status==="complete"?"text-zinc-500 line-through":"text-zinc-300"),children:t.title}),t.agent&&e.jsx("span",{className:"text-[10px] text-zinc-600 bg-zinc-800/50 px-1.5 rounded",children:t.agent})]}),t.description&&e.jsx("p",{className:"text-xs text-zinc-500 mt-0.5",children:t.description}),t.status==="waiting_approval"&&e.jsxs("div",{className:"flex items-center gap-2 mt-2",children:[r&&e.jsx("button",{onClick:()=>r(t.id),className:"px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition-colors",children:"Approve"}),o&&e.jsx("button",{onClick:()=>o(t.id),className:"px-2 py-0.5 rounded text-[10px] font-medium bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors",children:"Reject"})]})]})]},t.id)})})]})}try{i.displayName="TaskChecklist",i.__docgenInfo={description:"",displayName:"TaskChecklist",props:{steps:{defaultValue:null,description:"Task steps",name:"steps",required:!0,type:{name:"TaskStep[]"}},onApproveStep:{defaultValue:null,description:"Approve a step waiting for approval",name:"onApproveStep",required:!1,type:{name:"((stepId: string) => void)"}},onRejectStep:{defaultValue:null,description:"Reject a step",name:"onRejectStep",required:!1,type:{name:"((stepId: string) => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const z={title:"Migrations/Studio/TaskChecklist",component:i,parameters:{layout:"padded"},tags:["autodocs"]},n={args:{steps:[{id:"1",title:"Read component source",status:"complete",agent:"Claude"},{id:"2",title:"Create migration candidate",status:"complete",agent:"Claude"},{id:"3",title:"Create Storybook story",status:"in_progress",agent:"Claude"},{id:"4",title:"Review migration",status:"waiting_approval",description:"Needs human review before merging"},{id:"5",title:"Update barrel exports",status:"pending"}],onApproveStep:()=>{},onRejectStep:()=>{}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    steps: [{
      id: "1",
      title: "Read component source",
      status: "complete",
      agent: "Claude"
    }, {
      id: "2",
      title: "Create migration candidate",
      status: "complete",
      agent: "Claude"
    }, {
      id: "3",
      title: "Create Storybook story",
      status: "in_progress",
      agent: "Claude"
    }, {
      id: "4",
      title: "Review migration",
      status: "waiting_approval",
      description: "Needs human review before merging"
    }, {
      id: "5",
      title: "Update barrel exports",
      status: "pending"
    }],
    onApproveStep: () => {},
    onRejectStep: () => {}
  }
}`,...n.parameters?.docs?.source}}};const S=["Default"];export{n as Default,S as __namedExportsOrder,z as default};
