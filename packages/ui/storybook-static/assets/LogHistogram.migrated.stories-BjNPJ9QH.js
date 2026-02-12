import{j as a}from"./iframe-rZoXeK5l.js";import{c as r}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function o({data:t,height:i=200,className:l}){const s=Math.max(...t.map(e=>e.count),1),m={info:"bg-blue-500",warn:"bg-amber-500",error:"bg-red-500"};return a.jsx("div",{className:r("flex items-end gap-px",l),style:{height:i},children:t.map((e,c)=>a.jsx("div",{className:r("flex-1 rounded-t-sm transition-all hover:opacity-80",m[e.level??"info"]),style:{height:`${e.count/s*100}%`,minHeight:1},title:`${e.time}: ${e.count}`},c))})}try{o.displayName="LogHistogram",o.__docgenInfo={description:"LogHistogram - Migrated from",displayName:"LogHistogram",props:{data:{defaultValue:null,description:"",name:"data",required:!0,type:{name:"LogBucket[]"}},height:{defaultValue:{value:"200"},description:"",name:"height",required:!1,type:{name:"number"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const g={title:"Migrations/WebUI/LogHistogram",component:o,tags:["autodocs"]},n={args:{data:[{time:"09:00",count:5,level:"info"},{time:"09:05",count:12,level:"info"},{time:"09:10",count:3,level:"warn"},{time:"09:15",count:18,level:"error"},{time:"09:20",count:7,level:"info"},{time:"09:25",count:2,level:"info"}]}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    data: [{
      time: "09:00",
      count: 5,
      level: "info"
    }, {
      time: "09:05",
      count: 12,
      level: "info"
    }, {
      time: "09:10",
      count: 3,
      level: "warn"
    }, {
      time: "09:15",
      count: 18,
      level: "error"
    }, {
      time: "09:20",
      count: 7,
      level: "info"
    }, {
      time: "09:25",
      count: 2,
      level: "info"
    }]
  }
}`,...n.parameters?.docs?.source}}};const f=["Default"];export{n as Default,f as __namedExportsOrder,g as default};
