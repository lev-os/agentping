import{r as u,j as e}from"./iframe-CzJrb7DT.js";import{c as f}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function l({dashboard:t,metrics:a,onBack:n,onRestart:s,onOpen:r,className:h}){const[d,m]=u.useState(!1),p=async()=>{if(s){m(!0);try{await s()}finally{m(!1)}}},x=t.status.status==="online"&&t.status.healthy===!1?"unhealthy":t.status.status;return e.jsxs("div",{className:f("space-y-6",h),children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[n&&e.jsx("button",{onClick:n,className:"text-cyan-500/60 hover:text-cyan-400 transition-colors",children:e.jsx("svg",{className:"w-5 h-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:2,children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M10 19l-7-7m0 0l7-7m-7 7h18"})})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-lg font-semibold text-white",children:t.config.name}),e.jsx("code",{className:"text-xs font-mono text-cyan-500/50",children:t.id})]})]}),e.jsxs("div",{className:"flex gap-2",children:[r&&e.jsx("button",{onClick:r,disabled:!t.status.port,className:"px-3 py-1.5 text-xs font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded hover:bg-cyan-500/30 transition-colors disabled:opacity-40",children:"Open Dashboard"}),s&&e.jsx("button",{onClick:p,disabled:d,className:"px-3 py-1.5 text-xs font-mono bg-white/5 text-white/60 border border-white/10 rounded hover:bg-white/10 transition-colors disabled:opacity-40",children:d?"Restarting...":"Restart"})]})]}),e.jsxs("div",{className:"grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-white/[0.02] rounded-lg border border-white/5",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-xs text-white/40 block",children:"Status"}),e.jsx("span",{className:"text-sm font-mono text-white/80",children:x})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-xs text-white/40 block",children:"Port"}),e.jsx("span",{className:"text-sm font-mono text-white/80",children:t.status.port||"-"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-xs text-white/40 block",children:"PID"}),e.jsx("span",{className:"text-sm font-mono text-white/80",children:t.status.pid||"-"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-xs text-white/40 block",children:"Restarts"}),e.jsx("span",{className:"text-sm font-mono text-white/80",children:t.status.restartAttempts})]}),t.status.startedAt&&e.jsxs("div",{children:[e.jsx("span",{className:"text-xs text-white/40 block",children:"Started"}),e.jsx("span",{className:"text-sm font-mono text-white/80",children:new Date(t.status.startedAt).toLocaleString()})]})]}),e.jsxs("div",{className:"p-4 bg-white/[0.02] rounded-lg border border-white/5",children:[e.jsx("h2",{className:"text-sm font-semibold text-white/80 mb-3",children:"Settings"}),e.jsxs("div",{className:"grid grid-cols-2 gap-3 text-xs",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-white/40 block",children:"Port Range"}),e.jsxs("span",{className:"font-mono text-white/70",children:[t.config.port_range[0]," - ",t.config.port_range[1]]})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-white/40 block",children:"Command"}),e.jsx("code",{className:"font-mono text-cyan-400/80",children:t.config.command})]}),e.jsxs("div",{className:"col-span-2",children:[e.jsx("span",{className:"text-white/40 block",children:"Working Directory"}),e.jsx("code",{className:"font-mono text-cyan-400/80",children:t.config.cwd})]}),t.config.health_check&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-white/40 block",children:"Health Check"}),e.jsx("span",{className:"font-mono text-white/70",children:t.config.health_check.type})]}),t.config.health_check.path&&e.jsxs("div",{children:[e.jsx("span",{className:"text-white/40 block",children:"Health Path"}),e.jsx("code",{className:"font-mono text-cyan-400/80",children:t.config.health_check.path})]})]})]})]}),a&&e.jsxs("div",{className:"p-4 bg-white/[0.02] rounded-lg border border-white/5",children:[e.jsx("h2",{className:"text-sm font-semibold text-white/80 mb-3",children:"Metrics"}),e.jsxs("div",{className:"grid grid-cols-2 gap-4 text-xs",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-white/40 block",children:"Uptime"}),e.jsx("span",{className:"text-lg font-bold text-green-400 font-mono",children:g(a.uptime_ms)})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-white/40 block",children:"Total Restarts"}),e.jsx("span",{className:"text-lg font-bold text-yellow-400 font-mono",children:a.restarts})]})]})]})]})}function g(t){const a=Math.floor(t/1e3),n=Math.floor(a/60),s=Math.floor(n/60),r=Math.floor(s/24);return r>0?`${r}d ${s%24}h`:s>0?`${s}h ${n%60}m`:n>0?`${n}m ${a%60}s`:`${a}s`}try{l.displayName="DmDashboardDetail",l.__docgenInfo={description:"DmDashboardDetail - Migrated from dashboard-manager-ui",displayName:"DmDashboardDetail",props:{dashboard:{defaultValue:null,description:"",name:"dashboard",required:!0,type:{name:"DmDashboard"}},metrics:{defaultValue:null,description:"",name:"metrics",required:!1,type:{name:"DmDashboardMetrics"}},onBack:{defaultValue:null,description:"",name:"onBack",required:!1,type:{name:"(() => void)"}},onRestart:{defaultValue:null,description:"",name:"onRestart",required:!1,type:{name:"(() => void | Promise<void>)"}},onOpen:{defaultValue:null,description:"",name:"onOpen",required:!1,type:{name:"(() => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const b={title:"Migrations/DashboardManager/DashboardDetail",component:l,parameters:{layout:"padded"},tags:["autodocs"]},o={args:{dashboard:{id:"grafana-1",config:{name:"Grafana",command:"npm start",cwd:"/app/grafana",port_range:[3e3,3100]},status:{status:"online",healthy:!0,port:3042,pid:12345,restartAttempts:1,startedAt:new Date(Date.now()-36e5).toISOString()}},metrics:{uptime_ms:36e5,restarts:1},onBack:()=>console.log("back"),onRestart:async()=>console.log("restart"),onOpen:()=>console.log("open")}},i={args:{dashboard:{id:"prometheus-1",config:{name:"Prometheus",command:"prometheus --config.file=prometheus.yml",cwd:"/app/prom",port_range:[9090,9099]},status:{status:"failed",restartAttempts:5}}}},c=o;o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    dashboard: {
      id: "grafana-1",
      config: {
        name: "Grafana",
        command: "npm start",
        cwd: "/app/grafana",
        port_range: [3000, 3100]
      },
      status: {
        status: "online",
        healthy: true,
        port: 3042,
        pid: 12345,
        restartAttempts: 1,
        startedAt: new Date(Date.now() - 3600000).toISOString()
      }
    },
    metrics: {
      uptime_ms: 3600000,
      restarts: 1
    },
    onBack: () => console.log("back"),
    onRestart: async () => console.log("restart"),
    onOpen: () => console.log("open")
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    dashboard: {
      id: "prometheus-1",
      config: {
        name: "Prometheus",
        command: "prometheus --config.file=prometheus.yml",
        cwd: "/app/prom",
        port_range: [9090, 9099]
      },
      status: {
        status: "failed",
        restartAttempts: 5
      }
    }
  }
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:"Online",...c.parameters?.docs?.source}}};const y=["Online","Failed","Default"];export{c as Default,i as Failed,o as Online,y as __namedExportsOrder,b as default};
