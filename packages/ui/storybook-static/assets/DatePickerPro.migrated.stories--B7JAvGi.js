import{j as r}from"./iframe-rZoXeK5l.js";import{c as p}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function t({value:n,onChange:s,label:l,placeholder:o="Select date...",minDate:i,maxDate:d,showTime:u=!1,className:c}){return r.jsxs("div",{className:p("flex flex-col gap-1",c),children:[l&&r.jsx("label",{className:"text-xs text-muted-foreground",children:l}),r.jsx("input",{type:u?"datetime-local":"date",value:n??"",onChange:m=>s?.(m.target.value),placeholder:o,min:i,max:d,className:"px-3 py-2 text-sm bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"})]})}try{t.displayName="DatePickerPro",t.__docgenInfo={description:"DatePickerPro - Migrated from",displayName:"DatePickerPro",props:{value:{defaultValue:null,description:"",name:"value",required:!1,type:{name:"string"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!1,type:{name:"((date: string) => void)"}},label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"string"}},placeholder:{defaultValue:{value:"Select date..."},description:"",name:"placeholder",required:!1,type:{name:"string"}},minDate:{defaultValue:null,description:"",name:"minDate",required:!1,type:{name:"string"}},maxDate:{defaultValue:null,description:"",name:"maxDate",required:!1,type:{name:"string"}},showTime:{defaultValue:{value:"false"},description:"",name:"showTime",required:!1,type:{name:"boolean"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const x={title:"Migrations/WebUI/DatePickerPro",component:t,tags:["autodocs"]},e={args:{value:"2026-01-15",label:"Deadline",placeholder:"Select date...",onChange:()=>{}}},a={args:{value:"2026-01-15T14:30",label:"Meeting Time",showTime:!0,onChange:()=>{}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    value: "2026-01-15",
    label: "Deadline",
    placeholder: "Select date...",
    onChange: () => {}
  }
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    value: "2026-01-15T14:30",
    label: "Meeting Time",
    showTime: true,
    onChange: () => {}
  }
}`,...a.parameters?.docs?.source}}};const y=["Default","WithTime"];export{e as Default,a as WithTime,y as __namedExportsOrder,x as default};
