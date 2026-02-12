import{j as t}from"./iframe-rZoXeK5l.js";import{c as i}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";const c={info:"border-cyan-500/30 bg-cyan-500/10 text-cyan-300",success:"border-emerald-500/30 bg-emerald-500/10 text-emerald-300",warning:"border-amber-500/30 bg-amber-500/10 text-amber-300",error:"border-red-500/30 bg-red-500/10 text-red-300"},m={info:"ℹ",success:"✓",warning:"⚠",error:"✗"},d={"top-right":"top-4 right-4","top-left":"top-4 left-4","bottom-right":"bottom-4 right-4","bottom-left":"bottom-4 left-4"};function o({toasts:r=[],position:l="top-right",onDismiss:n,className:p}){return t.jsx("div",{className:i("fixed z-50 flex flex-col gap-2 w-80 font-mono",d[l],p),children:r.map(e=>t.jsxs("div",{className:i("flex items-start gap-2 px-3 py-2.5 rounded-lg border text-sm",c[e.type]),children:[t.jsx("span",{className:"text-base leading-none mt-0.5",children:m[e.type]}),t.jsx("span",{className:"flex-1",children:e.message}),n&&t.jsx("button",{type:"button",onClick:()=>n(e.id),className:"opacity-60 hover:opacity-100 transition-opacity",children:"×"})]},e.id))})}try{o.displayName="ToastManager",o.__docgenInfo={description:"",displayName:"ToastManager",props:{toasts:{defaultValue:{value:"[]"},description:"",name:"toasts",required:!1,type:{name:"ToastMessage[]"}},position:{defaultValue:{value:"top-right"},description:"",name:"position",required:!1,type:{name:"enum",value:[{value:'"top-left"'},{value:'"top-right"'},{value:'"bottom-left"'},{value:'"bottom-right"'}]}},onDismiss:{defaultValue:null,description:"",name:"onDismiss",required:!1,type:{name:"((id: string) => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const y={title:"Migrations/WebUI/Root/ToastManager",component:o,parameters:{layout:"fullscreen"},tags:["autodocs"]},s={args:{toasts:[{id:"1",message:"Deployment completed successfully",type:"success"},{id:"2",message:"New version available",type:"info"},{id:"3",message:"Rate limit approaching",type:"warning"}],position:"top-right"}},a={args:{toasts:[{id:"1",message:"Connection lost",type:"error"},{id:"2",message:"Authentication failed",type:"error"}],position:"bottom-right"}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    toasts: [{
      id: "1",
      message: "Deployment completed successfully",
      type: "success"
    }, {
      id: "2",
      message: "New version available",
      type: "info"
    }, {
      id: "3",
      message: "Rate limit approaching",
      type: "warning"
    }],
    position: "top-right"
  }
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    toasts: [{
      id: "1",
      message: "Connection lost",
      type: "error"
    }, {
      id: "2",
      message: "Authentication failed",
      type: "error"
    }],
    position: "bottom-right"
  }
}`,...a.parameters?.docs?.source}}};const b=["Default","Errors"];export{s as Default,a as Errors,b as __namedExportsOrder,y as default};
