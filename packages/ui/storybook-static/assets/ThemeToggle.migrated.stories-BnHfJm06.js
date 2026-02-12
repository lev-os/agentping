import{r as d,j as g}from"./iframe-rZoXeK5l.js";import{c as u}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function o({theme:a,onToggle:s,className:l}){const[c,i]=d.useState(a??"dark"),e=(a??c)==="dark",m=()=>{const n=e?"light":"dark";i(n),s?.(n)};return g.jsx("button",{type:"button",onClick:m,"aria-label":`Switch to ${e?"light":"dark"} mode`,className:u("inline-flex items-center justify-center w-10 h-10 rounded-lg border transition-colors duration-200 font-mono text-lg",e?"border-cyan-500/20 bg-black/60 text-cyan-400 hover:bg-cyan-500/10":"border-amber-400/40 bg-amber-50 text-amber-500 hover:bg-amber-100",l),children:e?"☽":"☀"})}try{o.displayName="ThemeToggle",o.__docgenInfo={description:"",displayName:"ThemeToggle",props:{theme:{defaultValue:null,description:"",name:"theme",required:!1,type:{name:"enum",value:[{value:'"light"'},{value:'"dark"'}]}},onToggle:{defaultValue:null,description:"",name:"onToggle",required:!1,type:{name:'((theme: "light" | "dark") => void)'}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const y={title:"Migrations/WebUI/Root/ThemeToggle",component:o,parameters:{layout:"centered"},tags:["autodocs"]},t={args:{theme:"dark"}},r={args:{theme:"light"}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    theme: "dark"
  }
}`,...t.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    theme: "light"
  }
}`,...r.parameters?.docs?.source}}};const k=["Default","Light"];export{t as Default,r as Light,k as __namedExportsOrder,y as default};
