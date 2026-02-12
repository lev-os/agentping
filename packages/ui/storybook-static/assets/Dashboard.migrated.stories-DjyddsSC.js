import{j as e}from"./iframe-CzJrb7DT.js";import{c as d}from"./utils-CDN07tui.js";import{L as u}from"./loader-circle-0-I84ZsA.js";import{Z as x}from"./zap-CdurmLTa.js";import{C as g,H as f}from"./hard-drive-B0y5Q7u_.js";import{B as p}from"./bot-BaD4Zin9.js";import{A as h}from"./activity-DVBwJ7LX.js";import{T as j}from"./terminal-Cdo0Lett.js";import{R as b}from"./refresh-cw-CXK_XNXP.js";import"./preload-helper-PPVm8Dsz.js";import"./createLucideIcon-qiJ1pPWj.js";function l({icon:s,label:a,value:i,subValue:n,color:r}){return e.jsxs("div",{className:"rounded-xl border border-zinc-800 bg-zinc-900/50 p-4",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx("span",{className:d("text-zinc-400",r),children:s}),e.jsx("span",{className:"text-xs text-zinc-500",children:a})]}),e.jsx("div",{className:"text-2xl font-bold text-zinc-100 tabular-nums",children:i}),n&&e.jsx("div",{className:"text-xs text-zinc-500 mt-1",children:n})]})}function m({telemetry:s,quickOps:a=[],recentActivity:i=[],loading:n=!1,className:r}){return n?e.jsx("div",{className:d("flex items-center justify-center h-full",r),children:e.jsxs("div",{className:"flex flex-col items-center gap-3",children:[e.jsx(u,{size:24,className:"text-cyan-500 animate-spin"}),e.jsx("span",{className:"text-sm text-zinc-500",children:"Loading dashboard..."})]})}):e.jsxs("div",{className:d("flex flex-col gap-6 p-6 h-full overflow-y-auto",r),children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center",children:e.jsx(x,{size:20,className:"text-cyan-400"})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-lg font-semibold text-zinc-100",children:"Mission Control"}),e.jsx("p",{className:"text-xs text-zinc-500",children:"System overview and quick operations"})]})]}),s&&e.jsxs("div",{className:"grid grid-cols-2 lg:grid-cols-4 gap-3",children:[e.jsx(l,{icon:e.jsx(g,{size:16}),label:"CPU Usage",value:`${s.cpuUsage}%`,color:"text-cyan-400"}),e.jsx(l,{icon:e.jsx(f,{size:16}),label:"Memory",value:`${s.memoryUsage}%`,color:"text-purple-400"}),e.jsx(l,{icon:e.jsx(p,{size:16}),label:"Active Agents",value:s.activeAgents,subValue:`${s.totalTasks} tasks total`}),e.jsx(l,{icon:e.jsx(h,{size:16}),label:"Completed",value:s.completedTasks,subValue:`Uptime: ${s.uptime}`,color:"text-emerald-400"})]}),a.length>0&&e.jsxs("div",{children:[e.jsx("h2",{className:"text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3",children:"Quick Operations"}),e.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-4 gap-2",children:a.map(t=>e.jsxs("button",{onClick:t.action,className:d("flex items-center gap-2 px-4 py-3 rounded-xl","bg-zinc-800/30 border border-zinc-700/30","text-sm text-zinc-300 hover:text-zinc-100","hover:bg-zinc-800/50 hover:border-zinc-600/30","transition-all duration-150"),children:[e.jsx("span",{className:"text-cyan-400",children:t.icon}),t.label]},t.id))})]}),i.length>0&&e.jsxs("div",{children:[e.jsx("h2",{className:"text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3",children:"Recent Activity"}),e.jsx("div",{className:"rounded-xl border border-zinc-800 bg-zinc-900/50 divide-y divide-zinc-800/50",children:i.map(t=>e.jsxs("div",{className:"flex items-center justify-between px-4 py-2.5",children:[e.jsx("span",{className:"text-xs text-zinc-300",children:t.title}),e.jsx("span",{className:"text-[10px] text-zinc-600",children:t.time})]},t.id))})]})]})}try{m.displayName="Dashboard",m.__docgenInfo={description:"",displayName:"Dashboard",props:{telemetry:{defaultValue:null,description:"System telemetry data",name:"telemetry",required:!1,type:{name:"SystemTelemetry"}},quickOps:{defaultValue:{value:"[]"},description:"Quick operations",name:"quickOps",required:!1,type:{name:"QuickOperation[]"}},recentActivity:{defaultValue:{value:"[]"},description:"Recent activity events",name:"recentActivity",required:!1,type:{name:"{ id: string; title: string; time: string; }[]"}},loading:{defaultValue:{value:"false"},description:"Whether data is loading",name:"loading",required:!1,type:{name:"boolean"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const q={title:"Migrations/Studio/Dashboard",component:m,parameters:{layout:"fullscreen"},tags:["autodocs"],decorators:[s=>e.jsx("div",{style:{height:600},children:e.jsx(s,{})})]},c={args:{telemetry:{cpuUsage:45,memoryUsage:72,activeAgents:3,totalTasks:18,completedTasks:12,uptime:"4h 23m"},quickOps:[{id:"1",label:"New Agent",icon:e.jsx(p,{size:16})},{id:"2",label:"Run Tests",icon:e.jsx(j,{size:16})},{id:"3",label:"Deploy",icon:e.jsx(x,{size:16})},{id:"4",label:"Restart All",icon:e.jsx(b,{size:16})}],recentActivity:[{id:"1",title:"Agent completed refactor task",time:"2m ago"},{id:"2",title:"Build passed on main",time:"5m ago"},{id:"3",title:"New PR opened #142",time:"12m ago"}]}},o={args:{loading:!0}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    telemetry: {
      cpuUsage: 45,
      memoryUsage: 72,
      activeAgents: 3,
      totalTasks: 18,
      completedTasks: 12,
      uptime: "4h 23m"
    },
    quickOps: [{
      id: "1",
      label: "New Agent",
      icon: <Bot size={16} />
    }, {
      id: "2",
      label: "Run Tests",
      icon: <Terminal size={16} />
    }, {
      id: "3",
      label: "Deploy",
      icon: <Zap size={16} />
    }, {
      id: "4",
      label: "Restart All",
      icon: <RefreshCw size={16} />
    }],
    recentActivity: [{
      id: "1",
      title: "Agent completed refactor task",
      time: "2m ago"
    }, {
      id: "2",
      title: "Build passed on main",
      time: "5m ago"
    }, {
      id: "3",
      title: "New PR opened #142",
      time: "12m ago"
    }]
  }
}`,...c.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true
  }
}`,...o.parameters?.docs?.source}}};const D=["Default","Loading"];export{c as Default,o as Loading,D as __namedExportsOrder,q as default};
