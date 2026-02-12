import{j as e}from"./iframe-CzJrb7DT.js";import{c as f}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function r({title:n="Step",description:i,stepNumber:o=1,totalSteps:l=1,children:c,onNext:d,onBack:p,isFirst:u=!0,isLast:m=!1,className:y}){return e.jsxs("div",{className:f("border border-cyan-500/20 bg-black/60 rounded-lg font-mono",y),children:[e.jsxs("div",{className:"px-4 py-3 border-b border-cyan-500/10",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("span",{className:"text-[10px] text-cyan-500/50 uppercase tracking-wider",children:["Step ",o," of ",l]}),e.jsx("div",{className:"flex-1 h-1 bg-cyan-500/10 rounded overflow-hidden",children:e.jsx("div",{className:"h-full bg-cyan-400/50 rounded transition-all",style:{width:`${o/l*100}%`}})})]}),e.jsx("h3",{className:"text-sm text-cyan-100 mt-2",children:n}),i&&e.jsx("p",{className:"text-xs text-cyan-500/50 mt-0.5",children:i})]}),e.jsx("div",{className:"px-4 py-4",children:c}),e.jsxs("div",{className:"flex justify-between px-4 py-3 border-t border-cyan-500/10",children:[u?e.jsx("span",{}):e.jsx("button",{type:"button",onClick:p,className:"text-xs px-3 py-1.5 border border-cyan-500/20 rounded text-cyan-400 hover:bg-cyan-500/10 transition-colors",children:"Back"}),e.jsx("button",{type:"button",onClick:d,className:"text-xs px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/30 rounded text-cyan-300 hover:bg-cyan-500/30 transition-colors",children:m?"Finish":"Next"})]})]})}try{r.displayName="WizardStep",r.__docgenInfo={description:"",displayName:"WizardStep",props:{title:{defaultValue:{value:"Step"},description:"",name:"title",required:!1,type:{name:"string"}},description:{defaultValue:null,description:"",name:"description",required:!1,type:{name:"string"}},stepNumber:{defaultValue:{value:"1"},description:"",name:"stepNumber",required:!1,type:{name:"number"}},totalSteps:{defaultValue:{value:"1"},description:"",name:"totalSteps",required:!1,type:{name:"number"}},onNext:{defaultValue:null,description:"",name:"onNext",required:!1,type:{name:"(() => void)"}},onBack:{defaultValue:null,description:"",name:"onBack",required:!1,type:{name:"(() => void)"}},isFirst:{defaultValue:{value:"true"},description:"",name:"isFirst",required:!1,type:{name:"boolean"}},isLast:{defaultValue:{value:"false"},description:"",name:"isLast",required:!1,type:{name:"boolean"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const N={title:"Migrations/WebUI/Root/WizardStep",component:r,parameters:{layout:"centered"},tags:["autodocs"]},t={args:{title:"Configure API Keys",description:"Enter your API credentials to connect to external services.",stepNumber:2,totalSteps:4,isFirst:!1,isLast:!1}},s={args:{title:"Welcome",description:"Let's get started with your setup.",stepNumber:1,totalSteps:3,isFirst:!0,isLast:!1}},a={args:{title:"Review & Deploy",description:"Confirm your settings and deploy.",stepNumber:3,totalSteps:3,isFirst:!1,isLast:!0}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Configure API Keys",
    description: "Enter your API credentials to connect to external services.",
    stepNumber: 2,
    totalSteps: 4,
    isFirst: false,
    isLast: false
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Welcome",
    description: "Let's get started with your setup.",
    stepNumber: 1,
    totalSteps: 3,
    isFirst: true,
    isLast: false
  }
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Review & Deploy",
    description: "Confirm your settings and deploy.",
    stepNumber: 3,
    totalSteps: 3,
    isFirst: false,
    isLast: true
  }
}`,...a.parameters?.docs?.source}}};const h=["Default","FirstStep","LastStep"];export{t as Default,s as FirstStep,a as LastStep,h as __namedExportsOrder,N as default};
