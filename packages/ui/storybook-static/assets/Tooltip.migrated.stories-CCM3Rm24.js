import{j as t}from"./iframe-CzJrb7DT.js";import{c}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";const u={top:"bottom-full left-1/2 -translate-x-1/2 mb-2",bottom:"top-full left-1/2 -translate-x-1/2 mt-2",left:"right-full top-1/2 -translate-y-1/2 mr-2",right:"left-full top-1/2 -translate-y-1/2 ml-2"};function s({text:e,shortcut:i,position:n="top",visible:l=!0,className:p}){return l?t.jsxs("div",{role:"tooltip",className:c("absolute z-50 pointer-events-none","px-2 py-1 rounded-md","bg-zinc-900 border border-zinc-700/50","text-xs text-zinc-300 whitespace-nowrap","shadow-lg shadow-black/20","animate-in fade-in zoom-in-95 duration-150",u[n],p),children:[t.jsx("span",{children:e}),i&&t.jsx("span",{className:"ml-2 text-zinc-500 font-mono text-[10px]",children:i})]}):null}try{s.displayName="Tooltip",s.__docgenInfo={description:"",displayName:"Tooltip",props:{text:{defaultValue:null,description:"Tooltip text content",name:"text",required:!0,type:{name:"string"}},shortcut:{defaultValue:null,description:"Optional keyboard shortcut to display",name:"shortcut",required:!1,type:{name:"string"}},position:{defaultValue:{value:"top"},description:"Tooltip position relative to trigger",name:"position",required:!1,type:{name:"enum",value:[{value:'"bottom"'},{value:'"top"'},{value:'"left"'},{value:'"right"'}]}},visible:{defaultValue:{value:"true"},description:"Whether the tooltip is visible",name:"visible",required:!1,type:{name:"boolean"}},className:{defaultValue:null,description:"Additional CSS classes",name:"className",required:!1,type:{name:"string"}}}}}catch{}const x={title:"Migrations/Studio/Tooltip",component:s,parameters:{layout:"centered"},tags:["autodocs"],decorators:[e=>t.jsx("div",{style:{position:"relative",padding:"80px"},children:t.jsx(e,{})})]},o={args:{text:"Select tool",shortcut:"V",position:"top"}},r={args:{text:"Save file",shortcut:"Cmd+S",position:"bottom"}},a={args:{text:"Click to expand",position:"right"}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    text: "Select tool",
    shortcut: "V",
    position: "top"
  }
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    text: "Save file",
    shortcut: "Cmd+S",
    position: "bottom"
  }
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    text: "Click to expand",
    position: "right"
  }
}`,...a.parameters?.docs?.source}}};const g=["Default","Bottom","NoShortcut"];export{r as Bottom,o as Default,a as NoShortcut,g as __namedExportsOrder,x as default};
