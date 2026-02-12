import{j as e}from"./iframe-rZoXeK5l.js";import{c}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function n({level:l,charging:i=!1,label:o,className:d}){const r=Math.max(0,Math.min(100,l)),m=r>50?"bg-emerald-500":r>20?"bg-amber-500":"bg-red-500";return e.jsxs("div",{className:c("inline-flex items-center gap-2",d),children:[e.jsxs("div",{className:"relative flex items-center",children:[e.jsx("div",{className:"w-10 h-5 border-2 border-foreground/40 rounded-sm overflow-hidden",children:e.jsx("div",{className:c("h-full transition-all duration-500",m),style:{width:`${r}%`}})}),e.jsx("div",{className:"w-1 h-2.5 bg-foreground/40 rounded-r-sm"})]}),e.jsxs("span",{className:"text-xs text-muted-foreground",children:[r,"%",i?" ⚡":"",o?` ${o}`:""]})]})}try{n.displayName="BatteryMeter",n.__docgenInfo={description:"BatteryMeter - Migrated from",displayName:"BatteryMeter",props:{level:{defaultValue:null,description:"",name:"level",required:!0,type:{name:"number"}},charging:{defaultValue:{value:"false"},description:"",name:"charging",required:!1,type:{name:"boolean"}},label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"string"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const f={title:"Migrations/WebUI/BatteryMeter",component:n,tags:["autodocs"]},a={args:{level:75}},s={args:{level:15,label:"Low"}},t={args:{level:60,charging:!0}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    level: 75
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    level: 15,
    label: "Low"
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    level: 60,
    charging: true
  }
}`,...t.parameters?.docs?.source}}};const h=["Default","Low","Charging"];export{t as Charging,a as Default,s as Low,h as __namedExportsOrder,f as default};
