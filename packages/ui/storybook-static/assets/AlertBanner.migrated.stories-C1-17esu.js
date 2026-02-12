import{A as t}from"./alert-banner-CUkL1MLj.js";import"./iframe-rZoXeK5l.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CDN07tui.js";const i={title:"Migrations/WebUI/AlertBanner",component:t,tags:["autodocs"]},e={args:{message:"System update scheduled for midnight.",type:"info",title:"Scheduled Maintenance"}},r={args:{message:"Memory usage approaching threshold.",type:"warning"}},a={args:{message:"Connection to upstream lost.",type:"error",title:"Critical"}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    message: "System update scheduled for midnight.",
    type: "info",
    title: "Scheduled Maintenance"
  }
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    message: "Memory usage approaching threshold.",
    type: "warning"
  }
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    message: "Connection to upstream lost.",
    type: "error",
    title: "Critical"
  }
}`,...a.parameters?.docs?.source}}};const m=["Default","Warning","Error"];export{e as Default,a as Error,r as Warning,m as __namedExportsOrder,i as default};
