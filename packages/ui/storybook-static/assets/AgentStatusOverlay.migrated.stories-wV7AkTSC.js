import{j as e}from"./iframe-CzJrb7DT.js";import{c as n}from"./utils-CDN07tui.js";import{B as o}from"./bot-BaD4Zin9.js";import{X as m}from"./x-CMkHq2ts.js";import{C as u}from"./circle-check-big-BWy-AY5y.js";import{C as p}from"./circle-alert-DL588MOd.js";import{L as x}from"./loader-circle-0-I84ZsA.js";import"./preload-helper-PPVm8Dsz.js";import"./createLucideIcon-qiJ1pPWj.js";const f={idle:{icon:e.jsx(o,{size:14}),color:"text-zinc-400",label:"Idle"},running:{icon:e.jsx(x,{size:14,className:"animate-spin"}),color:"text-cyan-400",label:"Running"},error:{icon:e.jsx(p,{size:14}),color:"text-red-400",label:"Error"},complete:{icon:e.jsx(u,{size:14}),color:"text-emerald-400",label:"Complete"}};function i({agents:t,onClose:l,visible:c=!0,className:d}){return!c||t.length===0?null:e.jsxs("div",{className:n("fixed top-4 right-4 z-40 w-72","bg-zinc-900/95 backdrop-blur-sm border border-zinc-700/50 rounded-xl","shadow-xl shadow-black/30","animate-in slide-in-from-right-2 fade-in duration-200",d),children:[e.jsxs("div",{className:"flex items-center justify-between px-4 py-2.5 border-b border-zinc-800",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(o,{size:14,className:"text-cyan-500"}),e.jsxs("span",{className:"text-xs font-medium text-zinc-300",children:["Agent Squad (",t.length,")"]})]}),l&&e.jsx("button",{onClick:l,className:"p-0.5 text-zinc-500 hover:text-zinc-300 transition-colors",children:e.jsx(m,{size:12})})]}),e.jsx("div",{className:"max-h-64 overflow-y-auto py-1",children:t.map(s=>{const r=f[s.status];return e.jsxs("div",{className:"flex items-start gap-2.5 px-4 py-2",children:[e.jsx("span",{className:n("mt-0.5 flex-shrink-0",r.color),children:r.icon}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-xs font-medium text-zinc-300 truncate",children:s.name}),e.jsx("span",{className:n("text-[10px]",r.color),children:r.label})]}),s.currentTask&&e.jsx("p",{className:"text-[11px] text-zinc-500 truncate mt-0.5",children:s.currentTask}),s.progress!=null&&e.jsx("div",{className:"mt-1.5 h-1 rounded-full bg-zinc-800 overflow-hidden",children:e.jsx("div",{className:"h-full rounded-full bg-cyan-500 transition-all duration-500",style:{width:`${Math.min(s.progress,100)}%`}})})]})]},s.sessionId)})})]})}try{i.displayName="AgentStatusOverlay",i.__docgenInfo={description:"",displayName:"AgentStatusOverlay",props:{agents:{defaultValue:null,description:"List of parallel agents",name:"agents",required:!0,type:{name:"OverlayAgent[]"}},onClose:{defaultValue:null,description:"Close the overlay",name:"onClose",required:!1,type:{name:"(() => void)"}},visible:{defaultValue:{value:"true"},description:"Whether the overlay is visible",name:"visible",required:!1,type:{name:"boolean"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const k={title:"Migrations/Studio/AgentStatusOverlay",component:i,parameters:{layout:"fullscreen"},tags:["autodocs"]},a={args:{agents:[{sessionId:"1",name:"Code Writer",status:"running",currentTask:"Refactoring auth module",progress:65},{sessionId:"2",name:"Reviewer",status:"idle"},{sessionId:"3",name:"Deployer",status:"complete",currentTask:"Deployed to staging"}]}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    agents: [{
      sessionId: "1",
      name: "Code Writer",
      status: "running",
      currentTask: "Refactoring auth module",
      progress: 65
    }, {
      sessionId: "2",
      name: "Reviewer",
      status: "idle"
    }, {
      sessionId: "3",
      name: "Deployer",
      status: "complete",
      currentTask: "Deployed to staging"
    }]
  }
}`,...a.parameters?.docs?.source}}};const _=["Default"];export{a as Default,_ as __namedExportsOrder,k as default};
