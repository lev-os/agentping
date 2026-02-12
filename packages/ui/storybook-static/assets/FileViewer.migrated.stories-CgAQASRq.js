import{j as e}from"./iframe-rZoXeK5l.js";import{c as h}from"./utils-CDN07tui.js";import{F as y}from"./file-code-B20LR_wJ.js";import{C as b}from"./copy-DV6hG12W.js";import{D as j}from"./download-DhOkE8Cz.js";import{X as C}from"./x-B6dVGlgb.js";import"./preload-helper-PPVm8Dsz.js";import"./createLucideIcon-oH0TnkMA.js";function a({filePath:t,content:i,language:o,loading:x=!1,error:l=null,onClose:c,onCopy:d,onDownload:p,className:f}){const g=t.split("/").pop()??t,u=i?.split(`
`)??[];return e.jsxs("div",{className:h("flex flex-col h-full bg-zinc-950",f),children:[e.jsxs("div",{className:"flex items-center justify-between px-3 py-2 border-b border-zinc-800",children:[e.jsxs("div",{className:"flex items-center gap-2 min-w-0",children:[e.jsx(y,{size:14,className:"text-cyan-500 flex-shrink-0"}),e.jsx("span",{className:"text-xs text-zinc-300 truncate",children:g}),o&&e.jsx("span",{className:"text-[10px] text-zinc-600 bg-zinc-800/50 px-1.5 rounded",children:o})]}),e.jsxs("div",{className:"flex items-center gap-1",children:[d&&e.jsx("button",{onClick:d,className:"p-1 text-zinc-500 hover:text-zinc-300 transition-colors",title:"Copy","aria-label":"Copy file content",children:e.jsx(b,{size:12})}),p&&e.jsx("button",{onClick:p,className:"p-1 text-zinc-500 hover:text-zinc-300 transition-colors",title:"Download","aria-label":"Download file",children:e.jsx(j,{size:12})}),c&&e.jsx("button",{onClick:c,className:"p-1 text-zinc-500 hover:text-zinc-300 transition-colors",title:"Close","aria-label":"Close file viewer",children:e.jsx(C,{size:12})})]})]}),e.jsx("div",{className:"flex-1 overflow-auto",children:x?e.jsxs("div",{className:"flex items-center justify-center py-12 text-xs text-zinc-500",children:[e.jsx("div",{className:"w-4 h-4 border-2 border-zinc-700 border-t-cyan-500 rounded-full animate-spin mr-2"}),"Loading..."]}):l?e.jsx("div",{className:"px-4 py-8 text-center text-xs text-red-400",children:l}):e.jsxs("div",{className:"flex font-mono text-[11px] leading-5",children:[e.jsx("div",{className:"flex flex-col items-end px-3 py-2 text-zinc-600 select-none bg-zinc-900/50 border-r border-zinc-800",children:u.map((v,m)=>e.jsx("span",{children:m+1},m))}),e.jsx("pre",{className:"flex-1 p-2 text-zinc-300 overflow-x-auto",children:i})]})}),e.jsxs("div",{className:"flex items-center justify-between px-3 py-1 border-t border-zinc-800 text-[10px] text-zinc-600",children:[e.jsxs("span",{children:[u.length," lines"]}),e.jsx("span",{className:"truncate max-w-[200px]",children:t})]})]})}try{a.displayName="FileViewer",a.__docgenInfo={description:"",displayName:"FileViewer",props:{filePath:{defaultValue:null,description:"File path being displayed",name:"filePath",required:!0,type:{name:"string"}},content:{defaultValue:null,description:"File content",name:"content",required:!1,type:{name:"string"}},language:{defaultValue:null,description:"File language for syntax highlighting hint",name:"language",required:!1,type:{name:"string"}},loading:{defaultValue:{value:"false"},description:"Whether the file is loading",name:"loading",required:!1,type:{name:"boolean"}},error:{defaultValue:{value:"null"},description:"Error message",name:"error",required:!1,type:{name:"string | null"}},onClose:{defaultValue:null,description:"Close handler",name:"onClose",required:!1,type:{name:"(() => void)"}},onCopy:{defaultValue:null,description:"Copy content handler",name:"onCopy",required:!1,type:{name:"(() => void)"}},onDownload:{defaultValue:null,description:"Download handler",name:"onDownload",required:!1,type:{name:"(() => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const q={title:"Migrations/Studio/FileViewer",component:a,parameters:{layout:"padded"},tags:["autodocs"],decorators:[t=>e.jsx("div",{style:{height:400},children:e.jsx(t,{})})]},n={args:{filePath:"/src/components/Button.tsx",language:"typescript",content:`import React from "react";

export interface ButtonProps {
  label: string;
  onClick?: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}`,onClose:()=>{},onCopy:()=>{}}},r={args:{filePath:"/src/App.tsx",loading:!0}},s={args:{filePath:"/src/missing.ts",error:"File not found"}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    filePath: "/src/components/Button.tsx",
    language: "typescript",
    content: \`import React from "react";\\n\\nexport interface ButtonProps {\\n  label: string;\\n  onClick?: () => void;\\n}\\n\\nexport function Button({ label, onClick }: ButtonProps) {\\n  return <button onClick={onClick}>{label}</button>;\\n}\`,
    onClose: () => {},
    onCopy: () => {}
  }
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    filePath: "/src/App.tsx",
    loading: true
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    filePath: "/src/missing.ts",
    error: "File not found"
  }
}`,...s.parameters?.docs?.source}}};const B=["Default","Loading","WithError"];export{n as Default,r as Loading,s as WithError,B as __namedExportsOrder,q as default};
