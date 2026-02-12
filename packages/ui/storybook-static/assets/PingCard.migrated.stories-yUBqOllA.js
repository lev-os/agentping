import{j as a}from"./iframe-rZoXeK5l.js";import{c as d}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function r({ping:e,isSelected:o,onClick:s,className:l}){if(!e)return null;const n=e.payload,c=n.title||n.question||n.message||"Ping",i={step_approval:"📋",approval:"✅",question:"❓",selection:"🔘",research_request:"🔬",notification:"ℹ️"};return a.jsxs("div",{className:d("border rounded-lg p-3 cursor-pointer transition-colors",o?"border-cyan-400 bg-cyan-500/10":"border-cyan-500/20 bg-black/60 hover:border-cyan-500/40",l),onClick:s,children:[a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx("span",{className:"text-sm",children:i[e.type]||"📌"}),a.jsx("span",{className:"text-xs font-mono text-cyan-300 flex-1 truncate",children:c})]}),a.jsxs("div",{className:"flex items-center gap-2 mt-1",children:[a.jsx("span",{className:"text-[10px] font-mono text-cyan-500/40 uppercase",children:e.type.replace(/_/g," ")}),e.createdAt&&a.jsx("span",{className:"text-[10px] font-mono text-cyan-500/30 ml-auto",children:e.createdAt})]})]})}try{r.displayName="PingCard",r.__docgenInfo={description:"PingCard - Migrated from",displayName:"PingCard",props:{ping:{defaultValue:null,description:"",name:"ping",required:!1,type:{name:"PingCardPing"}},isSelected:{defaultValue:null,description:"",name:"isSelected",required:!1,type:{name:"boolean"}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"(() => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const g={title:"Migrations/WebUI/Root/PingCard",component:r,parameters:{layout:"centered"},tags:["autodocs"]},t={args:{ping:{id:"ping-001",type:"approval",payload:{title:"Deploy v2.1 to production"},createdAt:"2m ago"}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    ping: {
      id: "ping-001",
      type: "approval",
      payload: {
        title: "Deploy v2.1 to production"
      },
      createdAt: "2m ago"
    }
  }
}`,...t.parameters?.docs?.source}}};const y=["Default"];export{t as Default,y as __namedExportsOrder,g as default};
