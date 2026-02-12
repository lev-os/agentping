import{j as e}from"./iframe-CzJrb7DT.js";import{c as o}from"./utils-CDN07tui.js";import{A as N}from"./activity-DVBwJ7LX.js";import{R as l}from"./rotate-cw-BXSRz9xa.js";import{E as j}from"./external-link-CXonPFJV.js";import{C as u}from"./circle-x-Bb9hQjof.js";import{C as b}from"./circle-alert-DL588MOd.js";import{C as v}from"./circle-check-C29SBQ1w.js";import"./preload-helper-PPVm8Dsz.js";import"./createLucideIcon-qiJ1pPWj.js";const y={online:e.jsx(v,{size:16,className:"text-emerald-400"}),offline:e.jsx(u,{size:16,className:"text-zinc-500"}),checking:e.jsx(b,{size:16,className:"text-zinc-400 animate-pulse"}),restarting:e.jsx(l,{size:16,className:"text-amber-400 animate-spin"}),failed:e.jsx(u,{size:16,className:"text-red-400"})},z={online:"ONLINE",offline:"OFFLINE",checking:"CHECKING...",restarting:"RESTARTING...",failed:"FAILED"};function c({dashboards:s=[],loading:f=!1,error:d=null,onSelectDashboard:p,onOpenDashboard:h,onRestartDashboard:m,className:g}){const x=s.filter(t=>t.status==="online").length;return e.jsxs("div",{className:o("flex flex-col h-full animate-in fade-in duration-300",g),children:[e.jsxs("div",{className:"flex items-center justify-between px-4 py-3 border-b border-zinc-800",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(N,{size:18,className:"text-cyan-500"}),e.jsx("h2",{className:"text-sm font-semibold text-zinc-100",children:"Dashboard Navigator"})]}),e.jsxs("span",{className:o("text-xs font-mono",x===s.length?"text-emerald-400":"text-amber-400"),children:[x,"/",s.length," ONLINE"]})]}),f&&e.jsxs("div",{className:"flex items-center justify-center py-8 text-xs text-zinc-500",children:[e.jsx(l,{size:14,className:"animate-spin mr-2"}),"Loading dashboard status..."]}),d&&e.jsxs("div",{className:"px-4 py-2 text-xs text-red-400",children:["Dashboard API error: ",d]}),e.jsx("div",{className:"flex-1 overflow-y-auto p-4",children:e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3",children:s.map(t=>e.jsxs("div",{className:o("rounded-xl border bg-zinc-900/50","cursor-pointer transition-all duration-150","hover:bg-zinc-800/50",t.status==="online"?"border-emerald-500/20 hover:border-emerald-500/30":t.status==="failed"?"border-red-500/20":"border-zinc-700/30"),onClick:()=>{t.status==="online"&&h?.(t.url)},children:[e.jsxs("div",{className:"flex items-center justify-between px-4 py-3",children:[e.jsxs("div",{className:"flex items-center gap-2 min-w-0",children:[e.jsx("h3",{className:"text-sm font-medium text-zinc-200 truncate",children:t.name}),t.status==="online"&&e.jsx(j,{size:12,className:"text-zinc-500 flex-shrink-0"})]}),e.jsxs("div",{className:"flex items-center gap-1.5",children:[y[t.status],e.jsx("span",{className:"text-[10px] text-zinc-500",children:z[t.status]})]})]}),e.jsxs("div",{className:"px-4 pb-3 space-y-1.5",children:[t.description&&e.jsx("p",{className:"text-xs text-zinc-500",children:t.description}),e.jsxs("div",{className:"flex items-center gap-3 text-[10px] text-zinc-600",children:[e.jsxs("span",{children:["PORT ",t.port]}),e.jsx("code",{className:"truncate",children:t.url})]}),(t.restartAttempts??0)>0&&e.jsxs("span",{className:"text-[10px] text-amber-500",children:["Restart attempts: ",t.restartAttempts]})]}),e.jsxs("div",{className:"flex items-center gap-2 px-4 py-2 border-t border-zinc-800/50",children:[t.status==="online"&&e.jsx("span",{className:"text-[10px] text-zinc-500",children:"Click to open"}),(t.status==="offline"||t.status==="failed")&&m&&e.jsxs("button",{onClick:i=>{i.stopPropagation(),m(t.id)},className:"flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors",children:[e.jsx(l,{size:10}),"Restart"]}),p&&e.jsx("button",{onClick:i=>{i.stopPropagation(),p(t.id)},className:"text-[10px] text-zinc-500 hover:text-zinc-300 ml-auto transition-colors",children:"Details"})]})]},t.id))})})]})}try{c.displayName="NavigatorWithDashboards",c.__docgenInfo={description:"",displayName:"NavigatorWithDashboards",props:{dashboards:{defaultValue:{value:"[]"},description:"Dashboard list (original fetches from API; migration accepts as props)",name:"dashboards",required:!1,type:{name:"DashboardItem[]"}},loading:{defaultValue:{value:"false"},description:"Loading state",name:"loading",required:!1,type:{name:"boolean"}},error:{defaultValue:{value:"null"},description:"Error message",name:"error",required:!1,type:{name:"string | null"}},onSelectDashboard:{defaultValue:null,description:"Dashboard select handler",name:"onSelectDashboard",required:!1,type:{name:"((dashboardId: string) => void)"}},onOpenDashboard:{defaultValue:null,description:"Open dashboard URL",name:"onOpenDashboard",required:!1,type:{name:"((url: string) => void)"}},onRestartDashboard:{defaultValue:null,description:"Restart a dashboard",name:"onRestartDashboard",required:!1,type:{name:"((dashboardId: string) => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const O={title:"Migrations/Studio/NavigatorWithDashboards",component:c,parameters:{layout:"padded"},tags:["autodocs"],decorators:[s=>e.jsx("div",{style:{height:600},children:e.jsx(s,{})})]},a={args:{dashboards:[{id:"agentping",name:"AgentPing",url:"http://localhost:6006",port:6006,status:"online",description:"Component gallery"},{id:"sofia",name:"Sofia",url:"http://localhost:6007",port:6007,status:"online",description:"Sofia Storybook"},{id:"web-ui",name:"Web UI",url:"http://localhost:3000",port:3e3,status:"offline",description:"AgentPing web adapter"},{id:"canvas",name:"Canvas",url:"http://localhost:5173",port:5173,status:"failed",description:"Canvas renderer",restartAttempts:2}],onSelectDashboard:()=>{},onOpenDashboard:()=>{},onRestartDashboard:()=>{}}},n={args:{loading:!0}},r={args:{error:"Connection refused",dashboards:[]}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    dashboards: [{
      id: "agentping",
      name: "AgentPing",
      url: "http://localhost:6006",
      port: 6006,
      status: "online",
      description: "Component gallery"
    }, {
      id: "sofia",
      name: "Sofia",
      url: "http://localhost:6007",
      port: 6007,
      status: "online",
      description: "Sofia Storybook"
    }, {
      id: "web-ui",
      name: "Web UI",
      url: "http://localhost:3000",
      port: 3000,
      status: "offline",
      description: "AgentPing web adapter"
    }, {
      id: "canvas",
      name: "Canvas",
      url: "http://localhost:5173",
      port: 5173,
      status: "failed",
      description: "Canvas renderer",
      restartAttempts: 2
    }],
    onSelectDashboard: () => {},
    onOpenDashboard: () => {},
    onRestartDashboard: () => {}
  }
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true
  }
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    error: "Connection refused",
    dashboards: []
  }
}`,...r.parameters?.docs?.source}}};const w=["Default","Loading","WithError"];export{a as Default,n as Loading,r as WithError,w as __namedExportsOrder,O as default};
