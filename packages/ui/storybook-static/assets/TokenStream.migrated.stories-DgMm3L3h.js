import{r as t,j as n}from"./iframe-CzJrb7DT.js";import{c as x}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function p({tokens:e=[],speed:d=50,isStreaming:c=!1,className:h}){const[m,u]=t.useState(e.length),a=t.useRef(null);t.useEffect(()=>{if(!c){u(e.length);return}u(0);const s=setInterval(()=>{u(r=>r>=e.length?(clearInterval(s),r):r+1)},d);return()=>clearInterval(s)},[e,d,c]),t.useEffect(()=>{a.current&&(a.current.scrollTop=a.current.scrollHeight)},[m]);const g=e.slice(0,m),f=c&&m<e.length;return n.jsxs("div",{ref:a,className:x("border border-cyan-500/20 bg-black/60 rounded-lg p-4 font-mono text-sm text-cyan-100 max-h-64 overflow-y-auto",h),children:[g.length===0&&!f&&n.jsx("span",{className:"text-cyan-500/40 text-xs",children:"Awaiting tokens..."}),g.map((s,r)=>n.jsx("span",{children:s},r)),f&&n.jsx("span",{className:"inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-px align-middle"})]})}try{p.displayName="TokenStream",p.__docgenInfo={description:"",displayName:"TokenStream",props:{tokens:{defaultValue:{value:"[]"},description:"",name:"tokens",required:!1,type:{name:"string[]"}},speed:{defaultValue:{value:"50"},description:"",name:"speed",required:!1,type:{name:"number"}},isStreaming:{defaultValue:{value:"false"},description:"",name:"isStreaming",required:!1,type:{name:"boolean"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const v={title:"Migrations/WebUI/Root/TokenStream",component:p,parameters:{layout:"centered"},tags:["autodocs"]},o={args:{tokens:["Hello"," ","world",", ","this"," ","is"," ","a"," ","streaming"," ","response","."],isStreaming:!1}},l={args:{tokens:["The"," ","quick"," ","brown"," ","fox"," ","jumps"," ","over"," ","the"," ","lazy"," ","dog","."],speed:80,isStreaming:!0}},i={args:{tokens:[],isStreaming:!1}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    tokens: ["Hello", " ", "world", ", ", "this", " ", "is", " ", "a", " ", "streaming", " ", "response", "."],
    isStreaming: false
  }
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    tokens: ["The", " ", "quick", " ", "brown", " ", "fox", " ", "jumps", " ", "over", " ", "the", " ", "lazy", " ", "dog", "."],
    speed: 80,
    isStreaming: true
  }
}`,...l.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    tokens: [],
    isStreaming: false
  }
}`,...i.parameters?.docs?.source}}};const k=["Default","Streaming","Empty"];export{o as Default,i as Empty,l as Streaming,k as __namedExportsOrder,v as default};
