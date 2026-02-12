import{j as t}from"./iframe-rZoXeK5l.js";import{c as r}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function m({data:e,height:n=300,className:p}){const o=Math.max(...e.map(s=>s.uptimeHours),1);return e.length===0?t.jsx("div",{className:r("flex items-center justify-center text-sm text-zinc-500",p),style:{height:n},children:"No uptime data available"}):t.jsxs("div",{className:r("w-full",p),children:[t.jsx("div",{className:"text-xs text-zinc-500 mb-2",children:"Uptime (hours)"}),t.jsx("div",{className:"flex items-end gap-px rounded-lg overflow-hidden",style:{height:n-40},role:"img","aria-label":"Uptime chart",children:e.map((s,u)=>{const l=s.uptimeHours/o*100;return t.jsx("div",{className:"flex-1 flex flex-col items-center justify-end",children:t.jsx("div",{className:r("w-full rounded-t-sm transition-all duration-300","bg-gradient-to-t from-cyan-600/80 to-cyan-400/40"),style:{height:`${Math.max(l,2)}%`},title:`${s.timestamp}: ${s.uptimeHours.toFixed(2)}h`})},`${s.timestamp}-${u}`)})}),t.jsxs("div",{className:"flex justify-between mt-1 text-[10px] text-zinc-500",children:[t.jsx("span",{children:e[0]?.timestamp??""}),e.length>2&&t.jsx("span",{children:e[Math.floor(e.length/2)]?.timestamp??""}),t.jsx("span",{children:e[e.length-1]?.timestamp??""})]})]})}try{m.displayName="UptimeChart",m.__docgenInfo={description:"",displayName:"UptimeChart",props:{data:{defaultValue:null,description:"Time-series uptime data",name:"data",required:!0,type:{name:"UptimeDataPoint[]"}},height:{defaultValue:{value:"300"},description:"Chart height in px",name:"height",required:!1,type:{name:"number"}},className:{defaultValue:null,description:"Additional CSS classes",name:"className",required:!1,type:{name:"string"}}}}}catch{}const x={title:"Migrations/Studio/UptimeChart",component:m,parameters:{layout:"padded"},tags:["autodocs"]},a={args:{data:[{timestamp:"08:00",uptimeHours:2},{timestamp:"10:00",uptimeHours:4.5},{timestamp:"12:00",uptimeHours:6.2},{timestamp:"14:00",uptimeHours:8.1},{timestamp:"16:00",uptimeHours:10},{timestamp:"18:00",uptimeHours:12.3}]}},i={args:{data:[]}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    data: [{
      timestamp: "08:00",
      uptimeHours: 2.0
    }, {
      timestamp: "10:00",
      uptimeHours: 4.5
    }, {
      timestamp: "12:00",
      uptimeHours: 6.2
    }, {
      timestamp: "14:00",
      uptimeHours: 8.1
    }, {
      timestamp: "16:00",
      uptimeHours: 10.0
    }, {
      timestamp: "18:00",
      uptimeHours: 12.3
    }]
  }
}`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    data: []
  }
}`,...i.parameters?.docs?.source}}};const f=["Default","Empty"];export{a as Default,i as Empty,f as __namedExportsOrder,x as default};
