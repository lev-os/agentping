import{A as t}from"./alert-feed-9yjYnQhz.js";import"./iframe-CzJrb7DT.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CDN07tui.js";const i={title:"Migrations/WebUI/Logs/AlertFeed",component:t,parameters:{layout:"centered"},tags:["autodocs"]},e={args:{title:"Alerts",alerts:[{id:"1",severity:"critical",title:"Memory Alert",message:"Memory usage above 90%",timestamp:"2 min ago",source:"monitor-agent"},{id:"2",severity:"low",title:"Deployment",message:"New deployment detected",timestamp:"10 min ago",source:"deploy-bot"},{id:"3",severity:"high",title:"Latency Spike",message:"API latency spike on /v2/query",timestamp:"15 min ago",source:"apm-service"}]}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Alerts",
    alerts: [{
      id: "1",
      severity: "critical",
      title: "Memory Alert",
      message: "Memory usage above 90%",
      timestamp: "2 min ago",
      source: "monitor-agent"
    }, {
      id: "2",
      severity: "low",
      title: "Deployment",
      message: "New deployment detected",
      timestamp: "10 min ago",
      source: "deploy-bot"
    }, {
      id: "3",
      severity: "high",
      title: "Latency Spike",
      message: "API latency spike on /v2/query",
      timestamp: "15 min ago",
      source: "apm-service"
    }]
  }
}`,...e.parameters?.docs?.source}}};const n=["Default"];export{e as Default,n as __namedExportsOrder,i as default};
