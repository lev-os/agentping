import{j as e}from"./iframe-CzJrb7DT.js";import{c}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function o({variant:n="rect",width:l,height:u,count:d=3,className:s}){if(n==="circle"){const i=l??u??40;return e.jsx("div",{className:c("animate-pulse rounded-full bg-cyan-500/10",s),style:{width:i,height:i}})}return n==="text"?e.jsx("div",{className:c("flex flex-col gap-2",s),children:Array.from({length:d}).map((i,m)=>e.jsx("div",{className:"animate-pulse rounded bg-cyan-500/10 h-3",style:{width:m===d-1?"60%":"100%"}},m))}):e.jsx("div",{className:c("animate-pulse rounded bg-cyan-500/10",s),style:{width:l??"100%",height:u??20}})}try{o.displayName="Skeleton",o.__docgenInfo={description:"",displayName:"Skeleton",props:{variant:{defaultValue:{value:"rect"},description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:'"text"'},{value:'"circle"'},{value:'"rect"'}]}},width:{defaultValue:null,description:"",name:"width",required:!1,type:{name:"string | number"}},height:{defaultValue:null,description:"",name:"height",required:!1,type:{name:"string | number"}},count:{defaultValue:{value:"3"},description:"",name:"count",required:!1,type:{name:"number"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const h={title:"Migrations/WebUI/Root/Skeleton",component:o,parameters:{layout:"centered"},tags:["autodocs"]},a={args:{variant:"rect",width:200,height:20}},r={args:{variant:"circle",width:48}},t={args:{variant:"text",count:4}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "rect",
    width: 200,
    height: 20
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "circle",
    width: 48
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "text",
    count: 4
  }
}`,...t.parameters?.docs?.source}}};const v=["Default","Circle","TextLines"];export{r as Circle,a as Default,t as TextLines,v as __namedExportsOrder,h as default};
