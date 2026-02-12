import{j as e}from"./iframe-rZoXeK5l.js";import{c as l}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";const d={sunny:"☀️",cloudy:"☁️",rainy:"🌧️",snowy:"❄️",stormy:"⚡"},m={sunny:"Sunny",cloudy:"Cloudy",rainy:"Rainy",snowy:"Snowy",stormy:"Stormy"};function t({temperature:o=22,condition:s="sunny",location:c="Unknown",unit:i="C",className:u}){return e.jsxs("div",{className:l("border border-cyan-500/20 bg-black/60 rounded-lg p-5 w-56 font-mono",u),children:[e.jsx("div",{className:"text-xs text-cyan-500/60 uppercase tracking-wider mb-3",children:c}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"text-4xl",children:d[s]}),e.jsxs("div",{children:[e.jsxs("div",{className:"text-2xl text-cyan-300 tabular-nums",children:[o,"°",i]}),e.jsx("div",{className:"text-xs text-cyan-500/50",children:m[s]})]})]})]})}try{t.displayName="WeatherCard",t.__docgenInfo={description:"",displayName:"WeatherCard",props:{temperature:{defaultValue:{value:"22"},description:"",name:"temperature",required:!1,type:{name:"number"}},condition:{defaultValue:{value:"sunny"},description:"",name:"condition",required:!1,type:{name:"enum",value:[{value:'"sunny"'},{value:'"cloudy"'},{value:'"rainy"'},{value:'"snowy"'},{value:'"stormy"'}]}},location:{defaultValue:{value:"Unknown"},description:"",name:"location",required:!1,type:{name:"string"}},unit:{defaultValue:{value:"C"},description:"",name:"unit",required:!1,type:{name:"enum",value:[{value:'"C"'},{value:'"F"'}]}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const f={title:"Migrations/WebUI/Root/WeatherCard",component:t,parameters:{layout:"centered"},tags:["autodocs"]},n={args:{temperature:22,condition:"sunny",location:"San Francisco",unit:"C"}},a={args:{temperature:8,condition:"stormy",location:"London",unit:"C"}},r={args:{temperature:-5,condition:"snowy",location:"Oslo",unit:"C"}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    temperature: 22,
    condition: "sunny",
    location: "San Francisco",
    unit: "C"
  }
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    temperature: 8,
    condition: "stormy",
    location: "London",
    unit: "C"
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    temperature: -5,
    condition: "snowy",
    location: "Oslo",
    unit: "C"
  }
}`,...r.parameters?.docs?.source}}};const g=["Default","Stormy","Snowy"];export{n as Default,r as Snowy,a as Stormy,g as __namedExportsOrder,f as default};
