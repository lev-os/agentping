import{j as t}from"./iframe-CzJrb7DT.js";import{c as l}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function n({data:s,height:m=150,className:d}){const o=Math.max(...s.map(e=>e.total),1);return t.jsx("div",{className:l("flex items-end gap-px",d),style:{height:m},children:s.map((e,i)=>{const r=e.used/o*100,u=r>90?"bg-red-500":r>70?"bg-amber-500":"bg-emerald-500";return t.jsx("div",{className:"flex-1 relative group",title:`${e.time}: ${e.used}/${e.total}`,children:t.jsx("div",{className:"w-full bg-muted rounded-t-sm",style:{height:`${e.total/o*100}%`},children:t.jsx("div",{className:l("w-full rounded-t-sm absolute bottom-0",u),style:{height:`${r}%`}})})},i)})})}try{n.displayName="MemoryUsageChart",n.__docgenInfo={description:"MemoryUsageChart - Migrated from",displayName:"MemoryUsageChart",props:{data:{defaultValue:null,description:"",name:"data",required:!0,type:{name:"MemoryPoint[]"}},height:{defaultValue:{value:"150"},description:"",name:"height",required:!1,type:{name:"number"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const h={title:"Migrations/WebUI/MemoryUsageChart",component:n,tags:["autodocs"]},a={args:{data:[{time:"09:00",used:512,total:1024},{time:"09:05",used:580,total:1024},{time:"09:10",used:640,total:1024},{time:"09:15",used:720,total:1024},{time:"09:20",used:690,total:1024},{time:"09:25",used:810,total:1024}]}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    data: [{
      time: "09:00",
      used: 512,
      total: 1024
    }, {
      time: "09:05",
      used: 580,
      total: 1024
    }, {
      time: "09:10",
      used: 640,
      total: 1024
    }, {
      time: "09:15",
      used: 720,
      total: 1024
    }, {
      time: "09:20",
      used: 690,
      total: 1024
    }, {
      time: "09:25",
      used: 810,
      total: 1024
    }]
  }
}`,...a.parameters?.docs?.source}}};const f=["Default"];export{a as Default,f as __namedExportsOrder,h as default};
