import{r as N,j as r}from"./iframe-rZoXeK5l.js";import{c as E}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";const O=["#06b6d4","#8b5cf6","#f59e0b","#10b981","#ef4444","#ec4899"];function M({nodes:u,links:o,width:_=600,height:j=400,className:W}){const l={top:20,right:20,bottom:20,left:20},g=18,D=_-l.left-l.right,V=j-l.top-l.bottom,I=Math.max(...u.map(e=>e.column),0)+1,q=e=>l.left+e/Math.max(I-1,1)*(D-g),$=N.useMemo(()=>{const e={};for(const t of u)(e[t.column]??=[]).push(t);return e},[u]),x=N.useMemo(()=>{const e={};o.reduce((t,n)=>t+n.value,0);for(const[t,n]of Object.entries($)){const c=Number(t),S=q(c),i=8,h=V-i*(n.length-1),d=n.map(a=>{const p=o.filter(s=>s.target===a.id).reduce((s,w)=>s+w.value,0),f=o.filter(s=>s.source===a.id).reduce((s,w)=>s+w.value,0);return Math.max(p,f,1)}),b=d.reduce((a,p)=>a+p,0);let m=l.top;n.forEach((a,p)=>{const f=Math.max(d[p]/b*h,16);e[a.id]={x:S,y:m,h:f},m+=f+i})}return e},[$,o,D,V]),[k,C]=N.useState(null),A=Math.max(...o.map(e=>e.value),1);return r.jsxs("div",{className:E("border border-cyan-500/20 bg-black/60 rounded-lg p-4",W),children:[r.jsx("div",{className:"text-xs font-mono text-cyan-400 uppercase tracking-wider mb-3",children:"Flow Diagram"}),r.jsxs("svg",{width:_,height:j,className:"overflow-visible",children:[o.map((e,t)=>{const n=x[e.source],c=x[e.target];if(!n||!c)return null;const S=Math.max(e.value/A*24,2),i=n.y+n.h/2,h=c.y+c.h/2,d=n.x+g,b=c.x,m=(d+b)/2,a=k===e.source||k===e.target;return r.jsx("path",{d:`M${d},${i} C${m},${i} ${m},${h} ${b},${h}`,fill:"none",stroke:a?"#06b6d4":"#06b6d440",strokeWidth:S,strokeOpacity:a?.7:.3,className:"transition-all duration-200"},`link-${t}`)}),u.map(e=>{const t=x[e.id];if(!t)return null;const n=O[e.column%O.length];return r.jsxs("g",{onMouseEnter:()=>C(e.id),onMouseLeave:()=>C(null),className:"cursor-pointer",children:[r.jsx("rect",{x:t.x,y:t.y,width:g,height:t.h,rx:3,fill:n,opacity:k===e.id?1:.8,className:"transition-opacity duration-150"}),r.jsx("text",{x:t.x+g+6,y:t.y+t.h/2,dy:"0.35em",fill:"#a5f3fc",fontSize:11,fontFamily:"monospace",children:e.label})]},e.id)})]})]})}try{M.displayName="SankeyDiagram",M.__docgenInfo={description:"SankeyDiagram - Flow diagram with weighted links",displayName:"SankeyDiagram",props:{nodes:{defaultValue:null,description:"",name:"nodes",required:!0,type:{name:"SankeyNode[]"}},links:{defaultValue:null,description:"",name:"links",required:!0,type:{name:"SankeyLink[]"}},width:{defaultValue:{value:"600"},description:"",name:"width",required:!1,type:{name:"number"}},height:{defaultValue:{value:"400"},description:"",name:"height",required:!1,type:{name:"number"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const L={title:"Migrations/WebUI/Root/SankeyDiagram",component:M,parameters:{layout:"centered"},tags:["autodocs"]},v={args:{nodes:[{id:"src1",label:"API Calls",column:0},{id:"src2",label:"Webhooks",column:0},{id:"mid1",label:"Auth",column:1},{id:"mid2",label:"Router",column:1},{id:"dst1",label:"Database",column:2},{id:"dst2",label:"Cache",column:2},{id:"dst3",label:"Queue",column:2}],links:[{source:"src1",target:"mid1",value:40},{source:"src1",target:"mid2",value:60},{source:"src2",target:"mid2",value:30},{source:"mid1",target:"dst1",value:35},{source:"mid1",target:"dst2",value:5},{source:"mid2",target:"dst1",value:20},{source:"mid2",target:"dst2",value:30},{source:"mid2",target:"dst3",value:40}],width:600,height:350}},y={args:{nodes:[{id:"a",label:"Input",column:0},{id:"b",label:"Process",column:1},{id:"c",label:"Output",column:2}],links:[{source:"a",target:"b",value:100},{source:"b",target:"c",value:100}],width:400,height:200}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: [{
      id: "src1",
      label: "API Calls",
      column: 0
    }, {
      id: "src2",
      label: "Webhooks",
      column: 0
    }, {
      id: "mid1",
      label: "Auth",
      column: 1
    }, {
      id: "mid2",
      label: "Router",
      column: 1
    }, {
      id: "dst1",
      label: "Database",
      column: 2
    }, {
      id: "dst2",
      label: "Cache",
      column: 2
    }, {
      id: "dst3",
      label: "Queue",
      column: 2
    }],
    links: [{
      source: "src1",
      target: "mid1",
      value: 40
    }, {
      source: "src1",
      target: "mid2",
      value: 60
    }, {
      source: "src2",
      target: "mid2",
      value: 30
    }, {
      source: "mid1",
      target: "dst1",
      value: 35
    }, {
      source: "mid1",
      target: "dst2",
      value: 5
    }, {
      source: "mid2",
      target: "dst1",
      value: 20
    }, {
      source: "mid2",
      target: "dst2",
      value: 30
    }, {
      source: "mid2",
      target: "dst3",
      value: 40
    }],
    width: 600,
    height: 350
  }
}`,...v.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: [{
      id: "a",
      label: "Input",
      column: 0
    }, {
      id: "b",
      label: "Process",
      column: 1
    }, {
      id: "c",
      label: "Output",
      column: 2
    }],
    links: [{
      source: "a",
      target: "b",
      value: 100
    }, {
      source: "b",
      target: "c",
      value: 100
    }],
    width: 400,
    height: 200
  }
}`,...y.parameters?.docs?.source}}};const H=["Default","SimpleFlow"];export{v as Default,y as SimpleFlow,H as __namedExportsOrder,L as default};
