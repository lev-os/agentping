import{r as v,j as e}from"./iframe-rZoXeK5l.js";import{c as u}from"./utils-CDN07tui.js";import{F}from"./file-tree-o0uPDUxT.js";import{F as x}from"./folder-tree-BLE1Q_RX.js";import{R as b}from"./refresh-cw-CiVBb4Nm.js";import{S as z}from"./search-C6nlid9P.js";import"./preload-helper-PPVm8Dsz.js";import"./chevron-down-iJpBzq2S.js";import"./createLucideIcon-oH0TnkMA.js";import"./chevron-right-Dy2FBg2Y.js";import"./folder-open-CZ_u-wdF.js";import"./file-code-B20LR_wJ.js";import"./file-text-BxASozvX.js";import"./image-BT8vX6cW.js";function o({files:t,workspacePath:c,onFileSelect:h,onRefresh:p,selectedPath:y,modifiedPaths:j,className:g}){const[r,N]=v.useState(""),d=a=>r?a.reduce((l,s)=>{if(s.name.toLowerCase().includes(r.toLowerCase()))l.push(s);else if(s.children){const f=d(s.children);f.length>0&&l.push({...s,children:f})}return l},[]):a,m=d(t);return e.jsxs("div",{className:u("flex flex-col h-full",g),children:[e.jsxs("div",{className:"px-3 py-2 border-b border-zinc-800",children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(x,{size:14,className:"text-cyan-500"}),e.jsx("span",{className:"text-xs font-medium text-zinc-300",children:"Files"})]}),p&&e.jsx("button",{onClick:p,className:"p-1 text-zinc-500 hover:text-zinc-300 transition-colors",title:"Refresh","aria-label":"Refresh file tree",children:e.jsx(b,{size:12})})]}),c&&e.jsx("div",{className:"flex items-center gap-1 mb-2 text-[10px] text-zinc-600 truncate",children:c}),e.jsxs("div",{className:"relative",children:[e.jsx(z,{size:12,className:"absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500"}),e.jsx("input",{value:r,onChange:a=>N(a.target.value),placeholder:"Search files...","aria-label":"Search files",className:u("w-full pl-7 pr-2 py-1.5 rounded-md text-xs","bg-zinc-800/50 border border-zinc-700/50 text-zinc-200","placeholder-zinc-500 outline-none focus:border-cyan-500/30")})]})]}),e.jsx("div",{className:"flex-1 overflow-y-auto py-1",children:m.length===0?e.jsxs("div",{className:"flex flex-col items-center justify-center py-8 text-zinc-600",children:[e.jsx(x,{size:20,className:"mb-2"}),e.jsx("span",{className:"text-xs",children:r?"No matching files":"No files"})]}):e.jsx(F,{items:m,onFileClick:h,modifiedPaths:j,selectedPath:y})})]})}try{o.displayName="FileExplorer",o.__docgenInfo={description:"",displayName:"FileExplorer",props:{files:{defaultValue:null,description:"File tree data",name:"files",required:!0,type:{name:"FileNode[]"}},workspacePath:{defaultValue:null,description:"Current workspace path",name:"workspacePath",required:!1,type:{name:"string"}},onFileSelect:{defaultValue:null,description:"File select handler",name:"onFileSelect",required:!1,type:{name:"((path: string) => void)"}},onRefresh:{defaultValue:null,description:"Refresh file tree",name:"onRefresh",required:!1,type:{name:"(() => void)"}},selectedPath:{defaultValue:null,description:"Currently selected path",name:"selectedPath",required:!1,type:{name:"string"}},modifiedPaths:{defaultValue:null,description:"Modified file paths",name:"modifiedPaths",required:!1,type:{name:"Set<string>"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const T={title:"Migrations/Studio/FileExplorer",component:o,parameters:{layout:"padded"},tags:["autodocs"],decorators:[t=>e.jsx("div",{style:{height:500,width:280},children:e.jsx(t,{})})]},n={args:{files:[{name:"src",path:"/src",type:"directory",children:[{name:"App.tsx",path:"/src/App.tsx",type:"file",extension:"tsx"},{name:"main.ts",path:"/src/main.ts",type:"file",extension:"ts"}]},{name:"package.json",path:"/package.json",type:"file",extension:"json"}],workspacePath:"/Users/dev/myproject",onFileSelect:()=>{},onRefresh:()=>{}}},i={args:{files:[]}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    files: [{
      name: "src",
      path: "/src",
      type: "directory",
      children: [{
        name: "App.tsx",
        path: "/src/App.tsx",
        type: "file",
        extension: "tsx"
      }, {
        name: "main.ts",
        path: "/src/main.ts",
        type: "file",
        extension: "ts"
      }]
    }, {
      name: "package.json",
      path: "/package.json",
      type: "file",
      extension: "json"
    }],
    workspacePath: "/Users/dev/myproject",
    onFileSelect: () => {},
    onRefresh: () => {}
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    files: []
  }
}`,...i.parameters?.docs?.source}}};const U=["Default","Empty"];export{n as Default,i as Empty,U as __namedExportsOrder,T as default};
