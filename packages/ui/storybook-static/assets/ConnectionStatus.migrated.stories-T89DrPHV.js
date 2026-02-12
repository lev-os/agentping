import{j as t}from"./iframe-CzJrb7DT.js";import{c as o}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function s({connected:e=!1,className:r}){return t.jsxs("div",{className:o("flex items-center gap-2 text-xs font-mono",r),children:[t.jsx("span",{className:o("w-2 h-2 rounded-full",e?"bg-[#00ff9d]":"bg-[#ff2a6d] animate-pulse")}),t.jsx("span",{className:e?"text-[#00ff9d]":"text-[#ff2a6d]",children:e?"Connected":"Disconnected"})]})}try{s.displayName="ConnectionStatus",s.__docgenInfo={description:"ConnectionStatus - Migrated from canvas package",displayName:"ConnectionStatus",props:{connected:{defaultValue:{value:"false"},description:"",name:"connected",required:!1,type:{name:"boolean"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const l={title:"Migrations/Canvas/ConnectionStatus",component:s,parameters:{layout:"centered"},tags:["autodocs"]},a={args:{connected:!0}},n={args:{connected:!1}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    connected: true
  }
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    connected: false
  }
}`,...n.parameters?.docs?.source}}};const m=["Connected","Disconnected"];export{a as Connected,n as Disconnected,m as __namedExportsOrder,l as default};
