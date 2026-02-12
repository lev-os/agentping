import{r as h,j as t}from"./iframe-CzJrb7DT.js";import{c as b}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function d({tags:a=[],onChange:p,placeholder:m="Add tag...",maxTags:r=20,className:g}){const[c,i]=h.useState(""),y=()=>{const e=c.trim();!e||a.includes(e)||a.length>=r||(p?.([...a,e]),i(""))},u=e=>{p?.(a.filter((l,x)=>x!==e))},f=e=>{e.key==="Enter"?(e.preventDefault(),y()):e.key==="Backspace"&&!c&&a.length>0&&u(a.length-1)};return t.jsxs("div",{className:b("border border-cyan-500/20 bg-black/60 rounded-lg p-3 font-mono",g),children:[t.jsx("div",{className:"flex flex-wrap gap-2 mb-2",children:a.map((e,l)=>t.jsxs("span",{className:"inline-flex items-center gap-1 px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs text-cyan-300",children:[e,t.jsx("button",{type:"button",onClick:()=>u(l),className:"text-cyan-500/60 hover:text-cyan-300 ml-1",children:"×"})]},l))}),t.jsx("input",{type:"text",value:c,onChange:e=>i(e.target.value),onKeyDown:f,placeholder:a.length>=r?`Max ${r} tags`:m,disabled:a.length>=r,className:"w-full bg-transparent border-0 border-t border-cyan-500/10 pt-2 text-sm text-cyan-100 placeholder:text-cyan-500/30 focus:outline-none focus:border-cyan-500/40"})]})}try{d.displayName="TagInput",d.__docgenInfo={description:"",displayName:"TagInput",props:{tags:{defaultValue:{value:"[]"},description:"",name:"tags",required:!1,type:{name:"string[]"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!1,type:{name:"((tags: string[]) => void)"}},placeholder:{defaultValue:{value:"Add tag..."},description:"",name:"placeholder",required:!1,type:{name:"string"}},maxTags:{defaultValue:{value:"20"},description:"",name:"maxTags",required:!1,type:{name:"number"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const T={title:"Migrations/WebUI/Root/TagInput",component:d,parameters:{layout:"centered"},tags:["autodocs"]},n={args:{tags:["react","typescript","tailwind"],placeholder:"Add tag..."}},s={args:{tags:[],placeholder:"Type and press Enter"}},o={args:{tags:["a","b","c"],maxTags:3}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    tags: ["react", "typescript", "tailwind"],
    placeholder: "Add tag..."
  }
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    tags: [],
    placeholder: "Type and press Enter"
  }
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    tags: ["a", "b", "c"],
    maxTags: 3
  }
}`,...o.parameters?.docs?.source}}};const E=["Default","Empty","MaxReached"];export{n as Default,s as Empty,o as MaxReached,E as __namedExportsOrder,T as default};
