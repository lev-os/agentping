import{r as o,j as l}from"./iframe-rZoXeK5l.js";import{c as u}from"./utils-CDN07tui.js";import{C as k}from"./chevron-down-iJpBzq2S.js";import{C as S}from"./check-C6g1ZBL2.js";import"./preload-helper-PPVm8Dsz.js";import"./createLucideIcon-oH0TnkMA.js";function g({value:s,options:r,onChange:h,placeholder:x="Select...",disabled:c=!1,className:C}){const[n,t]=o.useState(!1),[i,b]=o.useState(-1),v=o.useRef(null),w=o.useRef(null),d=r.find(e=>e.value===s);o.useEffect(()=>{const e=a=>{v.current&&!v.current.contains(a.target)&&t(!1)};return n&&document.addEventListener("mousedown",e),()=>document.removeEventListener("mousedown",e)},[n]);const y=o.useCallback(e=>{if(!c)switch(e.key){case"Enter":case" ":if(e.preventDefault(),n&&i>=0){const a=r[i];a.disabled||(h(a.value),t(!1))}else t(!0);break;case"ArrowDown":e.preventDefault(),n?b(a=>a<r.length-1?a+1:0):t(!0);break;case"ArrowUp":e.preventDefault(),n&&b(a=>a>0?a-1:r.length-1);break;case"Escape":t(!1);break}},[c,n,i,r,h]);return l.jsxs("div",{ref:v,className:u("relative inline-block w-full",C),onKeyDown:y,children:[l.jsxs("button",{type:"button",onClick:()=>!c&&t(!n),disabled:c,className:u("flex items-center justify-between w-full","px-3 py-2 rounded-lg","bg-zinc-800/50 border border-zinc-700/50","text-sm text-zinc-200","transition-colors duration-150","hover:border-zinc-600/50","focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50",c&&"opacity-50 cursor-not-allowed",n&&"border-cyan-500/30"),role:"combobox","aria-expanded":n,"aria-haspopup":"listbox",children:[l.jsx("span",{className:u(!d&&"text-zinc-500"),children:d?l.jsxs("span",{className:"flex items-center gap-2",children:[d.icon,d.label]}):x}),l.jsx(k,{size:14,className:u("text-zinc-500 transition-transform duration-200",n&&"rotate-180")})]}),n&&l.jsx("ul",{ref:w,role:"listbox",className:u("absolute z-50 w-full mt-1","bg-zinc-900 border border-zinc-700/50 rounded-lg","shadow-xl shadow-black/30","max-h-60 overflow-y-auto","animate-in fade-in slide-in-from-top-1 duration-150"),children:r.map((e,a)=>l.jsxs("li",{role:"option","aria-selected":e.value===s,className:u("flex items-center gap-2 px-3 py-2 text-sm cursor-pointer","transition-colors duration-100",e.value===s?"text-cyan-400":"text-zinc-300",a===i&&"bg-white/5",!e.disabled&&"hover:bg-white/5",e.disabled&&"opacity-40 cursor-not-allowed"),onClick:()=>{e.disabled||(h(e.value),t(!1))},onMouseEnter:()=>b(a),children:[e.icon&&l.jsx("span",{className:"flex-shrink-0",children:e.icon}),l.jsx("span",{className:"flex-1",children:e.label}),e.value===s&&l.jsx(S,{size:14,className:"text-cyan-400 flex-shrink-0"})]},e.value))})]})}try{g.displayName="Dropdown",g.__docgenInfo={description:"",displayName:"Dropdown",props:{value:{defaultValue:null,description:"Currently selected value",name:"value",required:!1,type:{name:"string"}},options:{defaultValue:null,description:"Available options",name:"options",required:!0,type:{name:"DropdownOption[]"}},onChange:{defaultValue:null,description:"Selection change handler",name:"onChange",required:!0,type:{name:"(value: string) => void"}},placeholder:{defaultValue:{value:"Select..."},description:"Placeholder text when no value selected",name:"placeholder",required:!1,type:{name:"string"}},disabled:{defaultValue:{value:"false"},description:"Whether the dropdown is disabled",name:"disabled",required:!1,type:{name:"boolean"}},className:{defaultValue:null,description:"Additional CSS classes",name:"className",required:!1,type:{name:"string"}}}}}catch{}const E={title:"Migrations/Studio/Dropdown",component:g,parameters:{layout:"centered"},tags:["autodocs"],decorators:[s=>l.jsx("div",{style:{width:240},children:l.jsx(s,{})})]},p={args:{options:[{value:"claude-opus",label:"Claude Opus 4.6"},{value:"claude-sonnet",label:"Claude Sonnet 4.5"},{value:"claude-haiku",label:"Claude Haiku 4.5"}],onChange:()=>{},placeholder:"Select model..."}},m={args:{value:"claude-opus",options:[{value:"claude-opus",label:"Claude Opus 4.6"},{value:"claude-sonnet",label:"Claude Sonnet 4.5"},{value:"claude-haiku",label:"Claude Haiku 4.5"}],onChange:()=>{}}},f={args:{value:"claude-opus",options:[{value:"claude-opus",label:"Claude Opus 4.6"}],onChange:()=>{},disabled:!0}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    options: [{
      value: "claude-opus",
      label: "Claude Opus 4.6"
    }, {
      value: "claude-sonnet",
      label: "Claude Sonnet 4.5"
    }, {
      value: "claude-haiku",
      label: "Claude Haiku 4.5"
    }],
    onChange: () => {},
    placeholder: "Select model..."
  }
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    value: "claude-opus",
    options: [{
      value: "claude-opus",
      label: "Claude Opus 4.6"
    }, {
      value: "claude-sonnet",
      label: "Claude Sonnet 4.5"
    }, {
      value: "claude-haiku",
      label: "Claude Haiku 4.5"
    }],
    onChange: () => {}
  }
}`,...m.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    value: "claude-opus",
    options: [{
      value: "claude-opus",
      label: "Claude Opus 4.6"
    }],
    onChange: () => {},
    disabled: true
  }
}`,...f.parameters?.docs?.source}}};const q=["Default","WithSelection","Disabled"];export{p as Default,f as Disabled,m as WithSelection,q as __namedExportsOrder,E as default};
