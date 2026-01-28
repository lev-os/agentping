import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{D as a}from"./Dropdown-Dt4QakVY.js";import{r}from"./index-BNURykns.js";import{c as s}from"./createLucideIcon-e4Yg_r7P.js";import{F as Q}from"./file-text-7SLw8HbY.js";import"./chevron-down-Dx1Dkz5T.js";/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=[["rect",{width:"20",height:"5",x:"2",y:"3",rx:"1",key:"1wp1u1"}],["path",{d:"M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8",key:"1s80jp"}],["path",{d:"M10 12h4",key:"a56b0p"}]],Y=s("archive",X);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=[["path",{d:"m16 18 6-6-6-6",key:"eg8j8"}],["path",{d:"m8 6-6 6 6 6",key:"ppft3o"}]],ee=s("code",Z);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]],te=s("image",oe);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=[["path",{d:"M9 18V5l12-2v13",key:"1jmyc2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["circle",{cx:"18",cy:"16",r:"3",key:"1hluhg"}]],re=s("music",ae);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=[["path",{d:"m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",key:"ftymec"}],["rect",{x:"2",y:"6",width:"14",height:"12",rx:"2",key:"158x01"}]],ne=s("video",se),ge={title:"UI/Dropdown",component:a,tags:["autodocs"],argTypes:{disabled:{control:"boolean"},placeholder:{control:"text"}}},n=[{id:"1",label:"Option 1"},{id:"2",label:"Option 2"},{id:"3",label:"Option 3"},{id:"4",label:"Option 4"}],J=[{id:"code",label:"Code Files",icon:e.jsx(ee,{size:14})},{id:"text",label:"Text Documents",icon:e.jsx(Q,{size:14})},{id:"image",label:"Images",icon:e.jsx(te,{size:14})},{id:"video",label:"Videos",icon:e.jsx(ne,{size:14})},{id:"audio",label:"Audio",icon:e.jsx(re,{size:14})},{id:"archive",label:"Archives",icon:e.jsx(Y,{size:14})}],ie=[{id:"active",label:"Active"},{id:"pending",label:"Pending"},{id:"disabled",label:"Disabled (unavailable)",disabled:!0},{id:"completed",label:"Completed"}],i={render:()=>{const[o,t]=r.useState();return e.jsx(a,{value:o,options:n,onChange:t,placeholder:"Select an option"})}},l={render:()=>{const[o,t]=r.useState("code");return e.jsx(a,{value:o,options:J,onChange:t,placeholder:"Select file type"})}},c={render:()=>{const[o,t]=r.useState("2");return e.jsx(a,{value:o,options:n,onChange:t,placeholder:"Select an option"})}},d={render:()=>{const[o,t]=r.useState();return e.jsx(a,{value:o,options:n,onChange:t,placeholder:"Nothing selected"})}},p={render:()=>{const[o,t]=r.useState("active");return e.jsx(a,{value:o,options:ie,onChange:t,placeholder:"Select status"})}},u={render:()=>e.jsx(a,{value:"2",options:n,onChange:()=>{},placeholder:"Select an option",disabled:!0})},m={render:()=>{const[o,t]=r.useState();return e.jsx(a,{value:o,options:n,onChange:t,placeholder:"🎯 Choose your destiny..."})}},h={render:()=>{const[o,t]=r.useState(),y=Array.from({length:20},(le,b)=>({id:`option-${b}`,label:`Option ${b+1}`}));return e.jsx(a,{value:o,options:y,onChange:t,placeholder:"Select from many options"})}},g={render:()=>{const[o,t]=r.useState("p2"),y=[{id:"p0",label:"P0 - Critical"},{id:"p1",label:"P1 - High"},{id:"p2",label:"P2 - Medium"},{id:"p3",label:"P3 - Low"}];return e.jsx(a,{value:o,options:y,onChange:t,placeholder:"Select priority"})}},v={render:()=>{const[o,t]=r.useState();return e.jsxs("div",{style:{padding:"20px"},children:[e.jsx("p",{style:{marginBottom:"12px",fontSize:"14px"},children:"Keyboard shortcuts: Arrow keys to navigate, Enter/Space to select, Escape to close"}),e.jsx(a,{value:o,options:J,onChange:t,placeholder:"Try keyboard navigation"})]})}};var S,x,V;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string | undefined>();
    return <Dropdown value={value} options={basicOptions} onChange={setValue} placeholder="Select an option" />;
  }
}`,...(V=(x=i.parameters)==null?void 0:x.docs)==null?void 0:V.source}}};var C,f,j;l.parameters={...l.parameters,docs:{...(C=l.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string | undefined>('code');
    return <Dropdown value={value} options={iconOptions} onChange={setValue} placeholder="Select file type" />;
  }
}`,...(j=(f=l.parameters)==null?void 0:f.docs)==null?void 0:j.source}}};var O,D,w;c.parameters={...c.parameters,docs:{...(O=c.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string>('2');
    return <Dropdown value={value} options={basicOptions} onChange={setValue} placeholder="Select an option" />;
  }
}`,...(w=(D=c.parameters)==null?void 0:D.docs)==null?void 0:w.source}}};var k,P,_;d.parameters={...d.parameters,docs:{...(k=d.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string | undefined>();
    return <Dropdown value={value} options={basicOptions} onChange={setValue} placeholder="Nothing selected" />;
  }
}`,...(_=(P=d.parameters)==null?void 0:P.docs)==null?void 0:_.source}}};var L,N,z;p.parameters={...p.parameters,docs:{...(L=p.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string>('active');
    return <Dropdown value={value} options={mixedOptions} onChange={setValue} placeholder="Select status" />;
  }
}`,...(z=(N=p.parameters)==null?void 0:N.docs)==null?void 0:z.source}}};var A,$,E;u.parameters={...u.parameters,docs:{...(A=u.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => <Dropdown value="2" options={basicOptions} onChange={() => {}} placeholder="Select an option" disabled />
}`,...(E=($=u.parameters)==null?void 0:$.docs)==null?void 0:E.source}}};var I,M,W;m.parameters={...m.parameters,docs:{...(I=m.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string | undefined>();
    return <Dropdown value={value} options={basicOptions} onChange={setValue} placeholder="🎯 Choose your destiny..." />;
  }
}`,...(W=(M=m.parameters)==null?void 0:M.docs)==null?void 0:W.source}}};var T,K,F;h.parameters={...h.parameters,docs:{...(T=h.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string | undefined>();
    const longOptions = Array.from({
      length: 20
    }, (_, i) => ({
      id: \`option-\${i}\`,
      label: \`Option \${i + 1}\`
    }));
    return <Dropdown value={value} options={longOptions} onChange={setValue} placeholder="Select from many options" />;
  }
}`,...(F=(K=h.parameters)==null?void 0:K.docs)==null?void 0:F.source}}};var B,H,q;g.parameters={...g.parameters,docs:{...(B=g.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string>('p2');
    const priorities = [{
      id: 'p0',
      label: 'P0 - Critical'
    }, {
      id: 'p1',
      label: 'P1 - High'
    }, {
      id: 'p2',
      label: 'P2 - Medium'
    }, {
      id: 'p3',
      label: 'P3 - Low'
    }];
    return <Dropdown value={value} options={priorities} onChange={setValue} placeholder="Select priority" />;
  }
}`,...(q=(H=g.parameters)==null?void 0:H.docs)==null?void 0:q.source}}};var R,U,G;v.parameters={...v.parameters,docs:{...(R=v.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string | undefined>();
    return <div style={{
      padding: '20px'
    }}>
        <p style={{
        marginBottom: '12px',
        fontSize: '14px'
      }}>
          Keyboard shortcuts: Arrow keys to navigate, Enter/Space to select, Escape to close
        </p>
        <Dropdown value={value} options={iconOptions} onChange={setValue} placeholder="Try keyboard navigation" />
      </div>;
  }
}`,...(G=(U=v.parameters)==null?void 0:U.docs)==null?void 0:G.source}}};const ve=["Default","WithIcons","WithPreselectedValue","NoSelection","WithDisabledOptions","Disabled","CustomPlaceholder","LongList","PriorityLevels","KeyboardNavigation"];export{m as CustomPlaceholder,i as Default,u as Disabled,v as KeyboardNavigation,h as LongList,d as NoSelection,g as PriorityLevels,p as WithDisabledOptions,l as WithIcons,c as WithPreselectedValue,ve as __namedExportsOrder,ge as default};
