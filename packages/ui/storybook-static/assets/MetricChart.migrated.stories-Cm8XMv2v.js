import{j as e}from"./iframe-rZoXeK5l.js";import{c as d}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function n({title:i,data:a,color:s="var(--primary)",height:l=150,className:m}){const o=Math.max(...a.map(t=>t.value),1),u=a[a.length-1]?.value??0;return e.jsxs("div",{className:d("border border-border rounded-md bg-card p-4",m),children:[e.jsxs("div",{className:"flex items-baseline justify-between mb-3",children:[e.jsx("span",{className:"text-xs text-muted-foreground",children:i}),e.jsx("span",{className:"text-lg font-bold text-foreground",children:u})]}),e.jsx("div",{className:"flex items-end gap-px",style:{height:l},children:a.map((t,c)=>e.jsx("div",{className:"flex-1 rounded-t-sm transition-all hover:opacity-80",style:{height:`${t.value/o*100}%`,backgroundColor:s,minHeight:1},title:`${t.time}: ${t.value}`},c))})]})}try{n.displayName="MetricChart",n.__docgenInfo={description:"MetricChart - Migrated from",displayName:"MetricChart",props:{title:{defaultValue:null,description:"",name:"title",required:!0,type:{name:"string"}},data:{defaultValue:null,description:"",name:"data",required:!0,type:{name:"MetricPoint[]"}},color:{defaultValue:{value:"var(--primary)"},description:"",name:"color",required:!1,type:{name:"string"}},height:{defaultValue:{value:"150"},description:"",name:"height",required:!1,type:{name:"number"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const g={title:"Migrations/WebUI/MetricChart",component:n,tags:["autodocs"]},r={args:{title:"Requests/sec",data:[{time:"09:00",value:42},{time:"09:05",value:58},{time:"09:10",value:35},{time:"09:15",value:72},{time:"09:20",value:65},{time:"09:25",value:90}]}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Requests/sec",
    data: [{
      time: "09:00",
      value: 42
    }, {
      time: "09:05",
      value: 58
    }, {
      time: "09:10",
      value: 35
    }, {
      time: "09:15",
      value: 72
    }, {
      time: "09:20",
      value: 65
    }, {
      time: "09:25",
      value: 90
    }]
  }
}`,...r.parameters?.docs?.source}}};const h=["Default"];export{r as Default,h as __namedExportsOrder,g as default};
