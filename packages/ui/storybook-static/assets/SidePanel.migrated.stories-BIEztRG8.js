import{j as e}from"./iframe-rZoXeK5l.js";import{c as p}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function r({isOpen:n=!1,onClose:i,side:l="right",title:o="Panel",children:d,width:c=320,className:u}){return n?e.jsxs("div",{className:"fixed inset-0 z-50 font-mono",children:[e.jsx("div",{className:"absolute inset-0 bg-black/50 backdrop-blur-sm",onClick:i}),e.jsxs("div",{className:p("absolute top-0 bottom-0 bg-black/90 border-cyan-500/20 flex flex-col transition-transform",l==="right"?"right-0 border-l":"left-0 border-r",u),style:{width:c},children:[e.jsxs("div",{className:"flex items-center justify-between px-4 py-3 border-b border-cyan-500/10",children:[e.jsx("span",{className:"text-sm text-cyan-100",children:o}),e.jsx("button",{type:"button",onClick:i,className:"text-cyan-500/50 hover:text-cyan-300 transition-colors text-lg",children:"×"})]}),e.jsx("div",{className:"flex-1 overflow-y-auto p-4",children:d})]})]}):null}try{r.displayName="SidePanel",r.__docgenInfo={description:"",displayName:"SidePanel",props:{isOpen:{defaultValue:{value:"false"},description:"",name:"isOpen",required:!1,type:{name:"boolean"}},onClose:{defaultValue:null,description:"",name:"onClose",required:!1,type:{name:"(() => void)"}},side:{defaultValue:{value:"right"},description:"",name:"side",required:!1,type:{name:"enum",value:[{value:'"left"'},{value:'"right"'}]}},title:{defaultValue:{value:"Panel"},description:"",name:"title",required:!1,type:{name:"string"}},width:{defaultValue:{value:"320"},description:"",name:"width",required:!1,type:{name:"number"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const x={title:"Migrations/WebUI/Root/SidePanel",component:r,parameters:{layout:"fullscreen"},tags:["autodocs"]},a={args:{isOpen:!0,title:"Details Panel",side:"right",width:360}},t={args:{isOpen:!0,title:"Navigation",side:"left",width:280}},s={args:{isOpen:!1}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    title: "Details Panel",
    side: "right",
    width: 360
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    title: "Navigation",
    side: "left",
    width: 280
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    isOpen: false
  }
}`,...s.parameters?.docs?.source}}};const b=["Default","LeftSide","Closed"];export{s as Closed,a as Default,t as LeftSide,b as __namedExportsOrder,x as default};
