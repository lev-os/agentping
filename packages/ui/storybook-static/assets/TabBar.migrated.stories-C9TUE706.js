import{r as m,j as n}from"./iframe-CzJrb7DT.js";import{c as i}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";const r=m.forwardRef(({tabs:s,activeTab:l,onTabChange:o,className:d,size:c="default"},u)=>{const b={default:"h-9 px-4 text-sm",sm:"h-7 px-3 text-xs",lg:"h-11 px-5 text-base"};return n.jsx("div",{ref:u,role:"tablist",className:i("flex border-b border-border",d),children:s.map(e=>{const t=e.id===l;return n.jsxs("button",{role:"tab","aria-selected":t,"aria-controls":`tabpanel-${e.id}`,tabIndex:t?0:-1,disabled:e.disabled,onClick:()=>o(e.id),className:i("inline-flex items-center justify-center gap-2 font-medium transition-colors","border-b-2 -mb-px",b[c],t?"border-primary text-primary":"border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30",e.disabled&&"opacity-50 cursor-not-allowed"),children:[e.icon,e.label]},e.id)})})});r.displayName="TabBar";try{r.displayName="TabBar",r.__docgenInfo={description:"",displayName:"TabBar",props:{tabs:{defaultValue:null,description:"Available tabs",name:"tabs",required:!0,type:{name:"TabItem[]"}},activeTab:{defaultValue:null,description:"Currently active tab ID",name:"activeTab",required:!0,type:{name:"string"}},onTabChange:{defaultValue:null,description:"Callback when tab changes",name:"onTabChange",required:!0,type:{name:"(tabId: string) => void"}},className:{defaultValue:null,description:"Custom class for container",name:"className",required:!1,type:{name:"string"}},size:{defaultValue:{value:"default"},description:"Size variant",name:"size",required:!1,type:{name:"enum",value:[{value:'"default"'},{value:'"sm"'},{value:'"lg"'}]}}}}}catch{}const f={title:"Migrations/WebUI/Sofia/TabBar",component:r,tags:["autodocs"]},a={args:{tabs:[{id:"overview",label:"Overview"},{id:"metrics",label:"Metrics"},{id:"logs",label:"Logs"},{id:"settings",label:"Settings",disabled:!0}],activeTab:"overview",onTabChange:()=>{}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    tabs: [{
      id: "overview",
      label: "Overview"
    }, {
      id: "metrics",
      label: "Metrics"
    }, {
      id: "logs",
      label: "Logs"
    }, {
      id: "settings",
      label: "Settings",
      disabled: true
    }],
    activeTab: "overview",
    onTabChange: () => {}
  }
}`,...a.parameters?.docs?.source}}};const x=["Default"];export{a as Default,x as __namedExportsOrder,f as default};
