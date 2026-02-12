import{j as e}from"./iframe-CzJrb7DT.js";import{c as i}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function f(a){const m=Date.now()-a.getTime(),n=Math.floor(m/1e3),o=Math.floor(n/60),s=Math.floor(o/60),r=Math.floor(s/24);return r>0?`${r}d ${s%24}h`:s>0?`${s}h ${o%60}m`:o>0?`${o}m ${n%60}s`:`${n}s`}const g={starting:"text-yellow-400",online:"text-green-400",failed:"text-red-400",stopped:"text-zinc-400",unhealthy:"text-orange-400"};function u({dashboards:a,isLoading:m,error:n,onRowClick:o,onViewDetails:s,onCreateNew:r,onRetry:h,className:p}){return m?e.jsx("div",{className:i("text-center py-12 text-cyan-500/40 font-mono text-sm",p),children:"Loading dashboards..."}):n?e.jsxs("div",{className:i("text-center py-12",p),children:[e.jsxs("p",{className:"text-red-400/80 font-mono text-sm mb-2",children:["Error: ",n]}),h&&e.jsx("button",{onClick:h,className:"text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors",children:"Retry"})]}):e.jsxs("div",{className:i("space-y-4",p),children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h1",{className:"text-lg font-semibold text-white",children:"Dashboards"}),r&&e.jsx("button",{onClick:r,className:"px-3 py-1.5 text-xs font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded hover:bg-cyan-500/30 transition-colors",children:"+ New Dashboard"})]}),a.length===0?e.jsxs("div",{className:"text-center py-12 text-cyan-500/30 font-mono text-sm",children:[e.jsx("p",{children:"No dashboards yet"}),r&&e.jsx("button",{onClick:r,className:"mt-2 text-cyan-400 hover:text-cyan-300 transition-colors",children:"Create your first dashboard"})]}):e.jsx("div",{className:"border border-cyan-500/10 rounded-lg overflow-hidden",children:e.jsxs("table",{className:"w-full text-xs font-mono",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-cyan-500/10 bg-black/40 text-left text-cyan-500/40 uppercase tracking-wider",children:[e.jsx("th",{className:"px-3 py-2",children:"Name"}),e.jsx("th",{className:"px-3 py-2",children:"Status"}),e.jsx("th",{className:"px-3 py-2",children:"Port"}),e.jsx("th",{className:"px-3 py-2",children:"PID"}),e.jsx("th",{className:"px-3 py-2",children:"Uptime"}),e.jsx("th",{className:"px-3 py-2",children:"Restarts"}),e.jsx("th",{className:"px-3 py-2",children:"Actions"})]})}),e.jsx("tbody",{children:a.map(t=>{const x=t.status.status==="online"&&t.status.healthy===!1?"unhealthy":t.status.status;return e.jsxs("tr",{className:"border-b border-cyan-500/5 hover:bg-cyan-500/5 cursor-pointer transition-colors",role:"button","aria-label":`Select dashboard ${t.config.name}`,tabIndex:0,onClick:()=>o?.(t),children:[e.jsxs("td",{className:"px-3 py-2",children:[e.jsx("div",{className:"text-cyan-300",children:t.config.name}),e.jsx("div",{className:"text-cyan-500/30",children:t.id})]}),e.jsx("td",{className:i("px-3 py-2",g[x]),children:x}),e.jsx("td",{className:"px-3 py-2 text-white/60",children:t.status.port||"-"}),e.jsx("td",{className:"px-3 py-2 text-white/60",children:t.status.pid||"-"}),e.jsx("td",{className:"px-3 py-2 text-white/60",children:t.status.startedAt?f(new Date(t.status.startedAt)):"-"}),e.jsx("td",{className:"px-3 py-2 text-white/60",children:t.status.restartAttempts}),e.jsx("td",{className:"px-3 py-2",children:s&&e.jsx("button",{onClick:y=>{y.stopPropagation(),s(t.id)},className:"text-cyan-400 hover:text-cyan-300 transition-colors","aria-label":`View details for ${t.config.name}`,children:"View"})})]},t.id)})})]})})]})}try{u.displayName="DmDashboardList",u.__docgenInfo={description:"DmDashboardList - Migrated from dashboard-manager-ui",displayName:"DmDashboardList",props:{dashboards:{defaultValue:null,description:"",name:"dashboards",required:!0,type:{name:"DmDashboardSummary[]"}},isLoading:{defaultValue:null,description:"",name:"isLoading",required:!1,type:{name:"boolean"}},error:{defaultValue:null,description:"",name:"error",required:!1,type:{name:"string | null"}},onRowClick:{defaultValue:null,description:"",name:"onRowClick",required:!1,type:{name:"((dashboard: DmDashboardSummary) => void)"}},onViewDetails:{defaultValue:null,description:"",name:"onViewDetails",required:!1,type:{name:"((dashboardId: string) => void)"}},onCreateNew:{defaultValue:null,description:"",name:"onCreateNew",required:!1,type:{name:"(() => void)"}},onRetry:{defaultValue:null,description:"",name:"onRetry",required:!1,type:{name:"(() => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const w={title:"Migrations/DashboardManager/DashboardList",component:u,parameters:{layout:"padded"},tags:["autodocs"]},l={args:{dashboards:[{id:"grafana-1",config:{name:"Grafana",port_range:[3e3,3100]},status:{status:"online",healthy:!0,port:3042,pid:12345,restartAttempts:0,startedAt:new Date(Date.now()-72e5).toISOString()}},{id:"prom-1",config:{name:"Prometheus",port_range:[9090,9099]},status:{status:"failed",restartAttempts:3}}],onViewDetails:a=>console.log("view:",a),onCreateNew:()=>console.log("create")}},d={args:{dashboards:[],onCreateNew:()=>console.log("create")}},c={args:{dashboards:[],isLoading:!0}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    dashboards: [{
      id: "grafana-1",
      config: {
        name: "Grafana",
        port_range: [3000, 3100]
      },
      status: {
        status: "online",
        healthy: true,
        port: 3042,
        pid: 12345,
        restartAttempts: 0,
        startedAt: new Date(Date.now() - 7200000).toISOString()
      }
    }, {
      id: "prom-1",
      config: {
        name: "Prometheus",
        port_range: [9090, 9099]
      },
      status: {
        status: "failed",
        restartAttempts: 3
      }
    }],
    onViewDetails: id => console.log("view:", id),
    onCreateNew: () => console.log("create")
  }
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    dashboards: [],
    onCreateNew: () => console.log("create")
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    dashboards: [],
    isLoading: true
  }
}`,...c.parameters?.docs?.source}}};const D=["Default","Empty","Loading"];export{l as Default,d as Empty,c as Loading,D as __namedExportsOrder,w as default};
