import{r as m,j as e}from"./iframe-CzJrb7DT.js";import{c as o}from"./utils-CDN07tui.js";import{P as b}from"./panels-top-left-BKmAHPtS.js";import{c as h}from"./createLucideIcon-qiJ1pPWj.js";import{S as v}from"./settings-BTCl2QKX.js";import{C as g}from"./chevron-right-CHvHjPs9.js";import{C as f}from"./chevron-down-C3mgRJLa.js";import"./preload-helper-PPVm8Dsz.js";const k=[["path",{d:"m14.622 17.897-10.68-2.913",key:"vj2p1u"}],["path",{d:"M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z",key:"18tc5c"}],["path",{d:"M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15",key:"ytzfxy"}]],j=h("paintbrush",k);function z({section:n,onPropertyChange:l}){const[s,p]=m.useState(!1);return e.jsxs("div",{className:"border-b border-zinc-800/50",children:[e.jsxs("button",{onClick:()=>p(!s),className:"w-full flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors",children:[s?e.jsx(g,{size:10}):e.jsx(f,{size:10}),n.label]}),!s&&e.jsx("div",{className:"px-3 pb-2 space-y-2",children:n.fields.map(t=>e.jsxs("div",{className:"flex items-center justify-between gap-2",children:[e.jsx("label",{className:"text-[10px] text-zinc-500 flex-shrink-0 w-20",children:t.label}),t.type==="text"||t.type==="number"?e.jsx("input",{type:t.type,value:String(t.value),onChange:a=>l?.(t.key,a.target.value),className:o("flex-1 px-2 py-1 rounded text-xs","bg-zinc-800/50 border border-zinc-700/30 text-zinc-200","outline-none focus:border-cyan-500/30")}):t.type==="color"?e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx("div",{className:"w-5 h-5 rounded border border-zinc-700/50",style:{backgroundColor:String(t.value)}}),e.jsx("input",{value:String(t.value),onChange:a=>l?.(t.key,a.target.value),className:"w-20 px-2 py-1 rounded text-xs bg-zinc-800/50 border border-zinc-700/30 text-zinc-200 outline-none font-mono"})]}):t.type==="select"?e.jsx("select",{value:String(t.value),onChange:a=>l?.(t.key,a.target.value),className:"flex-1 px-2 py-1 rounded text-xs bg-zinc-800/50 border border-zinc-700/30 text-zinc-200 outline-none",children:t.options?.map(a=>e.jsx("option",{value:a,children:a},a))}):t.type==="toggle"?e.jsx("button",{onClick:()=>l?.(t.key,!t.value),className:o("w-8 h-4 rounded-full transition-colors",t.value?"bg-cyan-600":"bg-zinc-700"),children:e.jsx("span",{className:o("block w-3 h-3 rounded-full bg-white shadow transition-transform",t.value?"translate-x-4":"translate-x-0.5")})}):null]},t.key))})]})}const P=[{id:"layout",icon:b,label:"Layout"},{id:"style",icon:j,label:"Style"},{id:"advanced",icon:v,label:"Advanced"}];function d({selectedElementName:n,layoutProperties:l=[],styleProperties:s=[],advancedProperties:p=[],onPropertyChange:t,className:a}){const[u,x]=m.useState("layout"),y=u==="layout"?l:u==="style"?s:p;return e.jsxs("div",{className:o("flex flex-col h-full",a),children:[e.jsx("div",{className:"px-3 py-2 border-b border-zinc-800",children:e.jsx("span",{className:"text-xs font-medium text-zinc-300",children:n??"Properties"})}),e.jsx("div",{className:"flex items-center border-b border-zinc-800",children:P.map(r=>e.jsxs("button",{onClick:()=>x(r.id),className:o("flex items-center gap-1 px-3 py-1.5 text-[11px]","border-b-2 -mb-px transition-colors",u===r.id?"border-cyan-500 text-cyan-400":"border-transparent text-zinc-500 hover:text-zinc-300"),children:[e.jsx(r.icon,{size:10}),r.label]},r.id))}),e.jsx("div",{className:"flex-1 overflow-y-auto",children:y.length===0?e.jsx("div",{className:"flex items-center justify-center py-12 text-xs text-zinc-600",children:n?"No properties for this tab":"Select an element to see properties"}):y.map(r=>e.jsx(z,{section:r,onPropertyChange:t},r.id))})]})}try{d.displayName="PropertiesPanel",d.__docgenInfo={description:"",displayName:"PropertiesPanel",props:{selectedElementName:{defaultValue:null,description:"Currently selected element name",name:"selectedElementName",required:!1,type:{name:"string"}},layoutProperties:{defaultValue:{value:"[]"},description:"Property sections organized by tab",name:"layoutProperties",required:!1,type:{name:"PropertySection[]"}},styleProperties:{defaultValue:{value:"[]"},description:"",name:"styleProperties",required:!1,type:{name:"PropertySection[]"}},advancedProperties:{defaultValue:{value:"[]"},description:"",name:"advancedProperties",required:!1,type:{name:"PropertySection[]"}},onPropertyChange:{defaultValue:null,description:"Property change handler",name:"onPropertyChange",required:!1,type:{name:"((key: string, value: unknown) => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const E={title:"Migrations/Studio/PropertiesPanel",component:d,parameters:{layout:"padded"},tags:["autodocs"],decorators:[n=>e.jsx("div",{style:{height:500,width:300},children:e.jsx(n,{})})]},i={args:{selectedElementName:"Hero Frame",layoutProperties:[{id:"position",label:"Position",fields:[{key:"x",label:"X",value:120,type:"number"},{key:"y",label:"Y",value:80,type:"number"},{key:"width",label:"Width",value:400,type:"number"},{key:"height",label:"Height",value:300,type:"number"}]},{id:"layout",label:"Auto Layout",fields:[{key:"direction",label:"Direction",value:"horizontal",type:"select",options:["horizontal","vertical"]},{key:"gap",label:"Gap",value:16,type:"number"}]}],styleProperties:[{id:"fill",label:"Fill",fields:[{key:"bg",label:"Background",value:"#1a1a2e",type:"color"},{key:"opacity",label:"Opacity",value:100,type:"number"}]}],onPropertyChange:()=>{}}},c={args:{}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    selectedElementName: "Hero Frame",
    layoutProperties: [{
      id: "position",
      label: "Position",
      fields: [{
        key: "x",
        label: "X",
        value: 120,
        type: "number"
      }, {
        key: "y",
        label: "Y",
        value: 80,
        type: "number"
      }, {
        key: "width",
        label: "Width",
        value: 400,
        type: "number"
      }, {
        key: "height",
        label: "Height",
        value: 300,
        type: "number"
      }]
    }, {
      id: "layout",
      label: "Auto Layout",
      fields: [{
        key: "direction",
        label: "Direction",
        value: "horizontal",
        type: "select",
        options: ["horizontal", "vertical"]
      }, {
        key: "gap",
        label: "Gap",
        value: 16,
        type: "number"
      }]
    }],
    styleProperties: [{
      id: "fill",
      label: "Fill",
      fields: [{
        key: "bg",
        label: "Background",
        value: "#1a1a2e",
        type: "color"
      }, {
        key: "opacity",
        label: "Opacity",
        value: 100,
        type: "number"
      }]
    }],
    onPropertyChange: () => {}
  }
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...c.parameters?.docs?.source}}};const A=["Default","NoSelection"];export{i as Default,c as NoSelection,A as __namedExportsOrder,E as default};
