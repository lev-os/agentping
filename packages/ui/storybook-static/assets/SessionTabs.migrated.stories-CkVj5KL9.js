import{j as e}from"./iframe-rZoXeK5l.js";import{c as n}from"./utils-CDN07tui.js";import{B as f}from"./bot-BKYtWU8Y.js";import{M as g}from"./message-square-Bdt3UI3S.js";import{X as S}from"./x-B6dVGlgb.js";import{P as b}from"./plus-CdbGrWjK.js";import"./preload-helper-PPVm8Dsz.js";import"./createLucideIcon-oH0TnkMA.js";const h={idle:"bg-zinc-500",running:"bg-cyan-500 animate-pulse",error:"bg-red-500",waiting:"bg-amber-500 animate-pulse"};function i({agents:o,activeSession:c,sessionNames:u={},onSelectSession:m,onNewSession:t,onCloseSession:r,className:p}){return e.jsxs("div",{className:n("flex items-center gap-0.5 px-2 py-1","border-b border-zinc-800 bg-zinc-900/30","overflow-x-auto scrollbar-none",p),role:"tablist",children:[o.map(s=>{const l=s.sessionId===c,d=u[s.sessionId]??s.name??s.sessionId;return e.jsxs("div",{role:"tab","aria-selected":l,className:n("group flex items-center gap-1.5 px-3 py-1.5 rounded-md","text-xs cursor-pointer transition-all duration-150","max-w-[160px]",l?"bg-zinc-800 text-zinc-200 border border-zinc-700/50":"text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]"),onClick:()=>m?.(s.sessionId),children:[e.jsx("span",{className:n("w-1.5 h-1.5 rounded-full flex-shrink-0",h[s.status])}),s.status==="running"?e.jsx(f,{size:12,className:"text-cyan-400 flex-shrink-0"}):e.jsx(g,{size:12,className:"flex-shrink-0"}),e.jsx("span",{className:"truncate",children:d}),r&&e.jsx("button",{onClick:x=>{x.stopPropagation(),r(s.sessionId)},className:n("ml-auto p-0.5 rounded","opacity-0 group-hover:opacity-100","text-zinc-500 hover:text-zinc-300 hover:bg-white/5","transition-all"),"aria-label":`Close ${d}`,children:e.jsx(S,{size:10})})]},s.sessionId)}),t&&e.jsx("button",{onClick:t,className:n("flex items-center gap-1 px-2 py-1.5 rounded-md","text-xs text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]","transition-colors"),"aria-label":"New session",children:e.jsx(b,{size:12})})]})}try{i.displayName="SessionTabs",i.__docgenInfo={description:"",displayName:"SessionTabs",props:{agents:{defaultValue:null,description:"Available agents/sessions",name:"agents",required:!0,type:{name:"SessionAgent[]"}},activeSession:{defaultValue:null,description:"Currently active session id",name:"activeSession",required:!1,type:{name:"string"}},sessionNames:{defaultValue:{value:"{}"},description:"Session display names",name:"sessionNames",required:!1,type:{name:"Record<string, string>"}},onSelectSession:{defaultValue:null,description:"Tab select handler",name:"onSelectSession",required:!1,type:{name:"((sessionId: string) => void)"}},onNewSession:{defaultValue:null,description:"New session handler",name:"onNewSession",required:!1,type:{name:"(() => void)"}},onCloseSession:{defaultValue:null,description:"Close session handler",name:"onCloseSession",required:!1,type:{name:"((sessionId: string) => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const _={title:"Migrations/Studio/SessionTabs",component:i,parameters:{layout:"padded"},tags:["autodocs"]},a={args:{agents:[{sessionId:"s1",name:"Claude",status:"running"},{sessionId:"s2",name:"Researcher",status:"idle"},{sessionId:"s3",name:"Tester",status:"error"}],activeSession:"s1",onSelectSession:()=>{},onNewSession:()=>{},onCloseSession:()=>{}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    agents: [{
      sessionId: "s1",
      name: "Claude",
      status: "running"
    }, {
      sessionId: "s2",
      name: "Researcher",
      status: "idle"
    }, {
      sessionId: "s3",
      name: "Tester",
      status: "error"
    }],
    activeSession: "s1",
    onSelectSession: () => {},
    onNewSession: () => {},
    onCloseSession: () => {}
  }
}`,...a.parameters?.docs?.source}}};const T=["Default"];export{a as Default,T as __namedExportsOrder,_ as default};
