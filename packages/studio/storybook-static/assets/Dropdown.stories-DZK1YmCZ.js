import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{D as a}from"./Dropdown-Dt4QakVY.js";import{r as s}from"./index-BNURykns.js";import{c as r}from"./createLucideIcon-e4Yg_r7P.js";import"./chevron-down-Dx1Dkz5T.js";/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=[["rect",{width:"20",height:"5",x:"2",y:"3",rx:"1",key:"1wp1u1"}],["path",{d:"M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8",key:"1s80jp"}],["path",{d:"M10 12h4",key:"a56b0p"}]],X=r("archive",Q);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y=[["path",{d:"m16 18 6-6-6-6",key:"eg8j8"}],["path",{d:"m8 6-6 6 6 6",key:"ppft3o"}]],Z=r("code",Y);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],oe=r("file-text",ee);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const te=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]],ae=r("image",te);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=[["path",{d:"M9 18V5l12-2v13",key:"1jmyc2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["circle",{cx:"18",cy:"16",r:"3",key:"1hluhg"}]],re=r("music",se);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=[["path",{d:"m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",key:"ftymec"}],["rect",{x:"2",y:"6",width:"14",height:"12",rx:"2",key:"158x01"}]],ie=r("video",ne),ge={title:"UI/Dropdown",component:a,tags:["autodocs"],argTypes:{disabled:{control:"boolean"},placeholder:{control:"text"}}},n=[{id:"1",label:"Option 1"},{id:"2",label:"Option 2"},{id:"3",label:"Option 3"},{id:"4",label:"Option 4"}],J=[{id:"code",label:"Code Files",icon:e.jsx(Z,{size:14})},{id:"text",label:"Text Documents",icon:e.jsx(oe,{size:14})},{id:"image",label:"Images",icon:e.jsx(ae,{size:14})},{id:"video",label:"Videos",icon:e.jsx(ie,{size:14})},{id:"audio",label:"Audio",icon:e.jsx(re,{size:14})},{id:"archive",label:"Archives",icon:e.jsx(X,{size:14})}],le=[{id:"active",label:"Active"},{id:"pending",label:"Pending"},{id:"disabled",label:"Disabled (unavailable)",disabled:!0},{id:"completed",label:"Completed"}],i={render:()=>{const[o,t]=s.useState();return e.jsx(a,{value:o,options:n,onChange:t,placeholder:"Select an option"})}},l={render:()=>{const[o,t]=s.useState("code");return e.jsx(a,{value:o,options:J,onChange:t,placeholder:"Select file type"})}},c={render:()=>{const[o,t]=s.useState("2");return e.jsx(a,{value:o,options:n,onChange:t,placeholder:"Select an option"})}},d={render:()=>{const[o,t]=s.useState();return e.jsx(a,{value:o,options:n,onChange:t,placeholder:"Nothing selected"})}},p={render:()=>{const[o,t]=s.useState("active");return e.jsx(a,{value:o,options:le,onChange:t,placeholder:"Select status"})}},u={render:()=>e.jsx(a,{value:"2",options:n,onChange:()=>{},placeholder:"Select an option",disabled:!0})},h={render:()=>{const[o,t]=s.useState();return e.jsx(a,{value:o,options:n,onChange:t,placeholder:"🎯 Choose your destiny..."})}},m={render:()=>{const[o,t]=s.useState(),y=Array.from({length:20},(ce,b)=>({id:`option-${b}`,label:`Option ${b+1}`}));return e.jsx(a,{value:o,options:y,onChange:t,placeholder:"Select from many options"})}},g={render:()=>{const[o,t]=s.useState("p2"),y=[{id:"p0",label:"P0 - Critical"},{id:"p1",label:"P1 - High"},{id:"p2",label:"P2 - Medium"},{id:"p3",label:"P3 - Low"}];return e.jsx(a,{value:o,options:y,onChange:t,placeholder:"Select priority"})}},v={render:()=>{const[o,t]=s.useState();return e.jsxs("div",{style:{padding:"20px"},children:[e.jsx("p",{style:{marginBottom:"12px",fontSize:"14px"},children:"Keyboard shortcuts: Arrow keys to navigate, Enter/Space to select, Escape to close"}),e.jsx(a,{value:o,options:J,onChange:t,placeholder:"Try keyboard navigation"})]})}};var S,x,V;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string | undefined>();
    return <Dropdown value={value} options={basicOptions} onChange={setValue} placeholder="Select an option" />;
  }
}`,...(V=(x=i.parameters)==null?void 0:x.docs)==null?void 0:V.source}}};var f,C,j;l.parameters={...l.parameters,docs:{...(f=l.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string | undefined>('code');
    return <Dropdown value={value} options={iconOptions} onChange={setValue} placeholder="Select file type" />;
  }
}`,...(j=(C=l.parameters)==null?void 0:C.docs)==null?void 0:j.source}}};var O,k,w;c.parameters={...c.parameters,docs:{...(O=c.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string>('2');
    return <Dropdown value={value} options={basicOptions} onChange={setValue} placeholder="Select an option" />;
  }
}`,...(w=(k=c.parameters)==null?void 0:k.docs)==null?void 0:w.source}}};var D,_,P;d.parameters={...d.parameters,docs:{...(D=d.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string | undefined>();
    return <Dropdown value={value} options={basicOptions} onChange={setValue} placeholder="Nothing selected" />;
  }
}`,...(P=(_=d.parameters)==null?void 0:_.docs)==null?void 0:P.source}}};var N,z,L;p.parameters={...p.parameters,docs:{...(N=p.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string>('active');
    return <Dropdown value={value} options={mixedOptions} onChange={setValue} placeholder="Select status" />;
  }
}`,...(L=(z=p.parameters)==null?void 0:z.docs)==null?void 0:L.source}}};var M,A,$;u.parameters={...u.parameters,docs:{...(M=u.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <Dropdown value="2" options={basicOptions} onChange={() => {}} placeholder="Select an option" disabled />
}`,...($=(A=u.parameters)==null?void 0:A.docs)==null?void 0:$.source}}};var E,I,W;h.parameters={...h.parameters,docs:{...(E=h.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string | undefined>();
    return <Dropdown value={value} options={basicOptions} onChange={setValue} placeholder="🎯 Choose your destiny..." />;
  }
}`,...(W=(I=h.parameters)==null?void 0:I.docs)==null?void 0:W.source}}};var H,T,K;m.parameters={...m.parameters,docs:{...(H=m.parameters)==null?void 0:H.docs,source:{originalSource:`{
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
}`,...(K=(T=m.parameters)==null?void 0:T.docs)==null?void 0:K.source}}};var B,F,q;g.parameters={...g.parameters,docs:{...(B=g.parameters)==null?void 0:B.docs,source:{originalSource:`{
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
}`,...(q=(F=g.parameters)==null?void 0:F.docs)==null?void 0:q.source}}};var R,U,G;v.parameters={...v.parameters,docs:{...(R=v.parameters)==null?void 0:R.docs,source:{originalSource:`{
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
}`,...(G=(U=v.parameters)==null?void 0:U.docs)==null?void 0:G.source}}};const ve=["Default","WithIcons","WithPreselectedValue","NoSelection","WithDisabledOptions","Disabled","CustomPlaceholder","LongList","PriorityLevels","KeyboardNavigation"];export{h as CustomPlaceholder,i as Default,u as Disabled,v as KeyboardNavigation,m as LongList,d as NoSelection,g as PriorityLevels,p as WithDisabledOptions,l as WithIcons,c as WithPreselectedValue,ve as __namedExportsOrder,ge as default};
