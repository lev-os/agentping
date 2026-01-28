import{j as s}from"./jsx-runtime-BjG_zV1W.js";import{T as U,B as G}from"./Table-eno7KEco.js";import{C as g}from"./clock-BhVhGfhk.js";import{C as O}from"./circle-x-BZUptzyg.js";import{C as V}from"./circle-check-big-DdlYkAcn.js";import"./index-BNURykns.js";import"./createLucideIcon-e4Yg_r7P.js";import"./chevron-up-C3WeIuvy.js";import"./chevron-down-Dx1Dkz5T.js";const ee={title:"UI/Table",component:U,parameters:{layout:"padded"},tags:["autodocs"],argTypes:{loading:{control:"boolean",description:"Show loading state"},selectable:{control:"boolean",description:"Enable row selection"},pageSize:{control:"number",description:"Number of rows per page"}}},p=[{id:1,name:"Agent Alpha",status:"active",tasks:12,uptime:"99.9%",lastSeen:"2 min ago"},{id:2,name:"Agent Beta",status:"idle",tasks:3,uptime:"87.2%",lastSeen:"15 min ago"},{id:3,name:"Agent Gamma",status:"error",tasks:0,uptime:"45.1%",lastSeen:"1 hour ago"},{id:4,name:"Agent Delta",status:"active",tasks:8,uptime:"98.5%",lastSeen:"1 min ago"},{id:5,name:"Agent Epsilon",status:"pending",tasks:5,uptime:"92.3%",lastSeen:"30 min ago"},{id:6,name:"Agent Zeta",status:"active",tasks:15,uptime:"99.1%",lastSeen:"5 min ago"},{id:7,name:"Agent Eta",status:"idle",tasks:1,uptime:"76.8%",lastSeen:"2 hours ago"},{id:8,name:"Agent Theta",status:"active",tasks:10,uptime:"97.4%",lastSeen:"3 min ago"}],t=[{key:"id",label:"ID",sortable:!0},{key:"name",label:"Agent Name",sortable:!0},{key:"status",label:"Status",sortable:!0,render:e=>{const a={active:{icon:s.jsx(V,{size:12}),variant:"success"},idle:{icon:s.jsx(g,{size:12}),variant:"warning"},error:{icon:s.jsx(O,{size:12}),variant:"error"},pending:{icon:s.jsx(g,{size:12}),variant:"default"}},P=a[e]||a.pending;return s.jsx(G,{variant:P.variant,children:e})}},{key:"tasks",label:"Active Tasks",sortable:!0},{key:"uptime",label:"Uptime",sortable:!0},{key:"lastSeen",label:"Last Seen",sortable:!1}],r={args:{columns:t,data:p,pageSize:5}},n={args:{columns:t,data:[],emptyMessage:"No agents found"}},o={args:{columns:t,data:[],loading:!0}},i={args:{columns:t,data:p,selectable:!0,pageSize:5,onSelectionChange:e=>{console.log("Selected rows:",e)}}},l={args:{columns:t,data:p,pageSize:5,onRowClick:e=>{console.log("Clicked row:",e),alert(`Clicked: ${e.name}`)}}},m={args:{columns:t,data:Array.from({length:50},(e,a)=>({id:a+1,name:`Agent ${String.fromCharCode(65+a%26)}${Math.floor(a/26)+1}`,status:["active","idle","error","pending"][a%4],tasks:Math.floor(Math.random()*20),uptime:`${(Math.random()*100).toFixed(1)}%`,lastSeen:`${Math.floor(Math.random()*60)} min ago`})),pageSize:10,selectable:!0}},R=[{key:"id",label:"ID",sortable:!0},{key:"name",label:"Name",sortable:!0},{key:"value",label:"Value",sortable:!0}],F=[{id:1,name:"Item A",value:100},{id:2,name:"Item B",value:250},{id:3,name:"Item C",value:180}],c={args:{columns:R,data:F,pageSize:10}},d={args:{columns:R,data:F,pageSize:100}};var u,S,b;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    columns,
    data: sampleData,
    pageSize: 5
  }
}`,...(b=(S=r.parameters)==null?void 0:S.docs)==null?void 0:b.source}}};var k,h,C;n.parameters={...n.parameters,docs:{...(k=n.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    columns,
    data: [],
    emptyMessage: 'No agents found'
  }
}`,...(C=(h=n.parameters)==null?void 0:h.docs)==null?void 0:C.source}}};var f,v,z;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    columns,
    data: [],
    loading: true
  }
}`,...(z=(v=o.parameters)==null?void 0:v.docs)==null?void 0:z.source}}};var y,A,M;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    columns,
    data: sampleData,
    selectable: true,
    pageSize: 5,
    onSelectionChange: selected => {
      console.log('Selected rows:', selected);
    }
  }
}`,...(M=(A=i.parameters)==null?void 0:A.docs)==null?void 0:M.source}}};var D,w,x;l.parameters={...l.parameters,docs:{...(D=l.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    columns,
    data: sampleData,
    pageSize: 5,
    onRowClick: row => {
      console.log('Clicked row:', row);
      alert(\`Clicked: \${row.name}\`);
    }
  }
}`,...(x=(w=l.parameters)==null?void 0:w.docs)==null?void 0:x.source}}};var $,T,j;m.parameters={...m.parameters,docs:{...($=m.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    columns,
    data: Array.from({
      length: 50
    }, (_, i) => ({
      id: i + 1,
      name: \`Agent \${String.fromCharCode(65 + i % 26)}\${Math.floor(i / 26) + 1}\`,
      status: ['active', 'idle', 'error', 'pending'][i % 4],
      tasks: Math.floor(Math.random() * 20),
      uptime: \`\${(Math.random() * 100).toFixed(1)}%\`,
      lastSeen: \`\${Math.floor(Math.random() * 60)} min ago\`
    })),
    pageSize: 10,
    selectable: true
  }
}`,...(j=(T=m.parameters)==null?void 0:T.docs)==null?void 0:j.source}}};var E,N,I;c.parameters={...c.parameters,docs:{...(E=c.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    columns: simpleColumns,
    data: simpleData,
    pageSize: 10
  }
}`,...(I=(N=c.parameters)==null?void 0:N.docs)==null?void 0:I.source}}};var L,B,_;d.parameters={...d.parameters,docs:{...(L=d.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    columns: simpleColumns,
    data: simpleData,
    pageSize: 100 // Large page size to avoid pagination
  }
}`,...(_=(B=d.parameters)==null?void 0:B.docs)==null?void 0:_.source}}};const ae=["Default","Empty","Loading","Selectable","Clickable","LargeDataset","SimpleTable","NoPagination"];export{l as Clickable,r as Default,n as Empty,m as LargeDataset,o as Loading,d as NoPagination,i as Selectable,c as SimpleTable,ae as __namedExportsOrder,ee as default};
