import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{r as h,R as be}from"./index-BNURykns.js";import{c as he}from"./createLucideIcon-e4Yg_r7P.js";import{C as fe,B as Se}from"./Badge-COI3DMhx.js";import{C as ye}from"./chevron-down-Dx1Dkz5T.js";import{C as q}from"./clock-BhVhGfhk.js";import{C as ke}from"./circle-x-BZUptzyg.js";import{C as ve}from"./circle-check-big-DdlYkAcn.js";/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xe=[["path",{d:"m7 15 5 5 5-5",key:"1hf1tw"}],["path",{d:"m7 9 5-5 5 5",key:"sgt6xg"}]],je=he("chevrons-up-down",xe);function ne({columns:n,data:r,loading:N=!1,emptyMessage:ie="No data available",onRowClick:p,selectable:D=!1,onSelectionChange:o,pageSize:w=10,className:C=""}){const[c,ce]=h.useState(null),[u,M]=h.useState("asc"),[m,z]=h.useState(new Set),[l,$]=h.useState(0),de=a=>{c===a?M(u==="asc"?"desc":"asc"):(ce(a),M("asc"))},me=a=>{const s=new Set(m);if(s.has(a)?s.delete(a):s.add(a),z(s),o){const t=Array.from(s).map(b=>i[b]);o(t)}},pe=()=>{if(m.size===i.length)z(new Set),o==null||o([]);else{const a=new Set(i.map((s,t)=>t));z(a),o==null||o(i)}},i=be.useMemo(()=>c?[...r].sort((a,s)=>{const t=a[c],b=s[c];if(t===b)return 0;const I=t<b?-1:1;return u==="asc"?I:-I}):r,[r,c,u]),g=Math.ceil(i.length/w),ue=i.slice(l*w,(l+1)*w),ge=a=>c!==a?e.jsx(je,{size:14}):u==="asc"?e.jsx(fe,{size:14}):e.jsx(ye,{size:14});return N?e.jsx("div",{className:`table-container loading ${C}`,children:e.jsxs("div",{className:"table-loading",children:[e.jsx("div",{className:"spinner"}),e.jsx("span",{children:"Loading data..."})]})}):r.length===0?e.jsx("div",{className:`table-container empty ${C}`,children:e.jsx("div",{className:"table-empty",children:e.jsx("span",{children:ie})})}):e.jsxs("div",{className:`table-container ${C}`,children:[e.jsx("div",{className:"table-wrapper",children:e.jsxs("table",{className:"table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[D&&e.jsx("th",{className:"table-cell-checkbox",children:e.jsx("input",{type:"checkbox",checked:m.size===i.length,onChange:pe,"aria-label":"Select all rows"})}),n.map(a=>e.jsx("th",{className:a.sortable?"sortable":"",onClick:()=>a.sortable&&de(a.key),children:e.jsxs("div",{className:"table-header-content",children:[e.jsx("span",{children:a.label}),a.sortable&&e.jsx("span",{className:"sort-icon",children:ge(a.key)})]})},a.key))]})}),e.jsx("tbody",{children:ue.map((a,s)=>e.jsxs("tr",{className:`${p?"clickable":""} ${m.has(s)?"selected":""}`,onClick:()=>p==null?void 0:p(a),children:[D&&e.jsx("td",{className:"table-cell-checkbox",children:e.jsx("input",{type:"checkbox",checked:m.has(s),onChange:t=>{t.stopPropagation(),me(s)},"aria-label":`Select row ${s+1}`})}),n.map(t=>e.jsx("td",{children:t.render?t.render(a[t.key],a):a[t.key]},t.key))]},s))})]})}),g>1&&e.jsxs("div",{className:"table-pagination",children:[e.jsx("button",{onClick:()=>$(Math.max(0,l-1)),disabled:l===0,className:"pagination-button",children:"Previous"}),e.jsxs("span",{className:"pagination-info",children:["Page ",l+1," of ",g]}),e.jsx("button",{onClick:()=>$(Math.min(g-1,l+1)),disabled:l===g-1,className:"pagination-button",children:"Next"})]})]})}ne.__docgenInfo={description:"",methods:[],displayName:"Table",props:{columns:{required:!0,tsType:{name:"Array",elements:[{name:"TableColumn",elements:[{name:"T"}],raw:"TableColumn<T>"}],raw:"TableColumn<T>[]"},description:""},data:{required:!0,tsType:{name:"Array",elements:[{name:"T"}],raw:"T[]"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},emptyMessage:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'No data available'",computed:!1}},onRowClick:{required:!1,tsType:{name:"signature",type:"function",raw:"(row: T) => void",signature:{arguments:[{type:{name:"T"},name:"row"}],return:{name:"void"}}},description:""},selectable:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onSelectionChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(selected: T[]) => void",signature:{arguments:[{type:{name:"Array",elements:[{name:"T"}],raw:"T[]"},name:"selected"}],return:{name:"void"}}},description:""},pageSize:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"10",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}}}};const $e={title:"UI/Table",component:ne,parameters:{layout:"padded"},tags:["autodocs"],argTypes:{loading:{control:"boolean",description:"Show loading state"},selectable:{control:"boolean",description:"Enable row selection"},pageSize:{control:"number",description:"Number of rows per page"}}},A=[{id:1,name:"Agent Alpha",status:"active",tasks:12,uptime:"99.9%",lastSeen:"2 min ago"},{id:2,name:"Agent Beta",status:"idle",tasks:3,uptime:"87.2%",lastSeen:"15 min ago"},{id:3,name:"Agent Gamma",status:"error",tasks:0,uptime:"45.1%",lastSeen:"1 hour ago"},{id:4,name:"Agent Delta",status:"active",tasks:8,uptime:"98.5%",lastSeen:"1 min ago"},{id:5,name:"Agent Epsilon",status:"pending",tasks:5,uptime:"92.3%",lastSeen:"30 min ago"},{id:6,name:"Agent Zeta",status:"active",tasks:15,uptime:"99.1%",lastSeen:"5 min ago"},{id:7,name:"Agent Eta",status:"idle",tasks:1,uptime:"76.8%",lastSeen:"2 hours ago"},{id:8,name:"Agent Theta",status:"active",tasks:10,uptime:"97.4%",lastSeen:"3 min ago"}],d=[{key:"id",label:"ID",sortable:!0},{key:"name",label:"Agent Name",sortable:!0},{key:"status",label:"Status",sortable:!0,render:n=>{const r={active:{icon:e.jsx(ve,{size:12}),variant:"success"},idle:{icon:e.jsx(q,{size:12}),variant:"warning"},error:{icon:e.jsx(ke,{size:12}),variant:"error"},pending:{icon:e.jsx(q,{size:12}),variant:"default"}},N=r[n]||r.pending;return e.jsx(Se,{variant:N.variant,children:n})}},{key:"tasks",label:"Active Tasks",sortable:!0},{key:"uptime",label:"Uptime",sortable:!0},{key:"lastSeen",label:"Last Seen",sortable:!1}],f={args:{columns:d,data:A,pageSize:5}},S={args:{columns:d,data:[],emptyMessage:"No agents found"}},y={args:{columns:d,data:[],loading:!0}},k={args:{columns:d,data:A,selectable:!0,pageSize:5,onSelectionChange:n=>{console.log("Selected rows:",n)}}},v={args:{columns:d,data:A,pageSize:5,onRowClick:n=>{console.log("Clicked row:",n),alert(`Clicked: ${n.name}`)}}},x={args:{columns:d,data:Array.from({length:50},(n,r)=>({id:r+1,name:`Agent ${String.fromCharCode(65+r%26)}${Math.floor(r/26)+1}`,status:["active","idle","error","pending"][r%4],tasks:Math.floor(Math.random()*20),uptime:`${(Math.random()*100).toFixed(1)}%`,lastSeen:`${Math.floor(Math.random()*60)} min ago`})),pageSize:10,selectable:!0}},oe=[{key:"id",label:"ID",sortable:!0},{key:"name",label:"Name",sortable:!0},{key:"value",label:"Value",sortable:!0}],le=[{id:1,name:"Item A",value:100},{id:2,name:"Item B",value:250},{id:3,name:"Item C",value:180}],j={args:{columns:oe,data:le,pageSize:10}},T={args:{columns:oe,data:le,pageSize:100}};var _,E,L;f.parameters={...f.parameters,docs:{...(_=f.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    columns,
    data: sampleData,
    pageSize: 5
  }
}`,...(L=(E=f.parameters)==null?void 0:E.docs)==null?void 0:L.source}}};var P,V,B;S.parameters={...S.parameters,docs:{...(P=S.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    columns,
    data: [],
    emptyMessage: 'No agents found'
  }
}`,...(B=(V=S.parameters)==null?void 0:V.docs)==null?void 0:B.source}}};var R,U,F;y.parameters={...y.parameters,docs:{...(R=y.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    columns,
    data: [],
    loading: true
  }
}`,...(F=(U=y.parameters)==null?void 0:U.docs)==null?void 0:F.source}}};var G,O,X;k.parameters={...k.parameters,docs:{...(G=k.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    columns,
    data: sampleData,
    selectable: true,
    pageSize: 5,
    onSelectionChange: selected => {
      console.log('Selected rows:', selected);
    }
  }
}`,...(X=(O=k.parameters)==null?void 0:O.docs)==null?void 0:X.source}}};var Z,H,J;v.parameters={...v.parameters,docs:{...(Z=v.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    columns,
    data: sampleData,
    pageSize: 5,
    onRowClick: row => {
      console.log('Clicked row:', row);
      alert(\`Clicked: \${row.name}\`);
    }
  }
}`,...(J=(H=v.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};var Q,W,Y;x.parameters={...x.parameters,docs:{...(Q=x.parameters)==null?void 0:Q.docs,source:{originalSource:`{
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
}`,...(Y=(W=x.parameters)==null?void 0:W.docs)==null?void 0:Y.source}}};var K,ee,ae;j.parameters={...j.parameters,docs:{...(K=j.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    columns: simpleColumns,
    data: simpleData,
    pageSize: 10
  }
}`,...(ae=(ee=j.parameters)==null?void 0:ee.docs)==null?void 0:ae.source}}};var se,te,re;T.parameters={...T.parameters,docs:{...(se=T.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    columns: simpleColumns,
    data: simpleData,
    pageSize: 100 // Large page size to avoid pagination
  }
}`,...(re=(te=T.parameters)==null?void 0:te.docs)==null?void 0:re.source}}};const Ie=["Default","Empty","Loading","Selectable","Clickable","LargeDataset","SimpleTable","NoPagination"];export{v as Clickable,f as Default,S as Empty,x as LargeDataset,y as Loading,T as NoPagination,k as Selectable,j as SimpleTable,Ie as __namedExportsOrder,$e as default};
