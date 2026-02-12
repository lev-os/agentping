import{j as n}from"./iframe-rZoXeK5l.js";import{c as h}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function m({axes:s=[],size:t=200,className:x}){const u=t/2,i=t/2,y=t/2-20,c=s.length,d=(e,r,a)=>{const o=Math.PI*2*e/c-Math.PI/2,p=r/a*y;return{x:u+Math.cos(o)*p,y:i+Math.sin(o)*p}},g=s.map((e,r)=>d(r,e.value,e.max||100)).map(e=>`${e.x},${e.y}`).join(" ");return n.jsx("div",{className:h("flex items-center justify-center",x),children:n.jsxs("svg",{width:t,height:t,viewBox:`0 0 ${t} ${t}`,children:[[1,.75,.5,.25].map(e=>n.jsx("polygon",{points:Array.from({length:c},(r,a)=>{const o=d(a,e*100,100);return`${o.x},${o.y}`}).join(" "),fill:"none",stroke:"rgba(0,229,255,0.1)",strokeWidth:"0.5"},e)),s.map((e,r)=>{const a=d(r,100,100);return n.jsxs("g",{children:[n.jsx("line",{x1:u,y1:i,x2:a.x,y2:a.y,stroke:"rgba(0,229,255,0.08)",strokeWidth:"0.5"}),n.jsx("text",{x:a.x,y:a.y,textAnchor:"middle",fill:"rgba(0,229,255,0.5)",fontSize:"8",fontFamily:"monospace",dy:a.y<i?-6:12,children:e.label})]},r)}),c>0&&n.jsx("polygon",{points:g,fill:"rgba(0,229,255,0.1)",stroke:"rgba(0,229,255,0.6)",strokeWidth:"1.5"})]})})}try{m.displayName="RadarChart",m.__docgenInfo={description:"RadarChart - Migrated from",displayName:"RadarChart",props:{axes:{defaultValue:{value:"[]"},description:"",name:"axes",required:!1,type:{name:"RadarAxis[]"}},size:{defaultValue:{value:"200"},description:"",name:"size",required:!1,type:{name:"number"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const _={title:"Migrations/WebUI/Root/RadarChart",component:m,parameters:{layout:"centered"},tags:["autodocs"]},l={args:{axes:[{label:"CPU",value:78},{label:"Memory",value:65},{label:"Disk",value:42},{label:"Network",value:88},{label:"GPU",value:55}],size:240}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    axes: [{
      label: "CPU",
      value: 78
    }, {
      label: "Memory",
      value: 65
    }, {
      label: "Disk",
      value: 42
    }, {
      label: "Network",
      value: 88
    }, {
      label: "GPU",
      value: 55
    }],
    size: 240
  }
}`,...l.parameters?.docs?.source}}};const k=["Default"];export{l as Default,k as __namedExportsOrder,_ as default};
