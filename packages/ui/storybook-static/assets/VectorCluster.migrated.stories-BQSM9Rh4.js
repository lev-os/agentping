import{r as N,j as s}from"./iframe-CzJrb7DT.js";import{c as V}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";const h=["#06b6d4","#f59e0b","#10b981","#ef4444","#8b5cf6","#ec4899","#14b8a6","#f97316"];function u({points:t=[],width:c=400,height:o=300,className:b}){const[i,d]=N.useState(null),x=t.length?Math.min(...t.map(e=>e.x)):0,g=t.length?Math.max(...t.map(e=>e.x)):1,f=t.length?Math.min(...t.map(e=>e.y)):0,m=t.length?Math.max(...t.map(e=>e.y)):1,n=24,M=g-x||1,_=m-f||1,v=e=>({cx:n+(e.x-x)/M*(c-2*n),cy:n+(m-e.y)/_*(o-2*n)});return s.jsx("div",{className:V("border border-cyan-500/20 bg-black/60 rounded-lg p-2 font-mono inline-block",b),children:t.length===0?s.jsx("div",{className:"text-xs text-cyan-500/30 p-4",style:{width:c,height:o},children:"No data points"}):s.jsx("svg",{width:c,height:o,children:t.map((e,a)=>{const{cx:p,cy:y}=v(e),j=h[e.cluster%h.length];return s.jsxs("g",{children:[s.jsx("circle",{cx:p,cy:y,r:i===a?6:4,fill:j,opacity:.8,onMouseEnter:()=>d(a),onMouseLeave:()=>d(null),className:"transition-all cursor-pointer"}),i===a&&e.label&&s.jsx("text",{x:p,y:y-10,textAnchor:"middle",fill:"#cffafe",fontSize:10,children:e.label})]},a)})})})}try{u.displayName="VectorCluster",u.__docgenInfo={description:"",displayName:"VectorCluster",props:{points:{defaultValue:{value:"[]"},description:"",name:"points",required:!1,type:{name:"ClusterPoint[]"}},width:{defaultValue:{value:"400"},description:"",name:"width",required:!1,type:{name:"number"}},height:{defaultValue:{value:"300"},description:"",name:"height",required:!1,type:{name:"number"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const w={title:"Migrations/WebUI/Root/VectorCluster",component:u,parameters:{layout:"centered"},tags:["autodocs"]},l={args:{points:[{x:1,y:2,label:"auth.ts",cluster:0},{x:1.5,y:2.3,label:"login.ts",cluster:0},{x:5,y:6,label:"dashboard.tsx",cluster:1},{x:5.5,y:5.8,label:"chart.tsx",cluster:1},{x:5.2,y:6.5,label:"table.tsx",cluster:1},{x:9,y:1,label:"test.spec.ts",cluster:2},{x:9.3,y:1.5,label:"fixture.ts",cluster:2},{x:3,y:8,label:"utils.ts",cluster:3}],width:400,height:300}},r={args:{points:[],width:400,height:200}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    points: [{
      x: 1,
      y: 2,
      label: "auth.ts",
      cluster: 0
    }, {
      x: 1.5,
      y: 2.3,
      label: "login.ts",
      cluster: 0
    }, {
      x: 5,
      y: 6,
      label: "dashboard.tsx",
      cluster: 1
    }, {
      x: 5.5,
      y: 5.8,
      label: "chart.tsx",
      cluster: 1
    }, {
      x: 5.2,
      y: 6.5,
      label: "table.tsx",
      cluster: 1
    }, {
      x: 9,
      y: 1,
      label: "test.spec.ts",
      cluster: 2
    }, {
      x: 9.3,
      y: 1.5,
      label: "fixture.ts",
      cluster: 2
    }, {
      x: 3,
      y: 8,
      label: "utils.ts",
      cluster: 3
    }],
    width: 400,
    height: 300
  }
}`,...l.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    points: [],
    width: 400,
    height: 200
  }
}`,...r.parameters?.docs?.source}}};const R=["Default","Empty"];export{l as Default,r as Empty,R as __namedExportsOrder,w as default};
