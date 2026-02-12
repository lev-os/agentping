import{r as p,j as l}from"./iframe-CzJrb7DT.js";import{c as m}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";const o=p.forwardRef(({items:t,selectedId:x,onSelect:f,className:b,...v},g)=>{const[d,c]=p.useState(-1),u=p.useRef([]),y=e=>{const n=t.filter(r=>!r.disabled);if(n.length===0)return;const s=n.findIndex((r,a)=>t.indexOf(n[a])===d);switch(e.key){case"ArrowDown":{e.preventDefault();const r=(s+1)%n.length,a=t.indexOf(n[r]);c(a),u.current[a]?.focus();break}case"ArrowUp":{e.preventDefault();const r=s<=0?n.length-1:s-1,a=t.indexOf(n[r]);c(a),u.current[a]?.focus();break}case"Enter":case" ":e.preventDefault(),d>=0&&!t[d].disabled&&f(t[d].id);break}};return l.jsx("ul",{ref:g,role:"menu",className:m("flex flex-col py-1",b),onKeyDown:y,...v,children:t.map((e,n)=>{const s=e.id===x;return l.jsxs("li",{ref:r=>{u.current[n]=r},role:"menuitem",tabIndex:e.disabled?-1:0,"aria-disabled":e.disabled,"aria-current":s?"true":void 0,onClick:()=>!e.disabled&&f(e.id),onFocus:()=>c(n),className:m("flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors","focus:outline-none focus:bg-muted/50",s&&"bg-primary/10 text-primary",!s&&"hover:bg-muted/50",e.disabled&&"opacity-50 cursor-not-allowed",e.destructive&&"text-destructive hover:bg-destructive/10"),children:[e.icon&&l.jsx("span",{className:"flex-shrink-0 w-4 h-4",children:e.icon}),l.jsxs("div",{className:"flex-1 min-w-0",children:[l.jsx("div",{className:"text-sm font-medium truncate",children:e.label}),e.description&&l.jsx("div",{className:"text-xs text-muted-foreground truncate",children:e.description})]})]},e.id)})})});o.displayName="MenuList";try{o.displayName="MenuList",o.__docgenInfo={description:"",displayName:"MenuList",props:{items:{defaultValue:null,description:"Menu items to display",name:"items",required:!0,type:{name:"MenuItem[]"}},selectedId:{defaultValue:null,description:"Currently selected item ID",name:"selectedId",required:!1,type:{name:"string"}},onSelect:{defaultValue:null,description:"Callback when item is selected",name:"onSelect",required:!0,type:{name:"(itemId: string) => void"}},className:{defaultValue:null,description:"Custom class for container",name:"className",required:!1,type:{name:"string"}},"aria-label":{defaultValue:null,description:"Accessible label for the menu",name:"aria-label",required:!1,type:{name:"string"}}}}}catch{}const w={title:"Migrations/WebUI/Sofia/MenuList",component:o,tags:["autodocs"]},i={args:{items:[{id:"open",label:"Open",description:"Open a file"},{id:"save",label:"Save"},{id:"export",label:"Export as PDF"},{id:"delete",label:"Delete",destructive:!0}],onSelect:()=>{}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      id: "open",
      label: "Open",
      description: "Open a file"
    }, {
      id: "save",
      label: "Save"
    }, {
      id: "export",
      label: "Export as PDF"
    }, {
      id: "delete",
      label: "Delete",
      destructive: true
    }],
    onSelect: () => {}
  }
}`,...i.parameters?.docs?.source}}};const N=["Default"];export{i as Default,N as __namedExportsOrder,w as default};
