import{r as f,j as a}from"./iframe-CzJrb7DT.js";import{c as i}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function d({options:r=[],selected:t=[],onChange:u,placeholder:m="Select...",className:p}){const[s,x]=f.useState(!1),c=e=>{const o=t.includes(e)?t.filter(l=>l!==e):[...t,e];u?.(o)};return a.jsxs("div",{className:i("relative",p),children:[a.jsxs("button",{onClick:()=>x(!s),className:"w-full flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md bg-card text-left",children:[t.length>0?a.jsx("div",{className:"flex flex-wrap gap-1 flex-1",children:t.map(e=>{const o=r.find(l=>l.value===e);return a.jsxs("span",{className:"inline-flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded text-xs text-foreground",children:[o?.label??e,a.jsx("button",{onClick:l=>{l.stopPropagation(),c(e)},className:"text-muted-foreground hover:text-foreground",children:"×"})]},e)})}):a.jsx("span",{className:"text-muted-foreground flex-1",children:m}),a.jsx("span",{className:"text-muted-foreground text-xs shrink-0",children:s?"▲":"▼"})]}),s&&a.jsx("div",{className:"absolute z-50 mt-1 w-full bg-card border border-border rounded-md shadow-lg max-h-48 overflow-y-auto",children:r.map(e=>a.jsxs("button",{onClick:()=>c(e.value),className:"w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted transition-colors text-left",children:[a.jsx("span",{className:i("h-4 w-4 rounded border flex items-center justify-center text-[10px]",t.includes(e.value)?"border-primary bg-primary text-primary-foreground":"border-border"),children:t.includes(e.value)&&"✓"}),e.label]},e.value))})]})}try{d.displayName="MultiSelect",d.__docgenInfo={description:"MultiSelect - Migrated from",displayName:"MultiSelect",props:{options:{defaultValue:{value:"[]"},description:"",name:"options",required:!1,type:{name:"MultiSelectOption[]"}},selected:{defaultValue:{value:"[]"},description:"",name:"selected",required:!1,type:{name:"string[]"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!1,type:{name:"((selected: string[]) => void)"}},placeholder:{defaultValue:{value:"Select..."},description:"",name:"placeholder",required:!1,type:{name:"string"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const v={title:"Migrations/WebUI/MultiSelect",component:d,tags:["autodocs"],parameters:{layout:"padded"},decorators:[r=>a.jsx("div",{style:{minHeight:260,padding:16},children:a.jsx(r,{})})]},n={args:{options:[{value:"react",label:"React"},{value:"vue",label:"Vue"},{value:"svelte",label:"Svelte"},{value:"angular",label:"Angular"}],selected:["react"],placeholder:"Select frameworks...",onChange:()=>{}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    options: [{
      value: "react",
      label: "React"
    }, {
      value: "vue",
      label: "Vue"
    }, {
      value: "svelte",
      label: "Svelte"
    }, {
      value: "angular",
      label: "Angular"
    }],
    selected: ["react"],
    placeholder: "Select frameworks...",
    onChange: () => {}
  }
}`,...n.parameters?.docs?.source}}};const y=["Default"];export{n as Default,y as __namedExportsOrder,v as default};
