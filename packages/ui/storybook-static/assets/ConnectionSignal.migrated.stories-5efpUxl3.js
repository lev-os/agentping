import{j as i}from"./iframe-rZoXeK5l.js";import{c}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function s({strength:o,maxBars:e=4,label:m,className:d}){const l=Math.max(0,Math.min(e,Math.round(o)));return i.jsx("div",{className:c("inline-flex items-end gap-0.5",d),title:m??`Signal: ${l}/${e}`,children:Array.from({length:e},(u,t)=>i.jsx("div",{className:c("w-1 rounded-sm transition-colors",t<l?"bg-emerald-500":"bg-muted"),style:{height:`${(t+1)/e*16}px`}},t))})}try{s.displayName="ConnectionSignal",s.__docgenInfo={description:"ConnectionSignal - Migrated from",displayName:"ConnectionSignal",props:{strength:{defaultValue:null,description:"",name:"strength",required:!0,type:{name:"number"}},maxBars:{defaultValue:{value:"4"},description:"",name:"maxBars",required:!1,type:{name:"number"}},label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"string"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const h={title:"Migrations/WebUI/ConnectionSignal",component:s,tags:["autodocs"]},a={args:{strength:3}},r={args:{strength:1,label:"Weak signal"}},n={args:{strength:4,maxBars:4}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    strength: 3
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    strength: 1,
    label: "Weak signal"
  }
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    strength: 4,
    maxBars: 4
  }
}`,...n.parameters?.docs?.source}}};const _=["Default","Weak","Full"];export{a as Default,n as Full,r as Weak,_ as __namedExportsOrder,h as default};
