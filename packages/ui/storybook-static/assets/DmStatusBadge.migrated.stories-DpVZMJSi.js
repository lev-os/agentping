import{j as i}from"./iframe-rZoXeK5l.js";import{c as p}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";const m={starting:"bg-yellow-500/20 text-yellow-400 border-yellow-500/30",online:"bg-green-500/20 text-green-400 border-green-500/30",failed:"bg-red-500/20 text-red-400 border-red-500/30",stopped:"bg-zinc-500/20 text-zinc-400 border-zinc-500/30",unhealthy:"bg-orange-500/20 text-orange-400 border-orange-500/30"};function d({status:o,healthy:c,className:u}){const l=o==="online"&&c===!1?"unhealthy":o;return i.jsx("span",{className:p("inline-block px-2 py-0.5 text-xs font-mono rounded border",m[l],u),"data-status":l,children:l})}try{d.displayName="DmStatusBadge",d.__docgenInfo={description:"DmStatusBadge - Migrated from dashboard-manager-ui",displayName:"DmStatusBadge",props:{status:{defaultValue:null,description:"",name:"status",required:!0,type:{name:"enum",value:[{value:'"starting"'},{value:'"online"'},{value:'"failed"'},{value:'"stopped"'}]}},healthy:{defaultValue:null,description:"",name:"healthy",required:!1,type:{name:"boolean"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const f={title:"Migrations/DashboardManager/StatusBadge",component:d,parameters:{layout:"centered"},tags:["autodocs"]},e={args:{status:"online",healthy:!0}},a={args:{status:"online",healthy:!1}},t={args:{status:"starting"}},r={args:{status:"failed"}},s={args:{status:"stopped"}},n=e;e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    status: "online",
    healthy: true
  }
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    status: "online",
    healthy: false
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    status: "starting"
  }
}`,...t.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    status: "failed"
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    status: "stopped"
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:"Online",...n.parameters?.docs?.source}}};const S=["Online","Unhealthy","Starting","Failed","Stopped","Default"];export{n as Default,r as Failed,e as Online,t as Starting,s as Stopped,a as Unhealthy,S as __namedExportsOrder,f as default};
