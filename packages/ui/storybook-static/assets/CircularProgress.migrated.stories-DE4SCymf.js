import{j as r}from"./iframe-rZoXeK5l.js";import{c as f}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function c({value:i,size:e=64,strokeWidth:o=4,label:m,className:d}){const u=Math.max(0,Math.min(100,i)),n=(e-o)/2,l=2*Math.PI*n,p=l-u/100*l;return r.jsxs("div",{className:f("inline-flex flex-col items-center gap-1",d),children:[r.jsxs("svg",{width:e,height:e,className:"-rotate-90",children:[r.jsx("circle",{cx:e/2,cy:e/2,r:n,fill:"none",stroke:"currentColor",className:"text-muted",strokeWidth:o}),r.jsx("circle",{cx:e/2,cy:e/2,r:n,fill:"none",stroke:"currentColor",className:"text-primary transition-all duration-500",strokeWidth:o,strokeDasharray:l,strokeDashoffset:p,strokeLinecap:"round"})]}),r.jsx("span",{className:"text-xs text-muted-foreground",children:m??`${u}%`})]})}try{c.displayName="CircularProgress",c.__docgenInfo={description:"CircularProgress - Migrated from",displayName:"CircularProgress",props:{value:{defaultValue:null,description:"",name:"value",required:!0,type:{name:"number"}},size:{defaultValue:{value:"64"},description:"",name:"size",required:!1,type:{name:"number"}},strokeWidth:{defaultValue:{value:"4"},description:"",name:"strokeWidth",required:!1,type:{name:"number"}},label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"string"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const y={title:"Migrations/WebUI/CircularProgress",component:c,tags:["autodocs"]},a={args:{value:65}},s={args:{value:100,label:"Done"}},t={args:{value:30,size:40,strokeWidth:3}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    value: 65
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    value: 100,
    label: "Done"
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    value: 30,
    size: 40,
    strokeWidth: 3
  }
}`,...t.parameters?.docs?.source}}};const v=["Default","Complete","Small"];export{s as Complete,a as Default,t as Small,v as __namedExportsOrder,y as default};
