import{j as a}from"./iframe-CzJrb7DT.js";import{c as u}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function n({segments:t=[],total:s,className:c}){const o=s??t.reduce((e,l)=>e+l.value,0);return a.jsxs("div",{className:u("font-mono w-72",c),children:[a.jsx("div",{className:"flex h-4 rounded-full overflow-hidden bg-cyan-500/10",children:t.map((e,l)=>{const i=o>0?e.value/o*100:0;return a.jsx("div",{className:"h-full transition-all duration-300",style:{width:`${i}%`,backgroundColor:e.color,opacity:.7},title:`${e.label}: ${e.value}`},l)})}),a.jsx("div",{className:"flex flex-wrap gap-x-4 gap-y-1 mt-2",children:t.map((e,l)=>a.jsxs("div",{className:"flex items-center gap-1.5",children:[a.jsx("span",{className:"block w-2 h-2 rounded-full",style:{backgroundColor:e.color}}),a.jsx("span",{className:"text-[10px] text-cyan-500/50",children:e.label}),a.jsx("span",{className:"text-[10px] text-cyan-300 tabular-nums",children:o>0?`${(e.value/o*100).toFixed(0)}%`:"0%"})]},l))})]})}try{n.displayName="StorageDistribution",n.__docgenInfo={description:"",displayName:"StorageDistribution",props:{segments:{defaultValue:{value:"[]"},description:"",name:"segments",required:!1,type:{name:"StorageSegment[]"}},total:{defaultValue:null,description:"",name:"total",required:!1,type:{name:"number"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const b={title:"Migrations/WebUI/Root/StorageDistribution",component:n,parameters:{layout:"centered"},tags:["autodocs"]},r={args:{segments:[{label:"Documents",value:45,color:"#06b6d4"},{label:"Media",value:30,color:"#8b5cf6"},{label:"Code",value:15,color:"#22c55e"},{label:"Other",value:10,color:"#eab308"}]}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    segments: [{
      label: "Documents",
      value: 45,
      color: "#06b6d4"
    }, {
      label: "Media",
      value: 30,
      color: "#8b5cf6"
    }, {
      label: "Code",
      value: 15,
      color: "#22c55e"
    }, {
      label: "Other",
      value: 10,
      color: "#eab308"
    }]
  }
}`,...r.parameters?.docs?.source}}};const f=["Default"];export{r as Default,f as __namedExportsOrder,b as default};
