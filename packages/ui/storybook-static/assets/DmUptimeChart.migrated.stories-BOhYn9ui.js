import{j as e}from"./iframe-rZoXeK5l.js";import{c as u}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function l(a){const o=Math.floor(a/1e3),t=Math.floor(o/60),s=Math.floor(t/60),r=Math.floor(s/24);return r>0?`${r}d ${s%24}h`:s>0?`${s}h ${t%60}m`:t>0?`${t}m ${o%60}s`:`${o}s`}function p({uptimeMs:a,className:o}){const t=a/36e5,s=Array.from({length:24},(r,d)=>({hour:d,pct:Math.min(100,Math.min(t,d+1)/24*100)}));return e.jsxs("div",{className:u("border border-cyan-500/20 bg-black/60 rounded-lg p-4",o),children:[e.jsxs("h3",{className:"text-sm font-semibold text-white/80 mb-4",children:["Uptime: ",l(a)]}),e.jsx("div",{className:"flex items-end gap-px h-[160px]",children:s.map(r=>e.jsx("div",{className:"flex-1 bg-green-500/60 rounded-t transition-all duration-300",style:{height:`${r.pct}%`},title:`${r.hour}h`},r.hour))}),e.jsxs("div",{className:"flex justify-between mt-1 text-[10px] font-mono text-white/30",children:[e.jsx("span",{children:"0h"}),e.jsx("span",{children:"12h"}),e.jsx("span",{children:"24h"})]})]})}try{p.displayName="DmUptimeChart",p.__docgenInfo={description:"DmUptimeChart - Migrated from dashboard-manager-ui",displayName:"DmUptimeChart",props:{uptimeMs:{defaultValue:null,description:"",name:"uptimeMs",required:!0,type:{name:"number"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const x={title:"Migrations/DashboardManager/UptimeChart",component:p,parameters:{layout:"centered"},tags:["autodocs"]},n={args:{uptimeMs:1e3*60*30}},m={args:{uptimeMs:1e3*60*60*18}},i={args:{uptimeMs:1e3*60*60*72}},c=n;n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    uptimeMs: 1000 * 60 * 30
  }
}`,...n.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    uptimeMs: 1000 * 60 * 60 * 18
  }
}`,...m.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    uptimeMs: 1000 * 60 * 60 * 72
  }
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:"ShortUptime",...c.parameters?.docs?.source}}};const M=["ShortUptime","LongUptime","MultiDay","Default"];export{c as Default,m as LongUptime,i as MultiDay,n as ShortUptime,M as __namedExportsOrder,x as default};
