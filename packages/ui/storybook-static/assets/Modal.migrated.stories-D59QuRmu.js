import{r as s,j as e}from"./iframe-CzJrb7DT.js";import{r as w}from"./index-WHAuAub8.js";import{c as h}from"./utils-CDN07tui.js";import{X as z}from"./x-CMkHq2ts.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Dwoj57sw.js";import"./createLucideIcon-qiJ1pPWj.js";const j={sm:"max-w-sm",md:"max-w-lg",lg:"max-w-2xl",xl:"max-w-4xl"};function u({isOpen:n,onClose:o,title:c,children:b,footer:p,size:y="md",className:g}){const r=s.useRef(null),m=s.useRef(null),d=s.useCallback(t=>{if(t.key==="Escape"&&o(),t.key==="Tab"&&r.current){const a=r.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');if(a.length===0)return;const f=a[0],x=a[a.length-1];t.shiftKey&&document.activeElement===f?(t.preventDefault(),x.focus()):!t.shiftKey&&document.activeElement===x&&(t.preventDefault(),f.focus())}},[o]);if(s.useEffect(()=>(n&&(m.current=document.activeElement,document.addEventListener("keydown",d),document.body.style.overflow="hidden",requestAnimationFrame(()=>{r.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')?.focus()})),()=>{document.removeEventListener("keydown",d),document.body.style.overflow="",m.current?.focus()}),[n,d]),!n)return null;const v=e.jsxs("div",{className:"fixed inset-0 z-50 flex items-center justify-center",role:"dialog","aria-modal":"true","aria-label":c,children:[e.jsx("div",{className:"absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200",onClick:o}),e.jsxs("div",{ref:r,className:h("relative w-full mx-4",j[y],"bg-zinc-900 border border-zinc-700/50 rounded-xl","shadow-2xl shadow-black/40","animate-in fade-in zoom-in-95 duration-200",g),children:[c&&e.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-zinc-800",children:[e.jsx("h2",{className:"text-lg font-semibold text-zinc-100",children:c}),e.jsx("button",{onClick:o,className:h("p-1.5 rounded-md","text-zinc-400 hover:text-zinc-200 hover:bg-white/5","transition-colors duration-150","focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50"),"aria-label":"Close modal",children:e.jsx(z,{size:18})})]}),e.jsx("div",{className:"px-6 py-4 max-h-[70vh] overflow-y-auto text-zinc-300",children:b}),p&&e.jsx("div",{className:"flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800",children:p})]})]});return w.createPortal(v,document.body)}try{u.displayName="Modal",u.__docgenInfo={description:"",displayName:"Modal",props:{isOpen:{defaultValue:null,description:"Whether the modal is open",name:"isOpen",required:!0,type:{name:"boolean"}},onClose:{defaultValue:null,description:"Callback when the modal should close",name:"onClose",required:!0,type:{name:"() => void"}},title:{defaultValue:null,description:"Modal title",name:"title",required:!1,type:{name:"string"}},children:{defaultValue:null,description:"Modal body content",name:"children",required:!0,type:{name:"ReactNode"}},footer:{defaultValue:null,description:"Optional footer content",name:"footer",required:!1,type:{name:"ReactNode"}},size:{defaultValue:{value:"md"},description:"Modal size variant",name:"size",required:!1,type:{name:"enum",value:[{value:'"sm"'},{value:'"lg"'},{value:'"md"'},{value:'"xl"'}]}},className:{defaultValue:null,description:"Additional CSS classes for the content area",name:"className",required:!1,type:{name:"string"}}}}}catch{}const _={title:"Migrations/Studio/Modal",component:u,parameters:{layout:"fullscreen"},tags:["autodocs"]},i={args:{isOpen:!0,onClose:()=>{},title:"Confirm Action",children:"Are you sure you want to proceed with this operation?",footer:e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsx("button",{style:{padding:"6px 16px",borderRadius:"8px",background:"#27272a",color:"#a1a1aa",fontSize:"14px"},children:"Cancel"}),e.jsx("button",{style:{padding:"6px 16px",borderRadius:"8px",background:"#0891b2",color:"white",fontSize:"14px"},children:"Confirm"})]})}},l={args:{isOpen:!0,onClose:()=>{},title:"Settings",size:"lg",children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx("p",{children:"This is a larger modal with more content space for complex forms or settings panels."}),e.jsx("p",{children:"It supports scrolling when content exceeds the viewport height."})]})}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => {},
    title: "Confirm Action",
    children: "Are you sure you want to proceed with this operation?",
    footer: <div style={{
      display: "flex",
      gap: "8px"
    }}>
        <button style={{
        padding: "6px 16px",
        borderRadius: "8px",
        background: "#27272a",
        color: "#a1a1aa",
        fontSize: "14px"
      }}>Cancel</button>
        <button style={{
        padding: "6px 16px",
        borderRadius: "8px",
        background: "#0891b2",
        color: "white",
        fontSize: "14px"
      }}>Confirm</button>
      </div>
  }
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => {},
    title: "Settings",
    size: "lg",
    children: <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    }}>
        <p>This is a larger modal with more content space for complex forms or settings panels.</p>
        <p>It supports scrolling when content exceeds the viewport height.</p>
      </div>
  }
}`,...l.parameters?.docs?.source}}};const D=["Default","Large"];export{i as Default,l as Large,D as __namedExportsOrder,_ as default};
