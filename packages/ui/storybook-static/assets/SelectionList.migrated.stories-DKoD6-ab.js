import{j as s}from"./iframe-CzJrb7DT.js";import{c as g}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function c({items:e=[],onChange:r,selectAll:i=!0,className:p}){const o=e.filter(t=>t.selected).length,d=e.length>0&&o===e.length,m=t=>{r?.(e.map(a=>a.id===t?{...a,selected:!a.selected}:a))},u=()=>{const t=!d;r?.(e.map(a=>({...a,selected:t})))};return s.jsxs("div",{className:g("border border-cyan-500/20 bg-black/60 rounded-lg font-mono",p),children:[i&&e.length>0&&s.jsxs("div",{className:"flex items-center gap-2 px-3 py-2 border-b border-cyan-500/10",children:[s.jsx("input",{type:"checkbox",checked:d,onChange:u,className:"accent-cyan-500"}),s.jsxs("span",{className:"text-xs text-cyan-400",children:[o,"/",e.length," selected"]})]}),e.length===0&&s.jsx("div",{className:"p-4 text-xs text-cyan-500/30",children:"No items"}),e.map(t=>s.jsxs("label",{className:"flex items-center gap-2 px-3 py-2 hover:bg-cyan-500/5 cursor-pointer transition-colors",children:[s.jsx("input",{type:"checkbox",checked:!!t.selected,onChange:()=>m(t.id),className:"accent-cyan-500"}),s.jsx("span",{className:"text-sm text-cyan-100",children:t.label})]},t.id))]})}try{c.displayName="SelectionList",c.__docgenInfo={description:"",displayName:"SelectionList",props:{items:{defaultValue:{value:"[]"},description:"",name:"items",required:!1,type:{name:"SelectionItem[]"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!1,type:{name:"((items: SelectionItem[]) => void)"}},selectAll:{defaultValue:{value:"true"},description:"",name:"selectAll",required:!1,type:{name:"boolean"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const h={title:"Migrations/WebUI/Root/SelectionList",component:c,parameters:{layout:"centered"},tags:["autodocs"]},l={args:{items:[{id:"1",label:"TypeScript",selected:!0},{id:"2",label:"Python",selected:!1},{id:"3",label:"Rust",selected:!0},{id:"4",label:"Go",selected:!1}],selectAll:!0}},n={args:{items:[]}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: "1",
      label: "TypeScript",
      selected: true
    }, {
      id: "2",
      label: "Python",
      selected: false
    }, {
      id: "3",
      label: "Rust",
      selected: true
    }, {
      id: "4",
      label: "Go",
      selected: false
    }],
    selectAll: true
  }
}`,...l.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    items: []
  }
}`,...n.parameters?.docs?.source}}};const b=["Default","Empty"];export{l as Default,n as Empty,b as __namedExportsOrder,h as default};
