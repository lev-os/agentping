import{T as a}from"./token-stream-MIhLJ3eu.js";import"./iframe-rZoXeK5l.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CDN07tui.js";const i={title:"Migrations/WebUI/Root/TokenStream",component:a,parameters:{layout:"centered"},tags:["autodocs"]},e={args:{tokens:["Hello"," ","world",", ","this"," ","is"," ","a"," ","streaming"," ","response","."],isStreaming:!1}},r={args:{tokens:["The"," ","quick"," ","brown"," ","fox"," ","jumps"," ","over"," ","the"," ","lazy"," ","dog","."],speed:80,isStreaming:!0}},s={args:{tokens:[],isStreaming:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    tokens: ["Hello", " ", "world", ", ", "this", " ", "is", " ", "a", " ", "streaming", " ", "response", "."],
    isStreaming: false
  }
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    tokens: ["The", " ", "quick", " ", "brown", " ", "fox", " ", "jumps", " ", "over", " ", "the", " ", "lazy", " ", "dog", "."],
    speed: 80,
    isStreaming: true
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    tokens: [],
    isStreaming: false
  }
}`,...s.parameters?.docs?.source}}};const c=["Default","Streaming","Empty"];export{e as Default,s as Empty,r as Streaming,c as __namedExportsOrder,i as default};
