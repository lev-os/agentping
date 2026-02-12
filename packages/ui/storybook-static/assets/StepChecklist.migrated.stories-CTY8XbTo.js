import{j as e}from"./iframe-CzJrb7DT.js";import{c as s}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function l({items:n=[],onToggle:c,className:o}){return e.jsxs("div",{className:s("border border-cyan-500/20 bg-black/60 rounded-lg p-4 font-mono",o),children:[n.length===0&&e.jsx("div",{className:"text-xs text-cyan-500/30",children:"No items"}),e.jsx("ul",{className:"flex flex-col gap-1",children:n.map((a,r)=>e.jsx("li",{children:e.jsxs("button",{type:"button",onClick:()=>c?.(r),className:"flex items-center gap-2 w-full text-left py-1 px-1 rounded hover:bg-cyan-500/5 transition-colors",children:[e.jsx("span",{className:s("flex items-center justify-center w-4 h-4 rounded border text-[10px]",a.checked?"border-cyan-400 bg-cyan-500/20 text-cyan-300":"border-cyan-500/20 text-transparent"),children:"✓"}),e.jsx("span",{className:s("text-sm transition-all",a.checked?"text-cyan-500/40 line-through":"text-cyan-300"),children:a.label})]})},r))})]})}try{l.displayName="StepChecklist",l.__docgenInfo={description:"",displayName:"StepChecklist",props:{items:{defaultValue:{value:"[]"},description:"",name:"items",required:!1,type:{name:"ChecklistItem[]"}},onToggle:{defaultValue:null,description:"",name:"onToggle",required:!1,type:{name:"((index: number) => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const m={title:"Migrations/WebUI/Root/StepChecklist",component:l,parameters:{layout:"centered"},tags:["autodocs"]},t={args:{items:[{label:"Install dependencies",checked:!0},{label:"Configure environment",checked:!0},{label:"Run migrations",checked:!1},{label:"Deploy to staging",checked:!1}]}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      label: "Install dependencies",
      checked: true
    }, {
      label: "Configure environment",
      checked: true
    }, {
      label: "Run migrations",
      checked: false
    }, {
      label: "Deploy to staging",
      checked: false
    }]
  }
}`,...t.parameters?.docs?.source}}};const u=["Default"];export{t as Default,u as __namedExportsOrder,m as default};
