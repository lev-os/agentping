import{r as g,j as e}from"./iframe-CzJrb7DT.js";import{c as l}from"./utils-CDN07tui.js";import{X as j}from"./x-CMkHq2ts.js";import{c as k}from"./createLucideIcon-qiJ1pPWj.js";import{T as V}from"./triangle-alert-DSVWQ3ye.js";import{C as I}from"./circle-x-Bb9hQjof.js";import{C as z}from"./circle-check-big-BWy-AY5y.js";import"./preload-helper-PPVm8Dsz.js";const q=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],w=k("info",q);function A(){return`toast-${Date.now()}-${Math.random().toString(36).slice(2,7)}`}const E={success:{icon:e.jsx(z,{size:18}),accent:"text-emerald-400",border:"border-emerald-500/20"},error:{icon:e.jsx(I,{size:18}),accent:"text-red-400",border:"border-red-500/20"},warning:{icon:e.jsx(V,{size:18}),accent:"text-amber-400",border:"border-amber-500/20"},info:{icon:e.jsx(w,{size:18}),accent:"text-cyan-400",border:"border-cyan-500/20"}},D={"top-right":"top-4 right-4","top-left":"top-4 left-4","bottom-right":"bottom-4 right-4","bottom-left":"bottom-4 left-4","top-center":"top-4 left-1/2 -translate-x-1/2","bottom-center":"bottom-4 left-1/2 -translate-x-1/2"};function v({id:t,variant:d="info",title:u,description:x,duration:m=5e3,dismissible:C=!0,action:p,onDismiss:b,className:_}){const[N,T]=g.useState(!0),h=t??A(),f=g.useCallback(()=>{T(!1),setTimeout(()=>b?.(h),200)},[b,h]);g.useEffect(()=>{if(m>0){const S=setTimeout(f,m);return()=>clearTimeout(S)}},[m,f]);const a=E[d];return e.jsx("div",{role:"alert","aria-live":"polite",className:l("w-80 rounded-lg border bg-zinc-900/95 backdrop-blur-sm","shadow-lg shadow-black/20","transition-all duration-200",a.border,N?"opacity-100 translate-y-0":"opacity-0 translate-y-2 pointer-events-none",_),children:e.jsxs("div",{className:"flex gap-3 p-3",children:[e.jsx("span",{className:l("flex-shrink-0 mt-0.5",a.accent),children:a.icon}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("p",{className:"text-sm font-medium text-zinc-100",children:u}),x&&e.jsx("p",{className:"mt-1 text-xs text-zinc-400",children:x}),p&&e.jsx("button",{onClick:p.onClick,className:l("mt-2 text-xs font-medium",a.accent,"hover:underline"),children:p.label})]}),C&&e.jsx("button",{onClick:f,className:"flex-shrink-0 p-0.5 text-zinc-500 hover:text-zinc-300 transition-colors","aria-label":"Dismiss",children:e.jsx(j,{size:14})})]})})}function y({position:t="top-right",children:d,className:u}){return e.jsx("div",{className:l("fixed z-[100] flex flex-col gap-2",D[t],u),children:d})}try{v.displayName="Toast",v.__docgenInfo={description:"",displayName:"Toast",props:{id:{defaultValue:null,description:"",name:"id",required:!1,type:{name:"string"}},variant:{defaultValue:{value:"info"},description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:'"success"'},{value:'"warning"'},{value:'"error"'},{value:'"info"'}]}},title:{defaultValue:null,description:"",name:"title",required:!0,type:{name:"string"}},description:{defaultValue:null,description:"",name:"description",required:!1,type:{name:"string"}},duration:{defaultValue:{value:"5000"},description:"",name:"duration",required:!1,type:{name:"number"}},dismissible:{defaultValue:{value:"true"},description:"",name:"dismissible",required:!1,type:{name:"boolean"}},action:{defaultValue:null,description:"",name:"action",required:!1,type:{name:"ToastAction"}},onDismiss:{defaultValue:null,description:"",name:"onDismiss",required:!1,type:{name:"((id: string) => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}try{y.displayName="ToastContainer",y.__docgenInfo={description:"",displayName:"ToastContainer",props:{position:{defaultValue:{value:"top-right"},description:"",name:"position",required:!1,type:{name:"enum",value:[{value:'"top-left"'},{value:'"top-right"'},{value:'"bottom-left"'},{value:'"bottom-right"'},{value:'"top-center"'},{value:'"bottom-center"'}]}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const R={title:"Migrations/Studio/Toast",component:v,parameters:{layout:"centered"},tags:["autodocs"]},r={args:{variant:"success",title:"File saved",description:"Changes saved to disk",duration:0}},s={args:{variant:"error",title:"Connection failed",description:"Could not reach API server",duration:0}},n={args:{variant:"warning",title:"Memory high",description:"Usage at 85% — consider closing tabs",duration:0}},i={args:{variant:"info",title:"Agent started",description:"Claude Opus session initialized",duration:0}},o={args:{variant:"error",title:"Build failed",description:"TypeScript errors in 3 files",action:{label:"View errors",onClick:()=>{}},duration:0}},c=r;r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "success",
    title: "File saved",
    description: "Changes saved to disk",
    duration: 0
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "error",
    title: "Connection failed",
    description: "Could not reach API server",
    duration: 0
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "warning",
    title: "Memory high",
    description: "Usage at 85% — consider closing tabs",
    duration: 0
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "info",
    title: "Agent started",
    description: "Claude Opus session initialized",
    duration: 0
  }
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "error",
    title: "Build failed",
    description: "TypeScript errors in 3 files",
    action: {
      label: "View errors",
      onClick: () => {}
    },
    duration: 0
  }
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:"Success",...c.parameters?.docs?.source}}};const U=["Success","Error","Warning","Info","WithAction","Default"];export{c as Default,s as Error,i as Info,r as Success,n as Warning,o as WithAction,U as __namedExportsOrder,R as default};
