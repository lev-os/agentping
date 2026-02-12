import{j as e}from"./iframe-CzJrb7DT.js";import{B as n}from"./button-D3q81IEX.js";import{c}from"./utils-CDN07tui.js";import{T as l}from"./triangle-alert-DSVWQ3ye.js";import{R as m}from"./refresh-cw-CXK_XNXP.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DiN5Zsj0.js";import"./index-Czr-OA3y.js";import"./index-B_jtOnfb.js";import"./createLucideIcon-qiJ1pPWj.js";function a({widgetId:s,error:i,resetError:o,className:d}){return e.jsxs("div",{className:c("flex flex-col items-center justify-center py-6 px-4 text-center bg-destructive/5 border border-destructive/20 rounded-md",d),role:"alert","aria-live":"assertive","data-widget-id":s,"data-crash":"true",children:[e.jsx("div",{className:"w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center mb-3",children:e.jsx(l,{className:"w-5 h-5 text-destructive","aria-hidden":"true"})}),e.jsx("h3",{className:"font-display text-sm tracking-wider text-destructive mb-1",children:"Widget Crashed"}),e.jsx("p",{className:"text-xs text-muted-foreground max-w-[200px] mb-3",children:"Something went wrong rendering this widget."}),i&&e.jsx("pre",{className:"text-[10px] text-destructive/70 bg-destructive/5 px-2 py-1 rounded mb-3 max-w-full overflow-x-auto",children:i.message}),o&&e.jsxs(n,{variant:"outline",size:"sm",onClick:o,className:"text-xs gap-1.5",children:[e.jsx(m,{className:"w-3 h-3","aria-hidden":"true"}),"Try Again"]})]})}try{a.displayName="WidgetCrashFallback",a.__docgenInfo={description:`WidgetCrashFallback - Minimal crash fallback for widget errors

This is distinct from WidgetError which handles API/data errors.
WidgetCrashFallback is for component crashes caught by React error boundaries.`,displayName:"WidgetCrashFallback",props:{widgetId:{defaultValue:null,description:"",name:"widgetId",required:!0,type:{name:"string"}},error:{defaultValue:null,description:"",name:"error",required:!1,type:{name:"Error"}},resetError:{defaultValue:null,description:"",name:"resetError",required:!1,type:{name:"(() => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const N={title:"Migrations/WebUI/Dashboard/WidgetCrashFallback",component:a,tags:["autodocs"]},r={args:{widgetId:"widget-1",error:new Error("Cannot read property 'map' of undefined"),resetError:()=>{}}},t={args:{widgetId:"widget-2",error:new Error("Network timeout")}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    widgetId: "widget-1",
    error: new Error("Cannot read property 'map' of undefined"),
    resetError: () => {}
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    widgetId: "widget-2",
    error: new Error("Network timeout")
  }
}`,...t.parameters?.docs?.source}}};const j=["Default","WithoutReset"];export{r as Default,t as WithoutReset,j as __namedExportsOrder,N as default};
