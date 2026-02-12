import{j as e}from"./iframe-CzJrb7DT.js";import{c as t}from"./utils-CDN07tui.js";import{W as u}from"./wifi-DtHouLGL.js";import{W as f}from"./wifi-off-C6z6UAvp.js";import{R as g}from"./refresh-cw-CXK_XNXP.js";import{L as y}from"./loader-circle-0-I84ZsA.js";import{C as h}from"./circle-x-Bb9hQjof.js";import{C as j}from"./circle-check-big-BWy-AY5y.js";import"./preload-helper-PPVm8Dsz.js";import"./createLucideIcon-qiJ1pPWj.js";const C={pass:{icon:e.jsx(j,{size:14}),color:"text-emerald-400"},fail:{icon:e.jsx(h,{size:14}),color:"text-red-400"},running:{icon:e.jsx(y,{size:14,className:"animate-spin"}),color:"text-cyan-400"},pending:{icon:e.jsx("div",{className:"w-3.5 h-3.5 rounded-full border border-zinc-600"}),color:"text-zinc-500"}};function o({tests:a,isRunning:i=!1,onRunTests:d,className:p}){const r=a.filter(s=>s.status==="pass").length,n=a.filter(s=>s.status==="fail").length,x=n===0&&r===a.length;return e.jsxs("div",{className:t("flex flex-col",p),children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[x?e.jsx(u,{size:16,className:"text-emerald-400"}):n>0?e.jsx(f,{size:16,className:"text-red-400"}):e.jsx(u,{size:16,className:"text-zinc-400"}),e.jsx("span",{className:"text-sm font-medium text-zinc-200",children:"Diagnostics"})]}),d&&e.jsxs("button",{onClick:d,disabled:i,className:t("flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs","bg-zinc-800/50 border border-zinc-700/50","text-zinc-400 hover:text-zinc-200 transition-colors",i&&"opacity-50 cursor-not-allowed"),children:[e.jsx(g,{size:12,className:t(i&&"animate-spin")}),i?"Running...":"Run Tests"]})]}),e.jsxs("div",{className:"flex items-center gap-4 mb-4 text-xs",children:[e.jsxs("span",{className:"text-emerald-400",children:[r," passed"]}),n>0&&e.jsxs("span",{className:"text-red-400",children:[n," failed"]}),a.length-r-n>0&&e.jsxs("span",{className:"text-zinc-500",children:[a.length-r-n," pending"]})]}),e.jsx("div",{className:"space-y-1",children:a.map(s=>{const m=C[s.status];return e.jsxs("div",{className:t("flex items-center gap-3 px-3 py-2 rounded-lg","transition-colors",s.status==="fail"&&"bg-red-500/5"),children:[e.jsx("span",{className:t("flex-shrink-0",m.color),children:m.icon}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("span",{className:"text-xs text-zinc-300",children:s.name}),s.message&&e.jsx("p",{className:"text-[10px] text-zinc-500 truncate",children:s.message})]}),s.latency!=null&&e.jsxs("span",{className:"text-[10px] text-zinc-600 tabular-nums flex-shrink-0",children:[s.latency,"ms"]})]},s.id)})})]})}try{o.displayName="DiagnosticPanel",o.__docgenInfo={description:"",displayName:"DiagnosticPanel",props:{tests:{defaultValue:null,description:"Diagnostic test results",name:"tests",required:!0,type:{name:"TestResult[]"}},isRunning:{defaultValue:{value:"false"},description:"Whether tests are running",name:"isRunning",required:!1,type:{name:"boolean"}},onRunTests:{defaultValue:null,description:"Re-run all tests",name:"onRunTests",required:!1,type:{name:"(() => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const A={title:"Migrations/Studio/DiagnosticPanel",component:o,parameters:{layout:"padded"},tags:["autodocs"]},l={args:{tests:[{id:"1",name:"Claude Code Connection",status:"pass",latency:42},{id:"2",name:"MCP Server",status:"pass",latency:15},{id:"3",name:"File System Access",status:"pass",latency:3},{id:"4",name:"Terminal Bridge",status:"fail",message:"Connection timeout after 5000ms"},{id:"5",name:"Dashboard API",status:"running"}],onRunTests:()=>{}}},c={args:{tests:[{id:"1",name:"Claude Code",status:"pass",latency:38},{id:"2",name:"MCP Server",status:"pass",latency:12},{id:"3",name:"File System",status:"pass",latency:2}]}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    tests: [{
      id: "1",
      name: "Claude Code Connection",
      status: "pass",
      latency: 42
    }, {
      id: "2",
      name: "MCP Server",
      status: "pass",
      latency: 15
    }, {
      id: "3",
      name: "File System Access",
      status: "pass",
      latency: 3
    }, {
      id: "4",
      name: "Terminal Bridge",
      status: "fail",
      message: "Connection timeout after 5000ms"
    }, {
      id: "5",
      name: "Dashboard API",
      status: "running"
    }],
    onRunTests: () => {}
  }
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    tests: [{
      id: "1",
      name: "Claude Code",
      status: "pass",
      latency: 38
    }, {
      id: "2",
      name: "MCP Server",
      status: "pass",
      latency: 12
    }, {
      id: "3",
      name: "File System",
      status: "pass",
      latency: 2
    }]
  }
}`,...c.parameters?.docs?.source}}};const w=["Default","AllPassed"];export{c as AllPassed,l as Default,w as __namedExportsOrder,A as default};
