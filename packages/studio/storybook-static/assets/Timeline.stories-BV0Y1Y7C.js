import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{C as K}from"./clock-BhVhGfhk.js";import{I as ae}from"./info-B5XUCa8E.js";import{c as a}from"./createLucideIcon-e4Yg_r7P.js";import{C as ie}from"./circle-x-BZUptzyg.js";import{C as re}from"./circle-check-big-DdlYkAcn.js";import{Z as oe}from"./zap--N__6G4c.js";import"./index-BNURykns.js";/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ce=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],de=a("circle-alert",ce);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const me=[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]],le=a("database",me);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pe=[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]],ue=a("download",pe);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const he=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]],ye=a("refresh-cw",he);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const we=[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]],ve=a("upload",we),ge={success:e.jsx(re,{size:16}),error:e.jsx(ie,{size:16}),warning:e.jsx(de,{size:16}),info:e.jsx(ae,{size:16}),default:e.jsx(K,{size:16})};function Q({events:s,loading:n=!1,emptyMessage:Y="No events to display",onEventClick:i,showTime:ee=!0,className:w=""}){const te=t=>{const v=typeof t=="string"?new Date(t):t;return ee?v.toLocaleString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}):v.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})};return n?e.jsx("div",{className:`timeline-container loading ${w}`,children:e.jsxs("div",{className:"timeline-loading",children:[e.jsx("div",{className:"spinner"}),e.jsx("span",{children:"Loading timeline..."})]})}):s.length===0?e.jsx("div",{className:`timeline-container empty ${w}`,children:e.jsxs("div",{className:"timeline-empty",children:[e.jsx(K,{size:32}),e.jsx("span",{children:Y})]})}):e.jsxs("div",{className:`timeline-container ${w}`,children:[e.jsx("div",{className:"timeline-track"}),e.jsx("div",{className:"timeline-events",children:s.map((t,v)=>{const g=t.type||"default",ne=t.icon||ge[g];return e.jsxs("div",{className:`timeline-event ${g} ${i?"clickable":""}`,onClick:()=>i==null?void 0:i(t),children:[e.jsx("div",{className:`timeline-marker ${g}`,children:ne}),e.jsxs("div",{className:"timeline-content",children:[e.jsxs("div",{className:"timeline-header",children:[e.jsx("h4",{className:"timeline-title",children:t.title}),e.jsx("span",{className:"timeline-timestamp",children:te(t.timestamp)})]}),t.description&&e.jsx("p",{className:"timeline-description",children:t.description}),t.metadata&&Object.keys(t.metadata).length>0&&e.jsx("div",{className:"timeline-metadata",children:Object.entries(t.metadata).map(([D,se])=>e.jsxs("div",{className:"metadata-item",children:[e.jsxs("span",{className:"metadata-key",children:[D,":"]}),e.jsx("span",{className:"metadata-value",children:String(se)})]},D))})]})]},t.id)})})]})}Q.__docgenInfo={description:"",methods:[],displayName:"Timeline",props:{events:{required:!0,tsType:{name:"Array",elements:[{name:"TimelineEvent"}],raw:"TimelineEvent[]"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},emptyMessage:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'No events to display'",computed:!1}},onEventClick:{required:!1,tsType:{name:"signature",type:"function",raw:"(event: TimelineEvent) => void",signature:{arguments:[{type:{name:"TimelineEvent"},name:"event"}],return:{name:"void"}}},description:""},showTime:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}}}};const be={title:"UI/Timeline",component:Q,parameters:{layout:"padded"},tags:["autodocs"],argTypes:{loading:{control:"boolean",description:"Show loading state"},showTime:{control:"boolean",description:"Show time in timestamps"}}},f=[{id:"1",title:"Agent deployment successful",description:"AgentPing v2.1.0 deployed to production",timestamp:new Date(Date.now()-5*6e4),type:"success",metadata:{version:"2.1.0",environment:"production"}},{id:"2",title:"Database migration completed",description:"Applied 12 migrations to update schema",timestamp:new Date(Date.now()-15*6e4),type:"info",icon:e.jsx(le,{size:16})},{id:"3",title:"High memory usage detected",description:"Agent Beta exceeded 85% memory threshold",timestamp:new Date(Date.now()-30*6e4),type:"warning",metadata:{agent:"Beta",memory:"85.3%"}},{id:"4",title:"Connection timeout",description:"Failed to connect to upstream service after 3 retries",timestamp:new Date(Date.now()-45*6e4),type:"error",metadata:{service:"auth-service",retries:3}},{id:"5",title:"System startup initiated",description:"AgentPing system starting up",timestamp:new Date(Date.now()-60*6e4),type:"info",icon:e.jsx(oe,{size:16})}],r={args:{events:f,showTime:!0}},o={args:{events:[],emptyMessage:"No events to display"}},c={args:{events:[],loading:!0}},d={args:{events:[{id:"1",title:"Task completed successfully",description:"All 15 subtasks finished without errors",timestamp:new Date(Date.now()-5*6e4),type:"success"},{id:"2",title:"Deployment verified",description:"All health checks passed",timestamp:new Date(Date.now()-10*6e4),type:"success"},{id:"3",title:"Backup completed",description:"Database backup saved to S3",timestamp:new Date(Date.now()-20*6e4),type:"success"}],showTime:!0}},m={args:{events:[{id:"1",title:"API request failed",description:"500 Internal Server Error from upstream",timestamp:new Date(Date.now()-2*6e4),type:"error"},{id:"2",title:"Authentication failed",description:"Invalid credentials provided",timestamp:new Date(Date.now()-5*6e4),type:"error"},{id:"3",title:"Database connection lost",description:"Connection pool exhausted",timestamp:new Date(Date.now()-10*6e4),type:"error"}],showTime:!0}},l={args:{events:[{id:"1",title:"File uploaded",description:"config.yaml uploaded successfully",timestamp:new Date(Date.now()-5*6e4),type:"success",icon:e.jsx(ve,{size:16})},{id:"2",title:"Backup downloaded",description:"Retrieved backup from remote storage",timestamp:new Date(Date.now()-10*6e4),type:"info",icon:e.jsx(ue,{size:16})},{id:"3",title:"Cache refreshed",description:"Application cache cleared and rebuilt",timestamp:new Date(Date.now()-15*6e4),type:"info",icon:e.jsx(ye,{size:16})}],showTime:!0}},p={args:{events:f,showTime:!0,onEventClick:s=>{console.log("Clicked event:",s),alert(`Event: ${s.title}`)}}},u={args:{events:f,showTime:!1}},h={args:{events:Array.from({length:20},(s,n)=>({id:String(n),title:`Event ${n+1}`,description:`Description for event ${n+1}`,timestamp:new Date(Date.now()-n*5*6e4),type:["success","error","warning","info","default"][n%5]})),showTime:!0}},y={args:{events:[{id:"1",title:"Simple event without description",timestamp:new Date(Date.now()-5*6e4),type:"info"},{id:"2",title:"Another minimal event",timestamp:new Date(Date.now()-10*6e4),type:"success"}],showTime:!0}};var x,k,T;r.parameters={...r.parameters,docs:{...(x=r.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    events: sampleEvents,
    showTime: true
  }
}`,...(T=(k=r.parameters)==null?void 0:k.docs)==null?void 0:T.source}}};var j,N,S;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    events: [],
    emptyMessage: 'No events to display'
  }
}`,...(S=(N=o.parameters)==null?void 0:N.docs)==null?void 0:S.source}}};var b,A,C;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    events: [],
    loading: true
  }
}`,...(C=(A=c.parameters)==null?void 0:A.docs)==null?void 0:C.source}}};var E,_,$;d.parameters={...d.parameters,docs:{...(E=d.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    events: [{
      id: '1',
      title: 'Task completed successfully',
      description: 'All 15 subtasks finished without errors',
      timestamp: new Date(Date.now() - 5 * 60000),
      type: 'success'
    }, {
      id: '2',
      title: 'Deployment verified',
      description: 'All health checks passed',
      timestamp: new Date(Date.now() - 10 * 60000),
      type: 'success'
    }, {
      id: '3',
      title: 'Backup completed',
      description: 'Database backup saved to S3',
      timestamp: new Date(Date.now() - 20 * 60000),
      type: 'success'
    }],
    showTime: true
  }
}`,...($=(_=d.parameters)==null?void 0:_.docs)==null?void 0:$.source}}};var z,M,I;m.parameters={...m.parameters,docs:{...(z=m.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    events: [{
      id: '1',
      title: 'API request failed',
      description: '500 Internal Server Error from upstream',
      timestamp: new Date(Date.now() - 2 * 60000),
      type: 'error'
    }, {
      id: '2',
      title: 'Authentication failed',
      description: 'Invalid credentials provided',
      timestamp: new Date(Date.now() - 5 * 60000),
      type: 'error'
    }, {
      id: '3',
      title: 'Database connection lost',
      description: 'Connection pool exhausted',
      timestamp: new Date(Date.now() - 10 * 60000),
      type: 'error'
    }],
    showTime: true
  }
}`,...(I=(M=m.parameters)==null?void 0:M.docs)==null?void 0:I.source}}};var q,L,B;l.parameters={...l.parameters,docs:{...(q=l.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    events: [{
      id: '1',
      title: 'File uploaded',
      description: 'config.yaml uploaded successfully',
      timestamp: new Date(Date.now() - 5 * 60000),
      type: 'success',
      icon: <Upload size={16} />
    }, {
      id: '2',
      title: 'Backup downloaded',
      description: 'Retrieved backup from remote storage',
      timestamp: new Date(Date.now() - 10 * 60000),
      type: 'info',
      icon: <Download size={16} />
    }, {
      id: '3',
      title: 'Cache refreshed',
      description: 'Application cache cleared and rebuilt',
      timestamp: new Date(Date.now() - 15 * 60000),
      type: 'info',
      icon: <RefreshCw size={16} />
    }],
    showTime: true
  }
}`,...(B=(L=l.parameters)==null?void 0:L.docs)==null?void 0:B.source}}};var O,V,R;p.parameters={...p.parameters,docs:{...(O=p.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    events: sampleEvents,
    showTime: true,
    onEventClick: event => {
      console.log('Clicked event:', event);
      alert(\`Event: \${event.title}\`);
    }
  }
}`,...(R=(V=p.parameters)==null?void 0:V.docs)==null?void 0:R.source}}};var U,H,P;u.parameters={...u.parameters,docs:{...(U=u.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    events: sampleEvents,
    showTime: false
  }
}`,...(P=(H=u.parameters)==null?void 0:H.docs)==null?void 0:P.source}}};var F,W,Z;h.parameters={...h.parameters,docs:{...(F=h.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    events: Array.from({
      length: 20
    }, (_, i) => ({
      id: String(i),
      title: \`Event \${i + 1}\`,
      description: \`Description for event \${i + 1}\`,
      timestamp: new Date(Date.now() - i * 5 * 60000),
      type: (['success', 'error', 'warning', 'info', 'default'] as const)[i % 5]
    })),
    showTime: true
  }
}`,...(Z=(W=h.parameters)==null?void 0:W.docs)==null?void 0:Z.source}}};var X,G,J;y.parameters={...y.parameters,docs:{...(X=y.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    events: [{
      id: '1',
      title: 'Simple event without description',
      timestamp: new Date(Date.now() - 5 * 60000),
      type: 'info'
    }, {
      id: '2',
      title: 'Another minimal event',
      timestamp: new Date(Date.now() - 10 * 60000),
      type: 'success'
    }],
    showTime: true
  }
}`,...(J=(G=y.parameters)==null?void 0:G.docs)==null?void 0:J.source}}};const Ae=["Default","Empty","Loading","SuccessOnly","ErrorsOnly","CustomIcons","Clickable","WithoutTime","LongTimeline","MinimalEvents"];export{p as Clickable,l as CustomIcons,r as Default,o as Empty,m as ErrorsOnly,c as Loading,h as LongTimeline,y as MinimalEvents,d as SuccessOnly,u as WithoutTime,Ae as __namedExportsOrder,be as default};
