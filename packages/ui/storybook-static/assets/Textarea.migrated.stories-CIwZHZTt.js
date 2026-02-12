import{j as e}from"./iframe-CzJrb7DT.js";import{c}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function l({value:s="",onChange:d,placeholder:u="Enter text...",rows:p=4,maxLength:n,label:o,disabled:i=!1,className:m}){return e.jsxs("div",{className:c("font-mono",m),children:[o&&e.jsx("label",{className:"block text-xs text-cyan-400 uppercase tracking-wider mb-1.5",children:o}),e.jsx("textarea",{value:s,onChange:f=>d?.(f.target.value),placeholder:u,rows:p,maxLength:n,disabled:i,className:c("w-full bg-black/60 border border-cyan-500/20 rounded-lg px-3 py-2 text-sm text-cyan-100 placeholder:text-cyan-500/30 resize-y","focus:outline-none focus:ring-1 focus:ring-cyan-500/40 focus:border-cyan-500/40",i&&"opacity-50 cursor-not-allowed")}),n!==void 0&&e.jsxs("div",{className:"text-right text-[10px] text-cyan-500/40 mt-1",children:[s.length,"/",n]})]})}try{l.displayName="TextArea",l.__docgenInfo={description:"",displayName:"TextArea",props:{value:{defaultValue:{value:""},description:"",name:"value",required:!1,type:{name:"string"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!1,type:{name:"((value: string) => void)"}},placeholder:{defaultValue:{value:"Enter text..."},description:"",name:"placeholder",required:!1,type:{name:"string"}},rows:{defaultValue:{value:"4"},description:"",name:"rows",required:!1,type:{name:"number"}},maxLength:{defaultValue:null,description:"",name:"maxLength",required:!1,type:{name:"number"}},label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"string"}},disabled:{defaultValue:{value:"false"},description:"",name:"disabled",required:!1,type:{name:"boolean"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const y={title:"Migrations/WebUI/Root/TextArea",component:l,parameters:{layout:"centered"},tags:["autodocs"]},a={args:{label:"Description",placeholder:"Enter a description...",rows:4}},r={args:{label:"Bio",value:"Full-stack developer passionate about TypeScript.",maxLength:200,rows:3}},t={args:{label:"Read Only",value:"This field is disabled.",disabled:!0}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Description",
    placeholder: "Enter a description...",
    rows: 4
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Bio",
    value: "Full-stack developer passionate about TypeScript.",
    maxLength: 200,
    rows: 3
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Read Only",
    value: "This field is disabled.",
    disabled: true
  }
}`,...t.parameters?.docs?.source}}};const h=["Default","WithMaxLength","Disabled"];export{a as Default,t as Disabled,r as WithMaxLength,h as __namedExportsOrder,y as default};
