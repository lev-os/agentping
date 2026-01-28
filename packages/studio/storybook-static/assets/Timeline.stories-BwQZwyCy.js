import{j as t}from"./jsx-runtime-BjG_zV1W.js";import{T as W}from"./Timeline-DMZoiotk.js";import{D as Z}from"./database-C0g2qKQ7.js";import{Z as V}from"./zap--N__6G4c.js";import{c as u}from"./createLucideIcon-e4Yg_r7P.js";import"./clock-BhVhGfhk.js";import"./info-B5XUCa8E.js";import"./circle-x-BZUptzyg.js";import"./circle-check-big-DdlYkAcn.js";import"./index-BNURykns.js";/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]],J=u("download",G);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]],Q=u("refresh-cw",K);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]],Y=u("upload",X),me={title:"UI/Timeline",component:W,parameters:{layout:"padded"},tags:["autodocs"],argTypes:{loading:{control:"boolean",description:"Show loading state"},showTime:{control:"boolean",description:"Show time in timestamps"}}},w=[{id:"1",title:"Agent deployment successful",description:"AgentPing v2.1.0 deployed to production",timestamp:new Date(Date.now()-5*6e4),type:"success",metadata:{version:"2.1.0",environment:"production"}},{id:"2",title:"Database migration completed",description:"Applied 12 migrations to update schema",timestamp:new Date(Date.now()-15*6e4),type:"info",icon:t.jsx(Z,{size:16})},{id:"3",title:"High memory usage detected",description:"Agent Beta exceeded 85% memory threshold",timestamp:new Date(Date.now()-30*6e4),type:"warning",metadata:{agent:"Beta",memory:"85.3%"}},{id:"4",title:"Connection timeout",description:"Failed to connect to upstream service after 3 retries",timestamp:new Date(Date.now()-45*6e4),type:"error",metadata:{service:"auth-service",retries:3}},{id:"5",title:"System startup initiated",description:"AgentPing system starting up",timestamp:new Date(Date.now()-60*6e4),type:"info",icon:t.jsx(V,{size:16})}],n={args:{events:w,showTime:!0}},s={args:{events:[],emptyMessage:"No events to display"}},a={args:{events:[],loading:!0}},o={args:{events:[{id:"1",title:"Task completed successfully",description:"All 15 subtasks finished without errors",timestamp:new Date(Date.now()-5*6e4),type:"success"},{id:"2",title:"Deployment verified",description:"All health checks passed",timestamp:new Date(Date.now()-10*6e4),type:"success"},{id:"3",title:"Backup completed",description:"Database backup saved to S3",timestamp:new Date(Date.now()-20*6e4),type:"success"}],showTime:!0}},i={args:{events:[{id:"1",title:"API request failed",description:"500 Internal Server Error from upstream",timestamp:new Date(Date.now()-2*6e4),type:"error"},{id:"2",title:"Authentication failed",description:"Invalid credentials provided",timestamp:new Date(Date.now()-5*6e4),type:"error"},{id:"3",title:"Database connection lost",description:"Connection pool exhausted",timestamp:new Date(Date.now()-10*6e4),type:"error"}],showTime:!0}},r={args:{events:[{id:"1",title:"File uploaded",description:"config.yaml uploaded successfully",timestamp:new Date(Date.now()-5*6e4),type:"success",icon:t.jsx(Y,{size:16})},{id:"2",title:"Backup downloaded",description:"Retrieved backup from remote storage",timestamp:new Date(Date.now()-10*6e4),type:"info",icon:t.jsx(J,{size:16})},{id:"3",title:"Cache refreshed",description:"Application cache cleared and rebuilt",timestamp:new Date(Date.now()-15*6e4),type:"info",icon:t.jsx(Q,{size:16})}],showTime:!0}},c={args:{events:w,showTime:!0,onEventClick:l=>{console.log("Clicked event:",l),alert(`Event: ${l.title}`)}}},p={args:{events:w,showTime:!1}},m={args:{events:Array.from({length:20},(l,e)=>({id:String(e),title:`Event ${e+1}`,description:`Description for event ${e+1}`,timestamp:new Date(Date.now()-e*5*6e4),type:["success","error","warning","info","default"][e%5]})),showTime:!0}},d={args:{events:[{id:"1",title:"Simple event without description",timestamp:new Date(Date.now()-5*6e4),type:"info"},{id:"2",title:"Another minimal event",timestamp:new Date(Date.now()-10*6e4),type:"success"}],showTime:!0}};var D,v,h;n.parameters={...n.parameters,docs:{...(D=n.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    events: sampleEvents,
    showTime: true
  }
}`,...(h=(v=n.parameters)==null?void 0:v.docs)==null?void 0:h.source}}};var g,y,f;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    events: [],
    emptyMessage: 'No events to display'
  }
}`,...(f=(y=s.parameters)==null?void 0:y.docs)==null?void 0:f.source}}};var k,T,S;a.parameters={...a.parameters,docs:{...(k=a.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    events: [],
    loading: true
  }
}`,...(S=(T=a.parameters)==null?void 0:T.docs)==null?void 0:S.source}}};var E,b,A;o.parameters={...o.parameters,docs:{...(E=o.parameters)==null?void 0:E.docs,source:{originalSource:`{
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
}`,...(A=(b=o.parameters)==null?void 0:b.docs)==null?void 0:A.source}}};var C,x,M;i.parameters={...i.parameters,docs:{...(C=i.parameters)==null?void 0:C.docs,source:{originalSource:`{
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
}`,...(M=(x=i.parameters)==null?void 0:x.docs)==null?void 0:M.source}}};var I,_,j;r.parameters={...r.parameters,docs:{...(I=r.parameters)==null?void 0:I.docs,source:{originalSource:`{
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
}`,...(j=(_=r.parameters)==null?void 0:_.docs)==null?void 0:j.source}}};var z,$,L;c.parameters={...c.parameters,docs:{...(z=c.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    events: sampleEvents,
    showTime: true,
    onEventClick: event => {
      console.log('Clicked event:', event);
      alert(\`Event: \${event.title}\`);
    }
  }
}`,...(L=($=c.parameters)==null?void 0:$.docs)==null?void 0:L.source}}};var B,N,O;p.parameters={...p.parameters,docs:{...(B=p.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    events: sampleEvents,
    showTime: false
  }
}`,...(O=(N=p.parameters)==null?void 0:N.docs)==null?void 0:O.source}}};var R,q,H;m.parameters={...m.parameters,docs:{...(R=m.parameters)==null?void 0:R.docs,source:{originalSource:`{
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
}`,...(H=(q=m.parameters)==null?void 0:q.docs)==null?void 0:H.source}}};var P,F,U;d.parameters={...d.parameters,docs:{...(P=d.parameters)==null?void 0:P.docs,source:{originalSource:`{
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
}`,...(U=(F=d.parameters)==null?void 0:F.docs)==null?void 0:U.source}}};const de=["Default","Empty","Loading","SuccessOnly","ErrorsOnly","CustomIcons","Clickable","WithoutTime","LongTimeline","MinimalEvents"];export{c as Clickable,r as CustomIcons,n as Default,s as Empty,i as ErrorsOnly,a as Loading,m as LongTimeline,d as MinimalEvents,o as SuccessOnly,p as WithoutTime,de as __namedExportsOrder,me as default};
