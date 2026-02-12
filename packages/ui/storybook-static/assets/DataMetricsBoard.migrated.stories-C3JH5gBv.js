import{j as a}from"./iframe-rZoXeK5l.js";import{c as t}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function r({metrics:s=[],title:l,columns:i=3,className:c}){return a.jsxs("div",{className:t("border border-cyan-500/20 bg-black/60 rounded-lg p-4",c),children:[l&&a.jsx("div",{className:"text-xs font-mono text-cyan-400 uppercase tracking-wider mb-3",children:l}),a.jsx("div",{className:t("grid gap-3",`grid-cols-${i}`),children:s.map(e=>a.jsxs("div",{className:"bg-black/40 rounded border border-cyan-500/10 p-3",children:[a.jsx("div",{className:"text-xs font-mono text-cyan-500/60 uppercase mb-1",children:e.label}),a.jsxs("div",{className:"text-xl font-mono text-cyan-300",children:[e.value,e.unit&&a.jsx("span",{className:"text-xs text-cyan-500/40 ml-1",children:e.unit})]}),e.change!==void 0&&a.jsxs("div",{className:t("text-xs font-mono mt-1",e.change>=0?"text-green-400":"text-red-400"),children:[e.change>=0?"+":"",e.change,"%"]})]},e.id))})]})}try{r.displayName="DataMetricsBoard",r.__docgenInfo={description:"DataMetricsBoard - Migrated from",displayName:"DataMetricsBoard",props:{metrics:{defaultValue:{value:"[]"},description:"",name:"metrics",required:!1,type:{name:"DataMetric[]"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}},columns:{defaultValue:{value:"3"},description:"",name:"columns",required:!1,type:{name:"enum",value:[{value:"2"},{value:"3"},{value:"4"}]}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const m={title:"Migrations/WebUI/Data/DataMetricsBoard",component:r,parameters:{layout:"centered"},tags:["autodocs"]},n={args:{title:"System Metrics",metrics:[{id:"cpu",label:"CPU Usage",value:"72%",change:5.2},{id:"mem",label:"Memory",value:"8.2",unit:"GB",change:-1.4},{id:"disk",label:"Disk I/O",value:"340",unit:"MB/s",change:12},{id:"net",label:"Network",value:"1.2",unit:"Gbps",change:.3},{id:"req",label:"Requests",value:"14.2k",change:8.7},{id:"err",label:"Error Rate",value:"0.03%",change:-2.1}]}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    title: "System Metrics",
    metrics: [{
      id: "cpu",
      label: "CPU Usage",
      value: "72%",
      change: 5.2
    }, {
      id: "mem",
      label: "Memory",
      value: "8.2",
      unit: "GB",
      change: -1.4
    }, {
      id: "disk",
      label: "Disk I/O",
      value: "340",
      unit: "MB/s",
      change: 12.0
    }, {
      id: "net",
      label: "Network",
      value: "1.2",
      unit: "Gbps",
      change: 0.3
    }, {
      id: "req",
      label: "Requests",
      value: "14.2k",
      change: 8.7
    }, {
      id: "err",
      label: "Error Rate",
      value: "0.03%",
      change: -2.1
    }]
  }
}`,...n.parameters?.docs?.source}}};const p=["Default"];export{n as Default,p as __namedExportsOrder,m as default};
