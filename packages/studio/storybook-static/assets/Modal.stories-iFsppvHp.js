import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{r as i}from"./index-BNURykns.js";import{r as ae}from"./index-oiHgbqC6.js";import{X as oe}from"./x-BAbVpizD.js";import{B as o}from"./Button-CuNwQsQB.js";import"./createLucideIcon-e4Yg_r7P.js";function g({isOpen:a,onClose:t,title:r,children:$,footer:v,size:ee="md"}){const M=i.useRef(null),b=i.useRef(null),n=i.useCallback(s=>{s.key==="Escape"&&t()},[t]);i.useEffect(()=>{var s;return a?(b.current=document.activeElement,document.addEventListener("keydown",n),document.body.style.overflow="hidden"):(document.removeEventListener("keydown",n),document.body.style.overflow="",(s=b.current)==null||s.focus()),()=>{document.removeEventListener("keydown",n),document.body.style.overflow=""}},[a,n]);const te=s=>{s.target===M.current&&t()};if(!a)return null;const le={sm:"400px",md:"500px",lg:"700px"};return ae.createPortal(e.jsx("div",{ref:M,className:"ui-modal-overlay",onClick:te,role:"dialog","aria-modal":"true","aria-labelledby":r?"modal-title":void 0,children:e.jsxs("div",{className:"ui-modal",style:{maxWidth:le[ee]},children:[r&&e.jsxs("div",{className:"ui-modal-header",children:[e.jsx("h2",{id:"modal-title",className:"ui-modal-title",children:r}),e.jsx("button",{className:"ui-modal-close",onClick:t,"aria-label":"Close modal",children:e.jsx(oe,{size:18})})]}),e.jsx("div",{className:"ui-modal-body ui-scrollbar",children:$}),v&&e.jsx("div",{className:"ui-modal-footer",children:v})]})}),document.body)}const me={title:"UI/Modal",component:g,tags:["autodocs"],argTypes:{isOpen:{control:"boolean"},size:{control:"select",options:["sm","md","lg"]}}};function l(a){const[t,r]=i.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{onClick:()=>r(!0),children:"Open Modal"}),e.jsx(g,{...a,isOpen:t,onClose:()=>r(!1)})]})}const d={render:()=>e.jsx(l,{children:e.jsx("p",{children:"This is a basic modal with default settings."})})},c={render:()=>e.jsx(l,{title:"Modal Title",children:e.jsx("p",{children:"This modal has a title and a close button in the header."})})},m={render:()=>e.jsx(l,{title:"Small Modal",size:"sm",children:e.jsx("p",{children:"A compact modal for simple dialogs."})})},p={render:()=>e.jsxs(l,{title:"Medium Modal",size:"md",children:[e.jsx("p",{children:"The default medium-sized modal."}),e.jsx("p",{children:"Suitable for most use cases."})]})},u={render:()=>e.jsxs(l,{title:"Large Modal",size:"lg",children:[e.jsx("p",{children:"A larger modal for content-heavy dialogs."}),e.jsx("p",{children:"Great for forms, settings, or detailed information."}),e.jsxs("ul",{children:[e.jsx("li",{children:"Item 1"}),e.jsx("li",{children:"Item 2"}),e.jsx("li",{children:"Item 3"})]})]})},h={render:()=>e.jsx(l,{title:"Modal with Footer",footer:e.jsxs("div",{style:{display:"flex",gap:"8px",justifyContent:"flex-end"},children:[e.jsx(o,{variant:"outline",children:"Cancel"}),e.jsx(o,{children:"Confirm"})]}),children:e.jsx("p",{children:"This modal has footer actions."})})},x={render:()=>{const[a,t]=i.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{onClick:()=>t(!0),variant:"danger",children:"Delete Item"}),e.jsx(g,{isOpen:a,onClose:()=>t(!1),title:"Confirm Deletion",size:"sm",footer:e.jsxs("div",{style:{display:"flex",gap:"8px",justifyContent:"flex-end"},children:[e.jsx(o,{variant:"outline",onClick:()=>t(!1),children:"Cancel"}),e.jsx(o,{variant:"danger",onClick:()=>t(!1),children:"Delete"})]}),children:e.jsx("p",{children:"Are you sure you want to delete this item? This action cannot be undone."})})]})}},f={render:()=>e.jsx(l,{title:"Scrollable Modal",size:"md",children:e.jsx("div",{children:Array.from({length:50},(a,t)=>e.jsxs("p",{children:["Line ",t+1,": Lorem ipsum dolor sit amet, consectetur adipiscing elit."]},t))})})},j={render:()=>e.jsx(l,{title:"User Settings",size:"md",footer:e.jsxs("div",{style:{display:"flex",gap:"8px",justifyContent:"flex-end"},children:[e.jsx(o,{variant:"outline",children:"Cancel"}),e.jsx(o,{children:"Save Changes"})]}),children:e.jsxs("form",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"name",children:"Name"}),e.jsx("input",{id:"name",type:"text",placeholder:"John Doe",style:{width:"100%"}})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"email",children:"Email"}),e.jsx("input",{id:"email",type:"email",placeholder:"john@example.com",style:{width:"100%"}})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"bio",children:"Bio"}),e.jsx("textarea",{id:"bio",rows:4,placeholder:"Tell us about yourself...",style:{width:"100%"}})]})]})})},y={render:()=>e.jsx(l,{size:"sm",children:e.jsxs("div",{style:{textAlign:"center",padding:"20px"},children:[e.jsx("h3",{children:"Custom Content"}),e.jsx("p",{children:"A modal without a standard header."})]})})};var C,T,S;d.parameters={...d.parameters,docs:{...(C=d.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => <ModalTemplate>
      <p>This is a basic modal with default settings.</p>
    </ModalTemplate>
}`,...(S=(T=d.parameters)==null?void 0:T.docs)==null?void 0:S.source}}};var w,z,B;c.parameters={...c.parameters,docs:{...(w=c.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <ModalTemplate title="Modal Title">
      <p>This modal has a title and a close button in the header.</p>
    </ModalTemplate>
}`,...(B=(z=c.parameters)==null?void 0:z.docs)==null?void 0:B.source}}};var k,D,I;m.parameters={...m.parameters,docs:{...(k=m.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <ModalTemplate title="Small Modal" size="sm">
      <p>A compact modal for simple dialogs.</p>
    </ModalTemplate>
}`,...(I=(D=m.parameters)==null?void 0:D.docs)==null?void 0:I.source}}};var F,O,A;p.parameters={...p.parameters,docs:{...(F=p.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <ModalTemplate title="Medium Modal" size="md">
      <p>The default medium-sized modal.</p>
      <p>Suitable for most use cases.</p>
    </ModalTemplate>
}`,...(A=(O=p.parameters)==null?void 0:O.docs)==null?void 0:A.source}}};var E,L,N;u.parameters={...u.parameters,docs:{...(E=u.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <ModalTemplate title="Large Modal" size="lg">
      <p>A larger modal for content-heavy dialogs.</p>
      <p>Great for forms, settings, or detailed information.</p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
    </ModalTemplate>
}`,...(N=(L=u.parameters)==null?void 0:L.docs)==null?void 0:N.source}}};var W,R,_;h.parameters={...h.parameters,docs:{...(W=h.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => <ModalTemplate title="Modal with Footer" footer={<div style={{
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end'
  }}>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </div>}>
      <p>This modal has footer actions.</p>
    </ModalTemplate>
}`,...(_=(R=h.parameters)==null?void 0:R.docs)==null?void 0:_.source}}};var U,G,J;x.parameters={...x.parameters,docs:{...(U=x.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)} variant="danger">Delete Item</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirm Deletion" size="sm" footer={<div style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'flex-end'
      }}>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => setIsOpen(false)}>Delete</Button>
            </div>}>
          <p>Are you sure you want to delete this item? This action cannot be undone.</p>
        </Modal>
      </>;
  }
}`,...(J=(G=x.parameters)==null?void 0:G.docs)==null?void 0:J.source}}};var K,P,X;f.parameters={...f.parameters,docs:{...(K=f.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => <ModalTemplate title="Scrollable Modal" size="md">
      <div>
        {Array.from({
        length: 50
      }, (_, i) => <p key={i}>Line {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>)}
      </div>
    </ModalTemplate>
}`,...(X=(P=f.parameters)==null?void 0:P.docs)==null?void 0:X.source}}};var q,H,Q;j.parameters={...j.parameters,docs:{...(q=j.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <ModalTemplate title="User Settings" size="md" footer={<div style={{
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end'
  }}>
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>}>
      <form style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" placeholder="John Doe" style={{
          width: '100%'
        }} />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="john@example.com" style={{
          width: '100%'
        }} />
        </div>
        <div>
          <label htmlFor="bio">Bio</label>
          <textarea id="bio" rows={4} placeholder="Tell us about yourself..." style={{
          width: '100%'
        }} />
        </div>
      </form>
    </ModalTemplate>
}`,...(Q=(H=j.parameters)==null?void 0:H.docs)==null?void 0:Q.source}}};var V,Y,Z;y.parameters={...y.parameters,docs:{...(V=y.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: () => <ModalTemplate size="sm">
      <div style={{
      textAlign: 'center',
      padding: '20px'
    }}>
        <h3>Custom Content</h3>
        <p>A modal without a standard header.</p>
      </div>
    </ModalTemplate>
}`,...(Z=(Y=y.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};const pe=["Default","WithTitle","SmallSize","MediumSize","LargeSize","WithFooter","ConfirmDialog","ScrollableContent","FormModal","NoTitle"];export{x as ConfirmDialog,d as Default,j as FormModal,u as LargeSize,p as MediumSize,y as NoTitle,f as ScrollableContent,m as SmallSize,h as WithFooter,c as WithTitle,pe as __namedExportsOrder,me as default};
