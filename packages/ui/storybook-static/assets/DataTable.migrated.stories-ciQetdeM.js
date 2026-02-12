import{r as m,j as t}from"./iframe-rZoXeK5l.js";import{c as u}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function i({columns:o,data:d,keyField:c,onRowClick:p,className:h}){const[r,y]=m.useState(null),[n,b]=m.useState(!0),g=m.useMemo(()=>r?[...d].sort((e,l)=>{const a=String(e[r]??""),f=String(l[r]??"");return n?a.localeCompare(f):f.localeCompare(a)}):d,[d,r,n]),x=e=>{r===e?b(!n):(y(e),b(!0))};return t.jsx("div",{className:u("border border-border rounded-md overflow-auto",h),children:t.jsxs("table",{className:"w-full text-sm",children:[t.jsx("thead",{children:t.jsx("tr",{className:"border-b border-border bg-muted/50",children:o.map(e=>t.jsxs("th",{className:u("px-3 py-2 text-left font-medium text-muted-foreground",e.sortable&&"cursor-pointer hover:text-foreground"),style:e.width?{width:e.width}:void 0,onClick:()=>e.sortable&&x(e.key),children:[e.header,r===e.key&&t.jsx("span",{className:"ml-1",children:n?"▲":"▼"})]},e.key))})}),t.jsx("tbody",{children:g.map((e,l)=>t.jsx("tr",{className:u("border-b border-border last:border-0 hover:bg-muted/30",p&&"cursor-pointer"),onClick:()=>p?.(e),children:o.map(a=>t.jsx("td",{className:"px-3 py-2 text-foreground",children:a.render?a.render(e[a.key],e):String(e[a.key]??"")},a.key))},c?String(e[c]):l))})]})})}try{i.displayName="DataTable",i.__docgenInfo={description:"DataTable - Migrated from",displayName:"DataTable",props:{columns:{defaultValue:null,description:"",name:"columns",required:!0,type:{name:"DataTableColumn<T>[]"}},data:{defaultValue:null,description:"",name:"data",required:!0,type:{name:"T[]"}},keyField:{defaultValue:null,description:"",name:"keyField",required:!1,type:{name:"string"}},onRowClick:{defaultValue:null,description:"",name:"onRowClick",required:!1,type:{name:"((row: T) => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const j={title:"Migrations/WebUI/DataTable",component:i,tags:["autodocs"]},s={args:{columns:[{key:"name",header:"Name",sortable:!0},{key:"status",header:"Status"},{key:"uptime",header:"Uptime",sortable:!0}],data:[{name:"agent-01",status:"online",uptime:"4h 23m"},{name:"agent-02",status:"offline",uptime:"0m"},{name:"agent-03",status:"online",uptime:"12h 5m"}]}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    columns: [{
      key: "name",
      header: "Name",
      sortable: true
    }, {
      key: "status",
      header: "Status"
    }, {
      key: "uptime",
      header: "Uptime",
      sortable: true
    }],
    data: [{
      name: "agent-01",
      status: "online",
      uptime: "4h 23m"
    }, {
      name: "agent-02",
      status: "offline",
      uptime: "0m"
    }, {
      name: "agent-03",
      status: "online",
      uptime: "12h 5m"
    }]
  }
}`,...s.parameters?.docs?.source}}};const _=["Default"];export{s as Default,_ as __namedExportsOrder,j as default};
