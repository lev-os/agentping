import{r as b,j as a}from"./iframe-CzJrb7DT.js";import{c as l}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function c({checked:s,onChange:u,label:i,disabled:o=!1,className:m}){const[p,g]=b.useState(s??!1),e=s??p,f=()=>{if(o)return;const d=!e;g(d),u?.(d)};return a.jsxs("button",{type:"button",role:"switch","aria-checked":e,disabled:o,onClick:f,className:l("inline-flex items-center gap-3 font-mono text-sm select-none",o&&"opacity-40 cursor-not-allowed",m),children:[a.jsx("span",{className:l("relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 transition-colors duration-200",e?"bg-emerald-500/60 border-emerald-400":"bg-white/10 border-cyan-500/20"),children:a.jsx("span",{className:l("pointer-events-none block h-4 w-4 rounded-full shadow-md transition-transform duration-200 mt-0.5",e?"translate-x-5 bg-emerald-300":"translate-x-0.5 bg-cyan-500/40")})}),i&&a.jsx("span",{className:"text-cyan-300",children:i})]})}try{c.displayName="ToggleSwitch",c.__docgenInfo={description:"",displayName:"ToggleSwitch",props:{checked:{defaultValue:null,description:"",name:"checked",required:!1,type:{name:"boolean"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!1,type:{name:"((checked: boolean) => void)"}},label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"string"}},disabled:{defaultValue:{value:"false"},description:"",name:"disabled",required:!1,type:{name:"boolean"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const y={title:"Migrations/WebUI/Root/ToggleSwitch",component:c,parameters:{layout:"centered"},tags:["autodocs"]},r={args:{label:"Enable notifications",checked:!1}},t={args:{label:"Dark mode",checked:!0}},n={args:{label:"Locked setting",checked:!0,disabled:!0}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Enable notifications",
    checked: false
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Dark mode",
    checked: true
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Locked setting",
    checked: true,
    disabled: true
  }
}`,...n.parameters?.docs?.source}}};const w=["Default","On","Disabled"];export{r as Default,n as Disabled,t as On,w as __namedExportsOrder,y as default};
