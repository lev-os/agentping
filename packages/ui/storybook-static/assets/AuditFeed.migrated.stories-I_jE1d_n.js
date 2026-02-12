import{r as p,j as e}from"./iframe-CzJrb7DT.js";import{c as n}from"./utils-CDN07tui.js";import{A as y}from"./activity-DVBwJ7LX.js";import{c as _}from"./createLucideIcon-qiJ1pPWj.js";import{S as A}from"./shield-BNhDQ9uC.js";import{F as D}from"./file-text-CfmUUd8t.js";import{C as S}from"./circle-check-big-BWy-AY5y.js";import{C as E}from"./circle-x-Bb9hQjof.js";import{M as F}from"./message-square-DJ6YsOik.js";import{T}from"./terminal-Cdo0Lett.js";import"./preload-helper-PPVm8Dsz.js";const C=[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",key:"sc7q7i"}]],M=_("funnel",C),g={tool_use:e.jsx(T,{size:14}),message:e.jsx(F,{size:14}),error:e.jsx(E,{size:14}),approval:e.jsx(S,{size:14}),file_change:e.jsx(D,{size:14}),system:e.jsx(y,{size:14}),security:e.jsx(A,{size:14})},q={tool_use:"text-cyan-400",message:"text-blue-400",error:"text-red-400",approval:"text-emerald-400",file_change:"text-amber-400",system:"text-zinc-400",security:"text-purple-400"};function V(s){const r=Math.floor((Date.now()-s.getTime())/1e3);if(r<60)return`${r}s ago`;const a=Math.floor(r/60);if(a<60)return`${a}m ago`;const l=Math.floor(a/60);return l<24?`${l}h ago`:s.toLocaleDateString()}function h({events:s,maxEvents:r=100,autoScroll:a=!0,showFilter:l=!0,className:v}){const[u,j]=p.useState(new Set),[f,w]=p.useState(!1),o=p.useRef(null),c=u.size===0?s.slice(0,r):s.filter(t=>u.has(t.type)).slice(0,r);p.useEffect(()=>{a&&o.current&&(o.current.scrollTop=o.current.scrollHeight)},[c.length,a]);const N=t=>{j(b=>{const d=new Set(b);return d.has(t)?d.delete(t):d.add(t),d})},z=["tool_use","message","error","approval","file_change","system","security"];return e.jsxs("div",{className:n("flex flex-col h-full",v),children:[e.jsxs("div",{className:"flex items-center justify-between px-3 py-2 border-b border-zinc-800",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(y,{size:14,className:"text-cyan-500"}),e.jsx("span",{className:"text-xs font-medium text-zinc-300",children:"Activity Feed"}),e.jsxs("span",{className:"text-[10px] text-zinc-600",children:[c.length," events"]})]}),l&&e.jsx("button",{onClick:()=>w(!f),className:n("p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors",f&&"text-cyan-400"),"aria-label":"Toggle filters",children:e.jsx(M,{size:12})})]}),f&&e.jsx("div",{className:"flex flex-wrap gap-1 px-3 py-2 border-b border-zinc-800",children:z.map(t=>e.jsxs("button",{onClick:()=>N(t),className:n("flex items-center gap-1 px-2 py-0.5 rounded text-[10px]","border transition-colors",u.has(t)?"border-cyan-500/30 bg-cyan-500/10 text-cyan-400":"border-zinc-700/30 text-zinc-500 hover:text-zinc-300"),children:[g[t],t.replace("_"," ")]},t))}),e.jsx("div",{ref:o,className:"flex-1 overflow-y-auto",children:c.length===0?e.jsxs("div",{className:"flex flex-col items-center justify-center py-12 text-zinc-600",children:[e.jsx(y,{size:24,className:"mb-2"}),e.jsx("span",{className:"text-xs",children:"No events to display"})]}):c.map(t=>e.jsxs("div",{className:n("flex gap-2.5 px-3 py-2","border-b border-zinc-800/50","hover:bg-white/[0.01] transition-colors"),children:[e.jsx("span",{className:n("mt-0.5 flex-shrink-0",q[t.type]),children:g[t.type]}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"flex items-center justify-between gap-2",children:[e.jsx("span",{className:"text-xs text-zinc-300 truncate",children:t.title}),e.jsx("span",{className:"text-[10px] text-zinc-600 flex-shrink-0",children:V(t.timestamp)})]}),t.description&&e.jsx("p",{className:"text-[11px] text-zinc-500 mt-0.5 truncate",children:t.description})]})]},t.id))})]})}try{h.displayName="AuditFeed",h.__docgenInfo={description:"",displayName:"AuditFeed",props:{events:{defaultValue:null,description:"",name:"events",required:!0,type:{name:"AuditEvent[]"}},maxEvents:{defaultValue:{value:"100"},description:"",name:"maxEvents",required:!1,type:{name:"number"}},autoScroll:{defaultValue:{value:"true"},description:"",name:"autoScroll",required:!1,type:{name:"boolean"}},showFilter:{defaultValue:{value:"true"},description:"",name:"showFilter",required:!1,type:{name:"boolean"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const i=Date.now(),G={title:"Migrations/Studio/AuditFeed",component:h,parameters:{layout:"padded"},tags:["autodocs"],decorators:[s=>e.jsx("div",{style:{height:400},children:e.jsx(s,{})})]},m={args:{events:[{id:"1",type:"tool_use",title:"Read file: src/App.tsx",timestamp:new Date(i-6e4)},{id:"2",type:"message",title:"User sent message",timestamp:new Date(i-45e3)},{id:"3",type:"approval",title:"Edit approved",timestamp:new Date(i-3e4)},{id:"4",type:"error",title:"Build failed",description:"TypeScript error in line 42",timestamp:new Date(i-15e3),severity:"error"},{id:"5",type:"file_change",title:"Modified: src/App.tsx",timestamp:new Date(i-5e3)},{id:"6",type:"system",title:"Agent session started",timestamp:new Date(i)}]}},x={args:{events:[]}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    events: [{
      id: "1",
      type: "tool_use",
      title: "Read file: src/App.tsx",
      timestamp: new Date(now - 60000)
    }, {
      id: "2",
      type: "message",
      title: "User sent message",
      timestamp: new Date(now - 45000)
    }, {
      id: "3",
      type: "approval",
      title: "Edit approved",
      timestamp: new Date(now - 30000)
    }, {
      id: "4",
      type: "error",
      title: "Build failed",
      description: "TypeScript error in line 42",
      timestamp: new Date(now - 15000),
      severity: "error"
    }, {
      id: "5",
      type: "file_change",
      title: "Modified: src/App.tsx",
      timestamp: new Date(now - 5000)
    }, {
      id: "6",
      type: "system",
      title: "Agent session started",
      timestamp: new Date(now)
    }]
  }
}`,...m.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    events: []
  }
}`,...x.parameters?.docs?.source}}};const J=["Default","Empty"];export{m as Default,x as Empty,J as __namedExportsOrder,G as default};
