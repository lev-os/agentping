import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{S as Y,A as ee}from"./StatusGrid-CFrOiMWW.js";import{c as h}from"./createLucideIcon-e4Yg_r7P.js";import{D as te}from"./database-C0g2qKQ7.js";import{Z as se}from"./zap--N__6G4c.js";import"./clock-BhVhGfhk.js";import"./triangle-alert-Dqss0hRc.js";import"./circle-x-BZUptzyg.js";import"./circle-check-big-DdlYkAcn.js";import"./index-BNURykns.js";/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=[["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M17 20v2",key:"1rnc9c"}],["path",{d:"M17 2v2",key:"11trls"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M2 17h2",key:"7oei6x"}],["path",{d:"M2 7h2",key:"asdhe0"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"M20 17h2",key:"1fpfkl"}],["path",{d:"M20 7h2",key:"1o8tra"}],["path",{d:"M7 20v2",key:"4gnj0m"}],["path",{d:"M7 2v2",key:"1i4yhu"}],["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"8",y:"8",width:"8",height:"8",rx:"1",key:"z9xiuo"}]],ne=h("cpu",ae);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const re=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]],ie=h("globe",re);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=[["line",{x1:"22",x2:"2",y1:"12",y2:"12",key:"1y58io"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}],["line",{x1:"6",x2:"6.01",y1:"16",y2:"16",key:"sgf278"}],["line",{x1:"10",x2:"10.01",y1:"16",y2:"16",key:"1l4acy"}]],ce=h("hard-drive",oe),ke={title:"UI/StatusGrid",component:Y,parameters:{layout:"padded"},tags:["autodocs"],argTypes:{loading:{control:"boolean",description:"Show loading state"},columns:{control:"select",options:[2,3,4],description:"Number of columns in grid"}}},v=[{id:"1",title:"CPU Usage",status:"success",value:"45%",description:"System CPU utilization is healthy",icon:e.jsx(ne,{size:24}),metadata:{cores:8,threads:16}},{id:"2",title:"Memory",status:"warning",value:"78%",description:"Memory usage approaching threshold",icon:e.jsx(ce,{size:24}),metadata:{used:"6.2 GB",total:"8 GB"}},{id:"3",title:"API Health",status:"error",value:"503",description:"Service unavailable - connection timeout",icon:e.jsx(ie,{size:24}),metadata:{endpoint:"/api/v1",uptime:"87.3%"}},{id:"4",title:"Database",status:"success",value:"12ms",description:"Query response time is optimal",icon:e.jsx(te,{size:24}),metadata:{connections:45,pool:100}},{id:"5",title:"Task Queue",status:"pending",value:"23",description:"Tasks waiting in queue",icon:e.jsx(ee,{size:24})},{id:"6",title:"Power",status:"active",value:"250W",description:"Current power consumption",icon:e.jsx(se,{size:24}),metadata:{voltage:"120V",frequency:"60Hz"}}],a={args:{cards:v,columns:3}},n={args:{cards:v,columns:2}},r={args:{cards:v,columns:4}},i={args:{cards:[],emptyMessage:"No status cards available"}},o={args:{cards:[],loading:!0}},c={args:{cards:[{id:"1",title:"All Systems Operational",status:"success",value:"100%",description:"All services running smoothly"},{id:"2",title:"Backup Status",status:"success",value:"Complete",description:"Latest backup: 2 hours ago"},{id:"3",title:"Security",status:"success",value:"Secure",description:"No threats detected"}],columns:3}},d={args:{cards:[{id:"1",title:"Service Down",status:"error",value:"OFFLINE",description:"Service unreachable for 5 minutes"},{id:"2",title:"Failed Requests",status:"error",value:"127",description:"High error rate detected"},{id:"3",title:"Connection Lost",status:"error",value:"DISCONNECTED",description:"Unable to reach database"}],columns:3}},l={args:{cards:v,columns:3,onCardClick:t=>{console.log("Clicked card:",t),alert(`Status: ${t.title} - ${t.status}`)}}},u={args:{cards:[{id:"1",title:"System Health",status:"success",description:"All systems operational"},{id:"2",title:"Pending Updates",status:"pending",description:"Updates available for installation"},{id:"3",title:"Maintenance Mode",status:"warning",description:"Scheduled maintenance in 2 hours"}],columns:3}},p={args:{cards:[{id:"1",title:"Service A",status:"success"},{id:"2",title:"Service B",status:"active"},{id:"3",title:"Service C",status:"pending"}],columns:3}},m={args:{cards:Array.from({length:12},(t,s)=>({id:String(s),title:`Service ${s+1}`,status:["success","error","warning","pending","active"][s%5],value:`${Math.floor(Math.random()*100)}%`,description:`Status update for service ${s+1}`})),columns:4}},g={args:{cards:[{id:"1",title:"Agent Alpha",status:"active",value:"15",description:"Active tasks in progress",metadata:{uptime:"99.9%",lastSeen:"2 min ago"}},{id:"2",title:"Agent Beta",status:"pending",value:"3",description:"Waiting for resources",metadata:{uptime:"87.2%",lastSeen:"15 min ago"}},{id:"3",title:"Agent Gamma",status:"error",value:"0",description:"Connection lost",metadata:{uptime:"45.1%",lastSeen:"1 hour ago"}},{id:"4",title:"Agent Delta",status:"success",value:"8",description:"All tasks completed",metadata:{uptime:"98.5%",lastSeen:"1 min ago"}}],columns:2}};var y,S,k;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    cards: sampleCards,
    columns: 3
  }
}`,...(k=(S=a.parameters)==null?void 0:S.docs)==null?void 0:k.source}}};var C,M,A;n.parameters={...n.parameters,docs:{...(C=n.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    cards: sampleCards,
    columns: 2
  }
}`,...(A=(M=n.parameters)==null?void 0:M.docs)==null?void 0:A.source}}};var f,x,b;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    cards: sampleCards,
    columns: 4
  }
}`,...(b=(x=r.parameters)==null?void 0:x.docs)==null?void 0:b.source}}};var w,D,N;i.parameters={...i.parameters,docs:{...(w=i.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    cards: [],
    emptyMessage: 'No status cards available'
  }
}`,...(N=(D=i.parameters)==null?void 0:D.docs)==null?void 0:N.source}}};var E,$,z;o.parameters={...o.parameters,docs:{...(E=o.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    cards: [],
    loading: true
  }
}`,...(z=($=o.parameters)==null?void 0:$.docs)==null?void 0:z.source}}};var L,j,U;c.parameters={...c.parameters,docs:{...(L=c.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    cards: [{
      id: '1',
      title: 'All Systems Operational',
      status: 'success',
      value: '100%',
      description: 'All services running smoothly'
    }, {
      id: '2',
      title: 'Backup Status',
      status: 'success',
      value: 'Complete',
      description: 'Latest backup: 2 hours ago'
    }, {
      id: '3',
      title: 'Security',
      status: 'success',
      value: 'Secure',
      description: 'No threats detected'
    }],
    columns: 3
  }
}`,...(U=(j=c.parameters)==null?void 0:j.docs)==null?void 0:U.source}}};var _,G,O;d.parameters={...d.parameters,docs:{...(_=d.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    cards: [{
      id: '1',
      title: 'Service Down',
      status: 'error',
      value: 'OFFLINE',
      description: 'Service unreachable for 5 minutes'
    }, {
      id: '2',
      title: 'Failed Requests',
      status: 'error',
      value: '127',
      description: 'High error rate detected'
    }, {
      id: '3',
      title: 'Connection Lost',
      status: 'error',
      value: 'DISCONNECTED',
      description: 'Unable to reach database'
    }],
    columns: 3
  }
}`,...(O=(G=d.parameters)==null?void 0:G.docs)==null?void 0:O.source}}};var B,F,H;l.parameters={...l.parameters,docs:{...(B=l.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    cards: sampleCards,
    columns: 3,
    onCardClick: card => {
      console.log('Clicked card:', card);
      alert(\`Status: \${card.title} - \${card.status}\`);
    }
  }
}`,...(H=(F=l.parameters)==null?void 0:F.docs)==null?void 0:H.source}}};var I,T,P;u.parameters={...u.parameters,docs:{...(I=u.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    cards: [{
      id: '1',
      title: 'System Health',
      status: 'success',
      description: 'All systems operational'
    }, {
      id: '2',
      title: 'Pending Updates',
      status: 'pending',
      description: 'Updates available for installation'
    }, {
      id: '3',
      title: 'Maintenance Mode',
      status: 'warning',
      description: 'Scheduled maintenance in 2 hours'
    }],
    columns: 3
  }
}`,...(P=(T=u.parameters)==null?void 0:T.docs)==null?void 0:P.source}}};var q,W,R;p.parameters={...p.parameters,docs:{...(q=p.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    cards: [{
      id: '1',
      title: 'Service A',
      status: 'success'
    }, {
      id: '2',
      title: 'Service B',
      status: 'active'
    }, {
      id: '3',
      title: 'Service C',
      status: 'pending'
    }],
    columns: 3
  }
}`,...(R=(W=p.parameters)==null?void 0:W.docs)==null?void 0:R.source}}};var V,Q,Z;m.parameters={...m.parameters,docs:{...(V=m.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    cards: Array.from({
      length: 12
    }, (_, i) => ({
      id: String(i),
      title: \`Service \${i + 1}\`,
      status: (['success', 'error', 'warning', 'pending', 'active'] as const)[i % 5],
      value: \`\${Math.floor(Math.random() * 100)}%\`,
      description: \`Status update for service \${i + 1}\`
    })),
    columns: 4
  }
}`,...(Z=(Q=m.parameters)==null?void 0:Q.docs)==null?void 0:Z.source}}};var J,K,X;g.parameters={...g.parameters,docs:{...(J=g.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    cards: [{
      id: '1',
      title: 'Agent Alpha',
      status: 'active',
      value: '15',
      description: 'Active tasks in progress',
      metadata: {
        uptime: '99.9%',
        lastSeen: '2 min ago'
      }
    }, {
      id: '2',
      title: 'Agent Beta',
      status: 'pending',
      value: '3',
      description: 'Waiting for resources',
      metadata: {
        uptime: '87.2%',
        lastSeen: '15 min ago'
      }
    }, {
      id: '3',
      title: 'Agent Gamma',
      status: 'error',
      value: '0',
      description: 'Connection lost',
      metadata: {
        uptime: '45.1%',
        lastSeen: '1 hour ago'
      }
    }, {
      id: '4',
      title: 'Agent Delta',
      status: 'success',
      value: '8',
      description: 'All tasks completed',
      metadata: {
        uptime: '98.5%',
        lastSeen: '1 min ago'
      }
    }],
    columns: 2
  }
}`,...(X=(K=g.parameters)==null?void 0:K.docs)==null?void 0:X.source}}};const Ce=["Default","TwoColumns","FourColumns","Empty","Loading","SuccessOnly","ErrorStates","Clickable","WithoutValues","MinimalCards","LargeGrid","AgentMonitoring"];export{g as AgentMonitoring,l as Clickable,a as Default,i as Empty,d as ErrorStates,r as FourColumns,m as LargeGrid,o as Loading,p as MinimalCards,c as SuccessOnly,n as TwoColumns,u as WithoutValues,Ce as __namedExportsOrder,ke as default};
