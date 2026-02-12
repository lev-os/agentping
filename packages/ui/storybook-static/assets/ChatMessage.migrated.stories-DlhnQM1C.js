import{j as e}from"./iframe-rZoXeK5l.js";import{c as n}from"./utils-CDN07tui.js";import{U as g}from"./user-B5keVgCc.js";import{B as x}from"./bot-BKYtWU8Y.js";import"./preload-helper-PPVm8Dsz.js";import"./createLucideIcon-oH0TnkMA.js";function f({role:s}){return s==="user"?e.jsx("div",{className:"w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0",children:e.jsx(g,{size:14,className:"text-zinc-300"})}):e.jsx("div",{className:"w-7 h-7 rounded-full bg-cyan-900/50 border border-cyan-500/20 flex items-center justify-center flex-shrink-0",children:e.jsx(x,{size:14,className:"text-cyan-400"})})}function h(){return e.jsxs("span",{className:"inline-flex gap-1 items-center",children:[e.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"}),e.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse [animation-delay:150ms]"}),e.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse [animation-delay:300ms]"})]})}function m({message:s,renderContent:d,renderToolCard:l,className:p}){const u=s.role==="user";return s.role==="system"?e.jsx("div",{className:n("flex justify-center py-2",p),children:e.jsx("span",{className:"text-xs text-zinc-500 bg-zinc-800/50 px-3 py-1 rounded-full",children:s.content})}):e.jsxs("div",{className:n("flex gap-3 px-4 py-3","hover:bg-white/[0.01] transition-colors",p),children:[e.jsx(f,{role:s.role}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[e.jsx("span",{className:"text-xs font-medium text-zinc-400",children:u?"You":"Assistant"}),s.timestamp&&e.jsx("span",{className:"text-[10px] text-zinc-600",children:s.timestamp instanceof Date?s.timestamp.toLocaleTimeString():String(s.timestamp)})]}),e.jsx("div",{className:"text-sm text-zinc-300 leading-relaxed",children:s.isStreaming&&!s.content?e.jsx(h,{}):d?d(s.content):e.jsx("p",{className:"whitespace-pre-wrap",children:s.content})}),s.toolUse&&s.toolUse.length>0&&e.jsx("div",{className:"mt-2 space-y-2",children:s.toolUse.map(t=>l?l(t):e.jsxs("div",{className:n("rounded-lg border border-zinc-800 bg-zinc-900/50 p-3","text-xs text-zinc-400"),children:[e.jsx("span",{className:"font-mono text-cyan-500",children:t.name}),t.status&&e.jsx("span",{className:n("ml-2 px-1.5 py-0.5 rounded text-[10px]",t.status==="success"&&"bg-emerald-500/10 text-emerald-400",t.status==="error"&&"bg-red-500/10 text-red-400",t.status==="running"&&"bg-cyan-500/10 text-cyan-400",t.status==="pending"&&"bg-zinc-500/10 text-zinc-500"),children:t.status})]},t.id))})]})]})}try{m.displayName="ChatMessage",m.__docgenInfo={description:"",displayName:"ChatMessage",props:{message:{defaultValue:null,description:"",name:"message",required:!0,type:{name:"Message"}},renderContent:{defaultValue:null,description:"Custom markdown renderer — defaults to raw text",name:"renderContent",required:!1,type:{name:"((content: string) => ReactNode)"}},renderToolCard:{defaultValue:null,description:"Tool card renderer",name:"renderToolCard",required:!1,type:{name:"((tool: ToolUse) => ReactNode)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const v={title:"Migrations/Studio/ChatMessage",component:m,parameters:{layout:"padded"},tags:["autodocs"]},a={args:{message:{id:"1",role:"user",content:"Can you help me refactor this component?",timestamp:new Date}}},r={args:{message:{id:"2",role:"assistant",content:`Sure! I'll analyze the component structure and suggest improvements.

Here's what I found:
1. The component has too many responsibilities
2. State management can be simplified
3. Some props are unused`,timestamp:new Date}}},i={args:{message:{id:"3",role:"assistant",content:"Let me read the file first.",timestamp:new Date,toolUse:[{id:"t1",name:"Read",status:"success"},{id:"t2",name:"Edit",status:"running"}]}}},o={args:{message:{id:"4",role:"assistant",content:"",isStreaming:!0}}},c={args:{message:{id:"5",role:"system",content:"Session started"}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    message: {
      id: "1",
      role: "user",
      content: "Can you help me refactor this component?",
      timestamp: new Date()
    }
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    message: {
      id: "2",
      role: "assistant",
      content: "Sure! I'll analyze the component structure and suggest improvements.\\n\\nHere's what I found:\\n1. The component has too many responsibilities\\n2. State management can be simplified\\n3. Some props are unused",
      timestamp: new Date()
    }
  }
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    message: {
      id: "3",
      role: "assistant",
      content: "Let me read the file first.",
      timestamp: new Date(),
      toolUse: [{
        id: "t1",
        name: "Read",
        status: "success"
      }, {
        id: "t2",
        name: "Edit",
        status: "running"
      }]
    }
  }
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    message: {
      id: "4",
      role: "assistant",
      content: "",
      isStreaming: true
    }
  }
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    message: {
      id: "5",
      role: "system",
      content: "Session started"
    }
  }
}`,...c.parameters?.docs?.source}}};const M=["UserMessage","AssistantMessage","WithToolUse","Streaming","SystemMessage"];export{r as AssistantMessage,o as Streaming,c as SystemMessage,a as UserMessage,i as WithToolUse,M as __namedExportsOrder,v as default};
