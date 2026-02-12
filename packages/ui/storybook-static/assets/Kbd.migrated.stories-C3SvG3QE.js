import{j as c}from"./iframe-CzJrb7DT.js";import{c as i}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";const l={Mod:navigator?.platform?.includes("Mac")?"⌘":"Ctrl",Ctrl:"⌃",Alt:navigator?.platform?.includes("Mac")?"⌥":"Alt",Shift:"⇧",Enter:"⏎",Backspace:"⌫",Delete:"⌦",Escape:"⎋",Tab:"⇥",Space:"␣",Up:"↑",Down:"↓",Left:"←",Right:"→"};function o({keys:n,className:d}){const p=n.split("+").map(a=>{const e=a.trim();return l[e]||e.toUpperCase()});return c.jsx("kbd",{className:i("inline-flex items-center gap-0.5 font-mono text-[11px] leading-none","text-zinc-500",d),children:p.map((a,e)=>c.jsx("span",{className:i("inline-flex items-center justify-center","min-w-[18px] h-[18px] px-1","rounded border border-zinc-700/50 bg-zinc-800/50","text-zinc-400"),children:a},e))})}try{o.displayName="Kbd",o.__docgenInfo={description:"",displayName:"Kbd",props:{keys:{defaultValue:null,description:'Keyboard shortcut string, e.g. "Mod+K" or "Mod+Shift+Z"',name:"keys",required:!0,type:{name:"string"}},className:{defaultValue:null,description:"Additional CSS classes",name:"className",required:!1,type:{name:"string"}}}}}catch{}const f={title:"Migrations/Studio/Kbd",component:o,parameters:{layout:"centered"},tags:["autodocs"]},r={args:{keys:"Mod+K"}},t={args:{keys:"Mod+Shift+Z"}},s={args:{keys:"V"}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    keys: "Mod+K"
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    keys: "Mod+Shift+Z"
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    keys: "V"
  }
}`,...s.parameters?.docs?.source}}};const y=["Default","Complex","SingleKey"];export{t as Complex,r as Default,s as SingleKey,y as __namedExportsOrder,f as default};
