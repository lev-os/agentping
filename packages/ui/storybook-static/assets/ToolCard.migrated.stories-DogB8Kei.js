import{r as f,j as e}from"./iframe-CzJrb7DT.js";import{c as r}from"./utils-CDN07tui.js";import{C as h}from"./chevron-down-C3mgRJLa.js";import{C as j}from"./chevron-right-CHvHjPs9.js";import{T as b}from"./terminal-Cdo0Lett.js";import{C as u}from"./circle-x-Bb9hQjof.js";import{C as N}from"./circle-check-big-BWy-AY5y.js";import{L as z}from"./loader-circle-0-I84ZsA.js";import{C}from"./clock-prVamVzO.js";import"./preload-helper-PPVm8Dsz.js";import"./createLucideIcon-qiJ1pPWj.js";const v={pending:{icon:e.jsx(C,{size:14}),label:"Pending",color:"text-amber-400"},running:{icon:e.jsx(z,{size:14,className:"animate-spin"}),label:"Running",color:"text-cyan-400"},success:{icon:e.jsx(N,{size:14}),label:"Success",color:"text-emerald-400"},error:{icon:e.jsx(u,{size:14}),label:"Error",color:"text-red-400"},rejected:{icon:e.jsx(u,{size:14}),label:"Rejected",color:"text-zinc-500"}};function m({tool:s,onApprove:c,onReject:d,className:x}){const[l,g]=f.useState(!1),p=v[s.status];return e.jsxs("div",{className:r("rounded-lg border border-zinc-800 bg-zinc-900/50","overflow-hidden transition-colors",s.status==="pending"&&"border-amber-500/20",x),children:[e.jsxs("button",{onClick:()=>g(!l),className:r("w-full flex items-center gap-2 px-3 py-2","text-sm text-left hover:bg-white/[0.02] transition-colors"),children:[l?e.jsx(h,{size:12,className:"text-zinc-500"}):e.jsx(j,{size:12,className:"text-zinc-500"}),e.jsx(b,{size:12,className:"text-zinc-500"}),e.jsx("span",{className:"font-mono text-xs text-cyan-400",children:s.name}),e.jsxs("span",{className:r("ml-auto flex items-center gap-1",p.color),children:[p.icon,e.jsx("span",{className:"text-[10px]",children:p.label})]}),s.duration!=null&&e.jsxs("span",{className:"text-[10px] text-zinc-600 ml-1",children:[s.duration,"ms"]})]}),l&&e.jsxs("div",{className:"border-t border-zinc-800 px-3 py-2 space-y-2",children:[s.input&&e.jsxs("div",{children:[e.jsx("span",{className:"text-[10px] text-zinc-500 uppercase tracking-wider",children:"Input"}),e.jsx("pre",{className:"mt-1 text-xs text-zinc-400 bg-zinc-950/50 rounded p-2 overflow-x-auto",children:JSON.stringify(s.input,null,2)})]}),s.result&&e.jsxs("div",{children:[e.jsx("span",{className:"text-[10px] text-zinc-500 uppercase tracking-wider",children:"Result"}),e.jsx("pre",{className:"mt-1 text-xs text-zinc-400 bg-zinc-950/50 rounded p-2 overflow-x-auto max-h-40",children:s.result})]}),s.status==="pending"&&(c||d)&&e.jsxs("div",{className:"flex items-center gap-2 pt-1",children:[c&&e.jsx("button",{onClick:()=>c(s.id),className:r("px-3 py-1 rounded-md text-xs font-medium","bg-emerald-600/20 text-emerald-400","hover:bg-emerald-600/30 transition-colors"),children:"Approve"}),d&&e.jsx("button",{onClick:()=>d(s.id),className:r("px-3 py-1 rounded-md text-xs font-medium","bg-red-600/20 text-red-400","hover:bg-red-600/30 transition-colors"),children:"Reject"})]})]})]})}try{m.displayName="ToolCard",m.__docgenInfo={description:"",displayName:"ToolCard",props:{tool:{defaultValue:null,description:"",name:"tool",required:!0,type:{name:"ToolInfo"}},onApprove:{defaultValue:null,description:"Approve pending tool use",name:"onApprove",required:!1,type:{name:"((toolId: string) => void)"}},onReject:{defaultValue:null,description:"Reject pending tool use",name:"onReject",required:!1,type:{name:"((toolId: string) => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const q={title:"Migrations/Studio/ToolCard",component:m,parameters:{layout:"padded"},tags:["autodocs"]},n={args:{tool:{id:"1",name:"Edit",status:"pending",input:{file_path:"/src/App.tsx",old_string:"foo",new_string:"bar"}},onApprove:()=>{},onReject:()=>{}}},t={args:{tool:{id:"2",name:"Bash",status:"running"}}},a={args:{tool:{id:"3",name:"Read",status:"success",result:"File contents here...",duration:42}}},o={args:{tool:{id:"4",name:"Write",status:"error",result:"Permission denied"}}},i=n;n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    tool: {
      id: "1",
      name: "Edit",
      status: "pending",
      input: {
        file_path: "/src/App.tsx",
        old_string: "foo",
        new_string: "bar"
      }
    },
    onApprove: () => {},
    onReject: () => {}
  }
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    tool: {
      id: "2",
      name: "Bash",
      status: "running"
    }
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    tool: {
      id: "3",
      name: "Read",
      status: "success",
      result: "File contents here...",
      duration: 42
    }
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    tool: {
      id: "4",
      name: "Write",
      status: "error",
      result: "Permission denied"
    }
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:"Pending",...i.parameters?.docs?.source}}};const V=["Pending","Running","Success","Error","Default"];export{i as Default,o as Error,n as Pending,t as Running,a as Success,V as __namedExportsOrder,q as default};
