import{j as e}from"./iframe-CzJrb7DT.js";import{c}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function n({properties:r=[],title:s,onChange:o,className:l}){return e.jsxs("div",{className:c("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden",l),children:[s&&e.jsx("div",{className:"px-4 py-2 border-b border-cyan-500/10",children:e.jsx("span",{className:"text-xs font-mono text-cyan-400 uppercase tracking-wider",children:s})}),e.jsx("div",{className:"divide-y divide-cyan-500/5",children:r.map(t=>e.jsxs("div",{className:"flex items-center gap-3 px-4 py-1.5",children:[e.jsx("span",{className:"text-xs font-mono text-cyan-500/60 w-28 truncate",children:t.name}),t.editable&&o?e.jsx("input",{defaultValue:String(t.value),onBlur:i=>o(t.name,i.target.value),className:"flex-1 bg-transparent border-b border-cyan-500/20 text-xs font-mono text-cyan-300 outline-none focus:border-cyan-400"}):e.jsx("span",{className:"text-xs font-mono text-cyan-300/80 flex-1",children:String(t.value)}),t.type&&e.jsx("span",{className:"text-[10px] font-mono text-cyan-500/30",children:t.type})]},t.name))})]})}try{n.displayName="ObjectProperties",n.__docgenInfo={description:"ObjectProperties - Migrated from",displayName:"ObjectProperties",props:{properties:{defaultValue:{value:"[]"},description:"",name:"properties",required:!1,type:{name:"ObjectProperty[]"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!1,type:{name:"((name: string, value: string) => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const p={title:"Migrations/WebUI/Data/ObjectProperties",component:n,parameters:{layout:"centered"},tags:["autodocs"]},a={args:{title:"Agent Config",properties:[{name:"model",value:"claude-opus-4-6",type:"string"},{name:"temperature",value:.7,type:"number",editable:!0},{name:"streaming",value:!0,type:"boolean"},{name:"max_tokens",value:4096,type:"number"}]}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Agent Config",
    properties: [{
      name: "model",
      value: "claude-opus-4-6",
      type: "string"
    }, {
      name: "temperature",
      value: 0.7,
      type: "number",
      editable: true
    }, {
      name: "streaming",
      value: true,
      type: "boolean"
    }, {
      name: "max_tokens",
      value: 4096,
      type: "number"
    }]
  }
}`,...a.parameters?.docs?.source}}};const x=["Default"];export{a as Default,x as __namedExportsOrder,p as default};
