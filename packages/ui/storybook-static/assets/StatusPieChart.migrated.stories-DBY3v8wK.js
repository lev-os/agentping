import{j as e}from"./iframe-CzJrb7DT.js";import{c as m}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function u({data:t,height:n=300,className:d}){const r=t.reduce((a,s)=>a+s.value,0);if(r===0)return e.jsx("div",{className:m("flex items-center justify-center text-sm text-zinc-500",d),style:{height:n},children:"No dashboard data available"});let i=0;const p=t.flatMap(a=>{const s=i,x=a.value/r*100;return i+=x,[`${a.color} ${s}%`,`${a.color} ${i}%`]});return e.jsxs("div",{className:m("flex items-center gap-8",d),style:{height:n},children:[e.jsxs("div",{className:"relative rounded-full flex-shrink-0",style:{width:n*.6,height:n*.6,background:`conic-gradient(${p.join(", ")})`},role:"img","aria-label":"Status distribution pie chart",children:[e.jsx("div",{className:"absolute inset-[25%] rounded-full bg-zinc-900"}),e.jsxs("div",{className:"absolute inset-0 flex flex-col items-center justify-center",children:[e.jsx("span",{className:"text-2xl font-bold text-zinc-100",children:r}),e.jsx("span",{className:"text-xs text-zinc-500",children:"total"})]})]}),e.jsx("div",{className:"flex flex-col gap-2",children:t.map(a=>{const s=(a.value/r*100).toFixed(1);return e.jsxs("div",{className:"flex items-center gap-2 text-sm",children:[e.jsx("span",{className:"w-3 h-3 rounded-sm flex-shrink-0",style:{backgroundColor:a.color}}),e.jsxs("span",{className:"text-zinc-300",children:[a.name,": ",a.value]}),e.jsxs("span",{className:"text-zinc-500",children:["(",s,"%)"]})]},a.name)})})]})}try{u.displayName="StatusPieChart",u.__docgenInfo={description:"",displayName:"StatusPieChart",props:{data:{defaultValue:null,description:"Pie chart data slices",name:"data",required:!0,type:{name:"StatusPieData[]"}},height:{defaultValue:{value:"300"},description:"Chart height in px",name:"height",required:!1,type:{name:"number"}},className:{defaultValue:null,description:"Additional CSS classes",name:"className",required:!1,type:{name:"string"}}}}}catch{}const v={title:"Migrations/Studio/StatusPieChart",component:u,parameters:{layout:"padded"},tags:["autodocs"]},l={args:{data:[{name:"Running",value:4,color:"hsl(150 100% 45%)"},{name:"Stopped",value:1,color:"hsl(220 10% 55%)"},{name:"Failed",value:1,color:"hsl(0 85% 55%)"}]}},o={args:{data:[{name:"Running",value:6,color:"hsl(150 100% 45%)"}]}},c={args:{data:[]}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    data: [{
      name: "Running",
      value: 4,
      color: "hsl(150 100% 45%)"
    }, {
      name: "Stopped",
      value: 1,
      color: "hsl(220 10% 55%)"
    }, {
      name: "Failed",
      value: 1,
      color: "hsl(0 85% 55%)"
    }]
  }
}`,...l.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    data: [{
      name: "Running",
      value: 6,
      color: "hsl(150 100% 45%)"
    }]
  }
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    data: []
  }
}`,...c.parameters?.docs?.source}}};const j=["Default","AllRunning","Empty"];export{o as AllRunning,l as Default,c as Empty,j as __namedExportsOrder,v as default};
