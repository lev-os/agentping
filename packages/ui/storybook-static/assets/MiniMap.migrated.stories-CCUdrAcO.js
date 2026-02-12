import{j as o}from"./iframe-rZoXeK5l.js";import{c as h}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function r({viewportWidth:n,viewportHeight:s,contentWidth:a,contentHeight:i,scrollX:l=0,scrollY:d=0,className:c}){const e=Math.min(120/a,80/i),u=n*e,p=s*e,m=l*e,f=d*e;return o.jsx("div",{className:h("relative border border-border rounded bg-muted/50",c),style:{width:a*e,height:i*e},children:o.jsx("div",{className:"absolute border-2 border-primary/60 rounded-sm bg-primary/10",style:{width:u,height:p,left:m,top:f}})})}try{r.displayName="MiniMap",r.__docgenInfo={description:"MiniMap - Migrated from",displayName:"MiniMap",props:{viewportWidth:{defaultValue:null,description:"",name:"viewportWidth",required:!0,type:{name:"number"}},viewportHeight:{defaultValue:null,description:"",name:"viewportHeight",required:!0,type:{name:"number"}},contentWidth:{defaultValue:null,description:"",name:"contentWidth",required:!0,type:{name:"number"}},contentHeight:{defaultValue:null,description:"",name:"contentHeight",required:!0,type:{name:"number"}},scrollX:{defaultValue:{value:"0"},description:"",name:"scrollX",required:!1,type:{name:"number"}},scrollY:{defaultValue:{value:"0"},description:"",name:"scrollY",required:!1,type:{name:"number"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const v={title:"Migrations/WebUI/MiniMap",component:r,tags:["autodocs"],parameters:{layout:"centered"}},t={args:{viewportWidth:800,viewportHeight:600,contentWidth:2400,contentHeight:1600,scrollX:200,scrollY:100}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    viewportWidth: 800,
    viewportHeight: 600,
    contentWidth: 2400,
    contentHeight: 1600,
    scrollX: 200,
    scrollY: 100
  }
}`,...t.parameters?.docs?.source}}};const M=["Default"];export{t as Default,M as __namedExportsOrder,v as default};
