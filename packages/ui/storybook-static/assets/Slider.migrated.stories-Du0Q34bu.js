import{r as g,j as e}from"./iframe-rZoXeK5l.js";import{c as v}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function l({min:a=0,max:u=100,value:c,step:m=1,onChange:d,label:r,className:p}){const[x,f]=g.useState(c??a),t=c??x,i=(t-a)/(u-a)*100,y=b=>{const o=Number(b.target.value);f(o),d?.(o)};return e.jsxs("div",{className:v("font-mono w-64",p),children:[r&&e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("span",{className:"text-xs text-cyan-400 uppercase tracking-wider",children:r}),e.jsx("span",{className:"text-xs text-cyan-300 tabular-nums",children:t})]}),e.jsxs("div",{className:"relative h-2 rounded-full bg-cyan-500/10",children:[e.jsx("div",{className:"absolute h-full rounded-full bg-cyan-500/60",style:{width:`${i}%`}}),e.jsx("input",{type:"range",min:a,max:u,step:m,value:t,onChange:y,className:"absolute inset-0 w-full h-full opacity-0 cursor-pointer"}),e.jsx("div",{className:"absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-black shadow-[0_0_6px_rgba(6,182,212,0.5)] pointer-events-none",style:{left:`calc(${i}% - 7px)`}})]}),!r&&e.jsx("div",{className:"text-right mt-1",children:e.jsx("span",{className:"text-xs text-cyan-300/60 tabular-nums",children:t})})]})}try{l.displayName="Slider",l.__docgenInfo={description:"",displayName:"Slider",props:{min:{defaultValue:{value:"0"},description:"",name:"min",required:!1,type:{name:"number"}},max:{defaultValue:{value:"100"},description:"",name:"max",required:!1,type:{name:"number"}},value:{defaultValue:null,description:"",name:"value",required:!1,type:{name:"number"}},step:{defaultValue:{value:"1"},description:"",name:"step",required:!1,type:{name:"number"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!1,type:{name:"((value: number) => void)"}},label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"string"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const _={title:"Migrations/WebUI/Root/Slider",component:l,parameters:{layout:"centered"},tags:["autodocs"]},s={args:{min:0,max:100,value:50,label:"Volume"}},n={args:{min:0,max:1,step:.1,value:.5,label:"Opacity"}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    min: 0,
    max: 100,
    value: 50,
    label: "Volume"
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    min: 0,
    max: 1,
    step: 0.1,
    value: 0.5,
    label: "Opacity"
  }
}`,...n.parameters?.docs?.source}}};const S=["Default","WithStep"];export{s as Default,n as WithStep,S as __namedExportsOrder,_ as default};
