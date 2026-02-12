import{T as n}from"./tool-invocation-CL_QdF8z.js";import"./iframe-CzJrb7DT.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CDN07tui.js";const u={title:"Migrations/WebUI/Root/ToolInvocation",component:n,parameters:{layout:"centered"},tags:["autodocs"]},r={args:{name:"search_codebase",args:{query:"useEffect cleanup",scope:"src/**/*.tsx"},status:"success",result:{matches:12,files:["App.tsx","Dashboard.tsx"]},duration:342}},s={args:{name:"build_project",args:{target:"production",minify:!0},status:"running"}},e={args:{name:"deploy",args:{env:"staging"},status:"error",result:"Error: Connection refused",duration:5200}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    name: "search_codebase",
    args: {
      query: "useEffect cleanup",
      scope: "src/**/*.tsx"
    },
    status: "success",
    result: {
      matches: 12,
      files: ["App.tsx", "Dashboard.tsx"]
    },
    duration: 342
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    name: "build_project",
    args: {
      target: "production",
      minify: true
    },
    status: "running"
  }
}`,...s.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    name: "deploy",
    args: {
      env: "staging"
    },
    status: "error",
    result: "Error: Connection refused",
    duration: 5200
  }
}`,...e.parameters?.docs?.source}}};const i=["Default","Running","Error"];export{r as Default,e as Error,s as Running,i as __namedExportsOrder,u as default};
