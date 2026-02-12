import{j as e}from"./iframe-rZoXeK5l.js";import{c as r}from"./utils-CDN07tui.js";import{B as p}from"./bot-BKYtWU8Y.js";import{M as u}from"./message-square-Bdt3UI3S.js";import{c}from"./createLucideIcon-oH0TnkMA.js";import{S as x}from"./sparkles-KYnA3P3u.js";import{Z as f}from"./zap-DD8wo2I_.js";import"./preload-helper-PPVm8Dsz.js";const g=[["path",{d:"m16 18 6-6-6-6",key:"eg8j8"}],["path",{d:"m8 6-6 6 6 6",key:"ppft3o"}]],b=c("code",g);const h=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["circle",{cx:"11.5",cy:"14.5",r:"2.5",key:"1bq0ko"}],["path",{d:"M13.3 16.3 15 18",key:"2quom7"}]],y=c("file-search",h),j=[{icon:e.jsx(b,{size:20}),label:"Write Code",description:"Generate, refactor, or debug code",prompt:"Help me write code for "},{icon:e.jsx(y,{size:20}),label:"Explore Codebase",description:"Navigate and understand project structure",prompt:"Help me explore the codebase and find "},{icon:e.jsx(x,{size:20}),label:"Design System",description:"Create or modify UI components",prompt:"Help me design a component for "},{icon:e.jsx(f,{size:20}),label:"Quick Task",description:"Automate a development task",prompt:"Help me automate "}];function a({onStartSession:t,isLoading:i=!1,quickActions:l=j,className:d}){return e.jsxs("div",{className:r("flex flex-col items-center justify-center h-full","px-8 py-12",d),children:[e.jsxs("div",{className:"flex flex-col items-center mb-8",children:[e.jsx("div",{className:r("w-16 h-16 rounded-2xl mb-4","bg-gradient-to-br from-cyan-500/20 to-blue-600/20","border border-cyan-500/20","flex items-center justify-center"),children:e.jsx(p,{size:32,className:"text-cyan-400"})}),e.jsx("h2",{className:"text-xl font-semibold text-zinc-100 mb-1",children:"AgentPing Studio"}),e.jsx("p",{className:"text-sm text-zinc-500",children:"Your AI-powered development companion"})]}),e.jsx("div",{className:"grid grid-cols-2 gap-3 w-full max-w-md mb-8",children:l.map((o,m)=>e.jsxs("button",{onClick:()=>t?.(o.prompt),disabled:i,className:r("flex flex-col items-start gap-2 p-4 rounded-xl","bg-zinc-800/30 border border-zinc-700/30","text-left transition-all duration-150","hover:bg-zinc-800/50 hover:border-zinc-600/30","focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50",i&&"opacity-50 cursor-not-allowed"),children:[e.jsx("span",{className:"text-cyan-400",children:o.icon}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-medium text-zinc-200",children:o.label}),e.jsx("p",{className:"text-xs text-zinc-500 mt-0.5",children:o.description})]})]},m))}),e.jsxs("div",{className:"flex items-center gap-2 text-xs text-zinc-600",children:[e.jsx(u,{size:12}),e.jsx("span",{children:"Type a message below to get started"})]})]})}try{a.displayName="WelcomeScreen",a.__docgenInfo={description:"",displayName:"WelcomeScreen",props:{onStartSession:{defaultValue:null,description:"Quick action button handler",name:"onStartSession",required:!1,type:{name:"((prompt?: string) => void)"}},isLoading:{defaultValue:{value:"false"},description:"Whether the system is loading/connecting",name:"isLoading",required:!1,type:{name:"boolean"}},quickActions:{defaultValue:{value:`[
  {
    icon: <Code size={20} />,
    label: "Write Code",
    description: "Generate, refactor, or debug code",
    prompt: "Help me write code for ",
  },
  {
    icon: <FileSearch size={20} />,
    label: "Explore Codebase",
    description: "Navigate and understand project structure",
    prompt: "Help me explore the codebase and find ",
  },
  {
    icon: <Sparkles size={20} />,
    label: "Design System",
    description: "Create or modify UI components",
    prompt: "Help me design a component for ",
  },
  {
    icon: <Zap size={20} />,
    label: "Quick Task",
    description: "Automate a development task",
    prompt: "Help me automate ",
  },
]`},description:"Override the default quick actions",name:"quickActions",required:!1,type:{name:"QuickAction[]"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const C={title:"Migrations/Studio/WelcomeScreen",component:a,parameters:{layout:"fullscreen"},tags:["autodocs"],decorators:[t=>e.jsx("div",{style:{height:"500px"},children:e.jsx(t,{})})]},s={args:{onStartSession:()=>{}}},n={args:{isLoading:!0}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    onStartSession: () => {}
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    isLoading: true
  }
}`,...n.parameters?.docs?.source}}};const w=["Default","Loading"];export{s as Default,n as Loading,w as __namedExportsOrder,C as default};
