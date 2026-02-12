import{r as l,j as t}from"./iframe-CzJrb7DT.js";import{c as i}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function a({items:r,className:s}){const[c,d]=l.useState(r[0]?.id??null);return t.jsx("div",{className:i("flex flex-col gap-2 w-full",s),children:r.map(e=>{const n=c===e.id;return t.jsxs("div",{className:i("border border-border rounded-md overflow-hidden bg-card transition-all duration-200",n&&"ring-1 ring-primary/20"),children:[t.jsxs("button",{className:"w-full flex justify-between items-center px-4 py-3 bg-transparent border-none text-foreground text-sm font-medium cursor-pointer text-left hover:bg-muted/50 transition-colors",onClick:()=>d(n?null:e.id),"aria-expanded":n,"aria-controls":`accordion-content-${e.id}`,id:`accordion-btn-${e.id}`,children:[t.jsx("span",{children:e.title}),t.jsx("span",{className:i("text-xs opacity-70 transition-transform duration-300",n&&"rotate-180 text-primary"),"aria-hidden":"true",children:"▼"})]}),n&&t.jsx("div",{className:"border-t border-border px-4 py-3 text-sm text-muted-foreground leading-relaxed",id:`accordion-content-${e.id}`,role:"region","aria-labelledby":`accordion-btn-${e.id}`,children:e.content})]},e.id)})})}try{a.displayName="AccordionList",a.__docgenInfo={description:"AccordionList - Migrated from",displayName:"AccordionList",props:{items:{defaultValue:null,description:"",name:"items",required:!0,type:{name:"AccordionItem[]"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const f={title:"Migrations/WebUI/AccordionList",component:a,tags:["autodocs"]},o={args:{items:[{id:"1",title:"Section One",content:"Content for section one"},{id:"2",title:"Section Two",content:"Content for section two"},{id:"3",title:"Section Three",content:"Content for section three"}]}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: "1",
      title: "Section One",
      content: "Content for section one"
    }, {
      id: "2",
      title: "Section Two",
      content: "Content for section two"
    }, {
      id: "3",
      title: "Section Three",
      content: "Content for section three"
    }]
  }
}`,...o.parameters?.docs?.source}}};const x=["Default"];export{o as Default,x as __namedExportsOrder,f as default};
