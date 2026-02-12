import{r as p,j as e}from"./iframe-CzJrb7DT.js";import{c}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";const f={input:"text-green-400",output:"text-gray-200",error:"text-red-400",system:"text-cyan-400"},g={input:"$ ",output:"  ",error:"! ",system:"# "};function i({lines:o,onCommand:l,prompt:u="$ ",className:d}){const[s,m]=p.useState(""),r=p.useRef(null);p.useEffect(()=>{r.current&&(r.current.scrollTop=r.current.scrollHeight)},[o]);const y=t=>{t.preventDefault(),s.trim()&&l&&(l(s.trim()),m(""))};return e.jsxs("div",{className:c("border border-cyan-500/20 bg-black/90 rounded-lg flex flex-col overflow-hidden",d),children:[e.jsxs("div",{className:"flex items-center gap-1.5 px-3 py-2 border-b border-cyan-500/10 bg-black/60",children:[e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-red-500/80"}),e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-yellow-500/80"}),e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-green-500/80"}),e.jsx("span",{className:"ml-2 text-[10px] font-mono text-cyan-500/50",children:"terminal"})]}),e.jsx("div",{ref:r,className:"flex-1 overflow-y-auto p-3 min-h-[200px] max-h-[400px]",children:o.map((t,x)=>e.jsxs("div",{className:c("font-mono text-xs leading-5 whitespace-pre-wrap",f[t.type]),children:[e.jsx("span",{className:"opacity-40 select-none",children:g[t.type]}),t.text]},x))}),e.jsxs("form",{onSubmit:y,className:"flex items-center border-t border-cyan-500/10 px-3 py-2 bg-black/40",children:[e.jsx("span",{className:"text-xs font-mono text-green-400 mr-1 select-none",children:u}),e.jsx("input",{type:"text",value:s,onChange:t=>m(t.target.value),className:"flex-1 bg-transparent text-xs font-mono text-gray-200 outline-none placeholder:text-cyan-500/20",placeholder:"Type a command...",spellCheck:!1,autoComplete:"off"})]})]})}try{i.displayName="TerminalView",i.__docgenInfo={description:"TerminalView - Terminal emulator UI",displayName:"TerminalView",props:{lines:{defaultValue:null,description:"",name:"lines",required:!0,type:{name:"TerminalLine[]"}},onCommand:{defaultValue:null,description:"",name:"onCommand",required:!1,type:{name:"((command: string) => void)"}},prompt:{defaultValue:{value:"$"},description:"",name:"prompt",required:!1,type:{name:"string"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const w={title:"Migrations/WebUI/Root/TerminalView",component:i,parameters:{layout:"centered"},tags:["autodocs"]},n={args:{lines:[{text:"lev init --template agent",type:"input"},{text:"Initializing project...",type:"system"},{text:"Created .lev/config.yaml",type:"output"},{text:"Created core/flowmind/",type:"output"},{text:"Warning: Node 18+ required",type:"error"},{text:"lev status",type:"input"},{text:"Branch: feat/memory-as-flowmind",type:"output"},{text:"Active flows: 3",type:"output"},{text:"System ready.",type:"system"}],prompt:"$ "}},a={args:{lines:[{text:"npm run build",type:"input"},{text:"Compiling TypeScript...",type:"system"},{text:"error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.",type:"error"},{text:"error TS2304: Cannot find name 'fetchData'.",type:"error"},{text:"Build failed with 2 errors.",type:"error"}],prompt:"~/project $ "}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    lines: [{
      text: "lev init --template agent",
      type: "input"
    }, {
      text: "Initializing project...",
      type: "system"
    }, {
      text: "Created .lev/config.yaml",
      type: "output"
    }, {
      text: "Created core/flowmind/",
      type: "output"
    }, {
      text: "Warning: Node 18+ required",
      type: "error"
    }, {
      text: "lev status",
      type: "input"
    }, {
      text: "Branch: feat/memory-as-flowmind",
      type: "output"
    }, {
      text: "Active flows: 3",
      type: "output"
    }, {
      text: "System ready.",
      type: "system"
    }],
    prompt: "$ "
  }
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    lines: [{
      text: "npm run build",
      type: "input"
    }, {
      text: "Compiling TypeScript...",
      type: "system"
    }, {
      text: "error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.",
      type: "error"
    }, {
      text: "error TS2304: Cannot find name 'fetchData'.",
      type: "error"
    }, {
      text: "Build failed with 2 errors.",
      type: "error"
    }],
    prompt: "~/project $ "
  }
}`,...a.parameters?.docs?.source}}};const N=["Default","ErrorState"];export{n as Default,a as ErrorState,N as __namedExportsOrder,w as default};
