import{j as t}from"./iframe-rZoXeK5l.js";import{c as i}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function n({items:a,onSelect:o,className:s}){return t.jsx("div",{className:i("flex items-center gap-1 px-3 py-2 rounded-2xl bg-card/80 backdrop-blur border border-border shadow-lg",s),children:a.map(e=>t.jsx("button",{onClick:()=>o?.(e.id),className:"h-10 w-10 flex items-center justify-center rounded-xl hover:bg-muted transition-all hover:scale-110 text-muted-foreground hover:text-foreground",title:e.label,"aria-label":e.label,children:e.icon},e.id))})}try{n.displayName="DockMenu",n.__docgenInfo={description:"DockMenu - Migrated from",displayName:"DockMenu",props:{items:{defaultValue:null,description:"",name:"items",required:!0,type:{name:"DockItem[]"}},onSelect:{defaultValue:null,description:"",name:"onSelect",required:!1,type:{name:"((id: string) => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const u={title:"Migrations/WebUI/DockMenu",component:n,tags:["autodocs"]},r={args:{items:[{id:"home",label:"Home",icon:"H"},{id:"search",label:"Search",icon:"S"},{id:"settings",label:"Settings",icon:"G"}]}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: "home",
      label: "Home",
      icon: "H"
    }, {
      id: "search",
      label: "Search",
      icon: "S"
    }, {
      id: "settings",
      label: "Settings",
      icon: "G"
    }]
  }
}`,...r.parameters?.docs?.source}}};const m=["Default"];export{r as Default,m as __namedExportsOrder,u as default};
