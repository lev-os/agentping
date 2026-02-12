import{j as n,r as u}from"./iframe-CzJrb7DT.js";import{c}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function d({node:e,depth:s=0}){const[t,p]=u.useState(!1),r=e.type==="folder"||e.children&&e.children.length>0,m=r?t?"▾":"▸":" ",f=r?"📁":"📄";return n.jsxs("div",{children:[n.jsxs("button",{type:"button",onClick:()=>r&&p(l=>!l),className:c("flex items-center gap-1.5 w-full text-left px-2 py-1 hover:bg-cyan-500/5 transition-colors text-sm",r?"cursor-pointer":"cursor-default"),style:{paddingLeft:`${s*16+8}px`},children:[n.jsx("span",{className:"w-3 text-cyan-500/40 text-xs",children:m}),n.jsx("span",{className:"text-xs",children:f}),n.jsx("span",{className:"text-cyan-100 truncate",children:e.label})]}),t&&e.children?.map(l=>n.jsx(d,{node:l,depth:s+1},l.id))]})}function i({nodes:e=[],className:s}){return n.jsxs("div",{className:c("border border-cyan-500/20 bg-black/60 rounded-lg py-1 font-mono max-h-72 overflow-y-auto",s),children:[e.length===0&&n.jsx("div",{className:"px-4 py-3 text-xs text-cyan-500/30",children:"No nodes"}),e.map(t=>n.jsx(d,{node:t},t.id))]})}try{i.displayName="TreeBrowser",i.__docgenInfo={description:"",displayName:"TreeBrowser",props:{nodes:{defaultValue:{value:"[]"},description:"",name:"nodes",required:!1,type:{name:"TreeNode[]"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const g={title:"Migrations/WebUI/Root/TreeBrowser",component:i,parameters:{layout:"centered"},tags:["autodocs"]},a={args:{nodes:[{id:"1",label:"src",type:"folder",children:[{id:"2",label:"components",type:"folder",children:[{id:"3",label:"Button.tsx",type:"file"},{id:"4",label:"Input.tsx",type:"file"}]},{id:"5",label:"utils",type:"folder",children:[{id:"6",label:"cn.ts",type:"file"}]},{id:"7",label:"index.ts",type:"file"}]},{id:"8",label:"package.json",type:"file"},{id:"9",label:"tsconfig.json",type:"file"}]}},o={args:{nodes:[]}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: [{
      id: "1",
      label: "src",
      type: "folder",
      children: [{
        id: "2",
        label: "components",
        type: "folder",
        children: [{
          id: "3",
          label: "Button.tsx",
          type: "file"
        }, {
          id: "4",
          label: "Input.tsx",
          type: "file"
        }]
      }, {
        id: "5",
        label: "utils",
        type: "folder",
        children: [{
          id: "6",
          label: "cn.ts",
          type: "file"
        }]
      }, {
        id: "7",
        label: "index.ts",
        type: "file"
      }]
    }, {
      id: "8",
      label: "package.json",
      type: "file"
    }, {
      id: "9",
      label: "tsconfig.json",
      type: "file"
    }]
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: []
  }
}`,...o.parameters?.docs?.source}}};const h=["Default","Empty"];export{a as Default,o as Empty,h as __namedExportsOrder,g as default};
