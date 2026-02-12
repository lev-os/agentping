import{j as t}from"./iframe-CzJrb7DT.js";import{c as i}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function a({assets:s=[],onSelect:d,selected:n,className:l}){return t.jsx("div",{className:i("grid grid-cols-3 gap-2",l),children:s.map(e=>t.jsxs("button",{onClick:()=>d?.(e),"aria-label":`Select ${e.name}`,"aria-pressed":n===e.id,className:i("flex flex-col items-center gap-1 p-3 rounded-md border transition-colors text-center",n===e.id?"border-primary bg-primary/10":"border-border bg-card hover:bg-muted"),children:[t.jsx("div",{className:"h-10 w-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground",children:e.preview?t.jsx("img",{src:e.preview,alt:e.name,className:"h-full w-full object-cover rounded"}):e.type.toUpperCase().slice(0,3)}),t.jsx("span",{className:"text-xs text-foreground truncate w-full",children:e.name}),t.jsx("span",{className:"text-[10px] text-muted-foreground",children:e.size})]},e.id))})}try{a.displayName="FileAssetPicker",a.__docgenInfo={description:"FileAssetPicker - Migrated from",displayName:"FileAssetPicker",props:{assets:{defaultValue:{value:"[]"},description:"",name:"assets",required:!1,type:{name:"FileAsset[]"}},onSelect:{defaultValue:null,description:"",name:"onSelect",required:!1,type:{name:"((asset: FileAsset) => void)"}},selected:{defaultValue:null,description:"",name:"selected",required:!1,type:{name:"string"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const m={title:"Migrations/WebUI/FileAssetPicker",component:a,tags:["autodocs"]},r={args:{assets:[{id:"1",name:"photo.png",type:"image/png",size:"2.4 MB"},{id:"2",name:"report.pdf",type:"application/pdf",size:"1.1 MB"},{id:"3",name:"data.csv",type:"text/csv",size:"340 KB"}],selected:"1"}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    assets: [{
      id: "1",
      name: "photo.png",
      type: "image/png",
      size: "2.4 MB"
    }, {
      id: "2",
      name: "report.pdf",
      type: "application/pdf",
      size: "1.1 MB"
    }, {
      id: "3",
      name: "data.csv",
      type: "text/csv",
      size: "340 KB"
    }],
    selected: "1"
  }
}`,...r.parameters?.docs?.source}}};const u=["Default"];export{r as Default,u as __namedExportsOrder,m as default};
