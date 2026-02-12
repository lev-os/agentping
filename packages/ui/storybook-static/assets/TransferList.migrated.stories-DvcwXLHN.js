import{r as y,j as a}from"./iframe-CzJrb7DT.js";import{c as j}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function m({available:s=[],selected:r=[],onChange:u,className:g}){const[i,x]=y.useState(new Set),[c,b]=y.useState(new Set),h=()=>{const t=s.filter(e=>i.has(e.id));u?.(s.filter(e=>!i.has(e.id)),[...r,...t]),x(new Set)},v=()=>{const t=r.filter(e=>c.has(e.id));u?.([...s,...t],r.filter(e=>!c.has(e.id))),b(new Set)},N=(t,e,l)=>{const n=new Set(t);n.has(l)?n.delete(l):n.add(l),e(n)},f=(t,e,l,n)=>a.jsxs("div",{className:"flex-1 border border-cyan-500/20 rounded-lg overflow-hidden",children:[a.jsxs("div",{className:"px-3 py-1.5 bg-cyan-500/5 text-[10px] text-cyan-400 uppercase tracking-wider",children:[n," (",t.length,")"]}),a.jsxs("div",{className:"max-h-48 overflow-y-auto divide-y divide-cyan-500/5",children:[t.length===0&&a.jsx("div",{className:"p-3 text-xs text-cyan-500/30",children:"Empty"}),t.map(d=>a.jsxs("label",{className:"flex items-center gap-2 px-3 py-1.5 hover:bg-cyan-500/5 cursor-pointer",children:[a.jsx("input",{type:"checkbox",checked:e.has(d.id),onChange:()=>N(e,l,d.id),className:"accent-cyan-500"}),a.jsx("span",{className:"text-sm text-cyan-100 truncate",children:d.label})]},d.id))]})]});return a.jsxs("div",{className:j("flex items-center gap-2 font-mono bg-black/60 rounded-lg p-3",g),children:[f(s,i,x,"Available"),a.jsxs("div",{className:"flex flex-col gap-1",children:[a.jsx("button",{type:"button",onClick:h,disabled:i.size===0,className:"px-2 py-1 text-xs border border-cyan-500/20 rounded hover:bg-cyan-500/10 text-cyan-400 disabled:opacity-30 transition-colors",children:"→"}),a.jsx("button",{type:"button",onClick:v,disabled:c.size===0,className:"px-2 py-1 text-xs border border-cyan-500/20 rounded hover:bg-cyan-500/10 text-cyan-400 disabled:opacity-30 transition-colors",children:"←"})]}),f(r,c,b,"Selected")]})}try{m.displayName="TransferList",m.__docgenInfo={description:"",displayName:"TransferList",props:{available:{defaultValue:{value:"[]"},description:"",name:"available",required:!1,type:{name:"TransferItem[]"}},selected:{defaultValue:{value:"[]"},description:"",name:"selected",required:!1,type:{name:"TransferItem[]"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!1,type:{name:"((available: TransferItem[], selected: TransferItem[]) => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const w={title:"Migrations/WebUI/Root/TransferList",component:m,parameters:{layout:"centered"},tags:["autodocs"]},o={args:{available:[{id:"1",label:"React"},{id:"2",label:"Vue"},{id:"3",label:"Svelte"},{id:"4",label:"Angular"}],selected:[{id:"5",label:"Next.js"},{id:"6",label:"Remix"}]}},p={args:{available:[{id:"1",label:"Option A"},{id:"2",label:"Option B"}],selected:[]}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    available: [{
      id: "1",
      label: "React"
    }, {
      id: "2",
      label: "Vue"
    }, {
      id: "3",
      label: "Svelte"
    }, {
      id: "4",
      label: "Angular"
    }],
    selected: [{
      id: "5",
      label: "Next.js"
    }, {
      id: "6",
      label: "Remix"
    }]
  }
}`,...o.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    available: [{
      id: "1",
      label: "Option A"
    }, {
      id: "2",
      label: "Option B"
    }],
    selected: []
  }
}`,...p.parameters?.docs?.source}}};const R=["Default","EmptySelected"];export{o as Default,p as EmptySelected,R as __namedExportsOrder,w as default};
