import{j as a}from"./iframe-rZoXeK5l.js";import{c as m}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function s({data:n=[],height:r=200,className:l}){const o=Math.max(...n.map(e=>e.count),1);return a.jsx("div",{className:m("flex items-end gap-1",l),style:{height:r},children:n.map((e,c)=>a.jsxs("div",{className:"flex-1 flex flex-col items-center gap-1",children:[a.jsx("div",{className:"w-full bg-primary/70 rounded-t-sm transition-all hover:bg-primary",style:{height:`${e.count/o*100}%`,minHeight:2},title:`${e.label}: ${e.count}`}),a.jsx("span",{className:"text-[10px] text-muted-foreground truncate w-full text-center",children:e.label})]},c))})}try{s.displayName="LatencyHistogram",s.__docgenInfo={description:"LatencyHistogram - Migrated from",displayName:"LatencyHistogram",props:{data:{defaultValue:{value:"[]"},description:"",name:"data",required:!1,type:{name:"LatencyBucket[]"}},height:{defaultValue:{value:"200"},description:"",name:"height",required:!1,type:{name:"number"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const p={title:"Migrations/WebUI/LatencyHistogram",component:s,tags:["autodocs"]},t={args:{data:[{label:"0-50ms",count:120},{label:"50-100ms",count:85},{label:"100-200ms",count:45},{label:"200-500ms",count:20},{label:"500ms+",count:5}],height:200}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    data: [{
      label: "0-50ms",
      count: 120
    }, {
      label: "50-100ms",
      count: 85
    }, {
      label: "100-200ms",
      count: 45
    }, {
      label: "200-500ms",
      count: 20
    }, {
      label: "500ms+",
      count: 5
    }],
    height: 200
  }
}`,...t.parameters?.docs?.source}}};const g=["Default"];export{t as Default,g as __namedExportsOrder,p as default};
