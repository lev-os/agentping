import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{T as s,a as ne}from"./Toast-DfuF8klP.js";import{r as ie}from"./index-BNURykns.js";import{Z as ue}from"./zap--N__6G4c.js";import"./x-BAbVpizD.js";import"./createLucideIcon-e4Yg_r7P.js";import"./info-B5XUCa8E.js";import"./triangle-alert-Dqss0hRc.js";import"./circle-x-BZUptzyg.js";import"./circle-check-big-DdlYkAcn.js";const Te={title:"UI/Toast",component:s,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["success","error","warning","info"],description:"Toast variant style"},duration:{control:"number",description:"Auto-dismiss duration in ms (0 = no auto-dismiss)"},closable:{control:"boolean",description:"Show close button"}}},o={args:{variant:"success",title:"Success",message:"Your changes have been saved successfully.",duration:0}},n={args:{variant:"error",title:"Error",message:"Failed to save changes. Please try again.",duration:0}},i={args:{variant:"warning",title:"Warning",message:"Your session will expire in 5 minutes.",duration:0}},c={args:{variant:"info",title:"Info",message:"New updates are available. Refresh to see the latest version.",duration:0}},d={args:{variant:"success",message:"Operation completed successfully.",duration:0}},l={args:{variant:"info",title:"Update Available",message:"A new version is available.",action:{label:"Update Now",onClick:()=>alert("Updating...")},duration:0}},u={args:{variant:"success",title:"Powered Up",message:"Your account has been upgraded.",icon:e.jsx(ue,{size:20}),duration:0}},p={args:{variant:"warning",title:"Action Required",message:"You must complete this step to continue.",closable:!1,duration:0}},m={args:{variant:"info",title:"Detailed Information",message:"This is a longer message that provides more detailed information about what happened. It might span multiple lines and should still be readable and well-formatted within the toast component.",duration:0}},g={render:()=>{const[b,r]=ie.useState(!0);return e.jsx("div",{children:b?e.jsx(s,{variant:"success",message:"This toast will auto-dismiss in 3 seconds",duration:3e3,onClose:()=>r(!1)}):e.jsx("button",{onClick:()=>r(!0),style:{padding:"8px 16px",borderRadius:"4px",border:"1px solid #ccc",cursor:"pointer"},children:"Show Toast Again"})})}},v={render:()=>e.jsxs(ne,{position:"top-right",children:[e.jsx(s,{variant:"success",title:"Task Completed",message:"Your task has been completed successfully.",duration:0}),e.jsx(s,{variant:"info",title:"New Message",message:"You have a new message from Alice.",duration:0}),e.jsx(s,{variant:"warning",message:"Low disk space detected.",duration:0})]})},f={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsx(s,{variant:"success",title:"Success",message:"Operation completed successfully.",duration:0}),e.jsx(s,{variant:"error",title:"Error",message:"Something went wrong.",duration:0}),e.jsx(s,{variant:"warning",title:"Warning",message:"Please review your changes.",duration:0}),e.jsx(s,{variant:"info",title:"Info",message:"Here's some helpful information.",duration:0})]})},x={render:()=>{const[b,r]=ie.useState([]);let ce=0;const t=(a,h)=>{const w=++ce;r(le=>[...le,{id:w,variant:a,message:h}])},de=a=>{r(h=>h.filter(w=>w.id!==a))};return e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",gap:"8px",marginBottom:"16px",flexWrap:"wrap"},children:[e.jsx("button",{onClick:()=>t("success","Success toast!"),style:{padding:"8px 12px",borderRadius:"4px",border:"1px solid #4ade80",background:"#dcfce7",cursor:"pointer"},children:"Show Success"}),e.jsx("button",{onClick:()=>t("error","Error toast!"),style:{padding:"8px 12px",borderRadius:"4px",border:"1px solid #f87171",background:"#fee2e2",cursor:"pointer"},children:"Show Error"}),e.jsx("button",{onClick:()=>t("warning","Warning toast!"),style:{padding:"8px 12px",borderRadius:"4px",border:"1px solid #fbbf24",background:"#fef3c7",cursor:"pointer"},children:"Show Warning"}),e.jsx("button",{onClick:()=>t("info","Info toast!"),style:{padding:"8px 12px",borderRadius:"4px",border:"1px solid #60a5fa",background:"#dbeafe",cursor:"pointer"},children:"Show Info"})]}),e.jsx(ne,{position:"top-right",children:b.map(a=>e.jsx(s,{variant:a.variant,message:a.message,duration:3e3,onClose:()=>de(a.id)},a.id))})]})}};var S,T,y;o.parameters={...o.parameters,docs:{...(S=o.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    title: 'Success',
    message: 'Your changes have been saved successfully.',
    duration: 0
  }
}`,...(y=(T=o.parameters)==null?void 0:T.docs)==null?void 0:y.source}}};var C,k,j;n.parameters={...n.parameters,docs:{...(C=n.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    variant: 'error',
    title: 'Error',
    message: 'Failed to save changes. Please try again.',
    duration: 0
  }
}`,...(j=(k=n.parameters)==null?void 0:k.docs)==null?void 0:j.source}}};var I,A,R;i.parameters={...i.parameters,docs:{...(I=i.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    title: 'Warning',
    message: 'Your session will expire in 5 minutes.',
    duration: 0
  }
}`,...(R=(A=i.parameters)==null?void 0:A.docs)==null?void 0:R.source}}};var W,E,Y;c.parameters={...c.parameters,docs:{...(W=c.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    title: 'Info',
    message: 'New updates are available. Refresh to see the latest version.',
    duration: 0
  }
}`,...(Y=(E=c.parameters)==null?void 0:E.docs)==null?void 0:Y.source}}};var N,U,D;d.parameters={...d.parameters,docs:{...(N=d.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    message: 'Operation completed successfully.',
    duration: 0
  }
}`,...(D=(U=d.parameters)==null?void 0:U.docs)==null?void 0:D.source}}};var P,O,L;l.parameters={...l.parameters,docs:{...(P=l.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    title: 'Update Available',
    message: 'A new version is available.',
    action: {
      label: 'Update Now',
      onClick: () => alert('Updating...')
    },
    duration: 0
  }
}`,...(L=(O=l.parameters)==null?void 0:O.docs)==null?void 0:L.source}}};var M,Z,q;u.parameters={...u.parameters,docs:{...(M=u.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    title: 'Powered Up',
    message: 'Your account has been upgraded.',
    icon: <Zap size={20} />,
    duration: 0
  }
}`,...(q=(Z=u.parameters)==null?void 0:Z.docs)==null?void 0:q.source}}};var z,B,F;p.parameters={...p.parameters,docs:{...(z=p.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    title: 'Action Required',
    message: 'You must complete this step to continue.',
    closable: false,
    duration: 0
  }
}`,...(F=(B=p.parameters)==null?void 0:B.docs)==null?void 0:F.source}}};var H,V,_;m.parameters={...m.parameters,docs:{...(H=m.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    title: 'Detailed Information',
    message: 'This is a longer message that provides more detailed information about what happened. It might span multiple lines and should still be readable and well-formatted within the toast component.',
    duration: 0
  }
}`,...(_=(V=m.parameters)==null?void 0:V.docs)==null?void 0:_.source}}};var G,J,K;g.parameters={...g.parameters,docs:{...(G=g.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => {
    const [show, setShow] = useState(true);
    return <div>
        {show ? <Toast variant="success" message="This toast will auto-dismiss in 3 seconds" duration={3000} onClose={() => setShow(false)} /> : <button onClick={() => setShow(true)} style={{
        padding: '8px 16px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        cursor: 'pointer'
      }}>
            Show Toast Again
          </button>}
      </div>;
  }
}`,...(K=(J=g.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,X,$;v.parameters={...v.parameters,docs:{...(Q=v.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => <ToastContainer position="top-right">
      <Toast variant="success" title="Task Completed" message="Your task has been completed successfully." duration={0} />
      <Toast variant="info" title="New Message" message="You have a new message from Alice." duration={0} />
      <Toast variant="warning" message="Low disk space detected." duration={0} />
    </ToastContainer>
}`,...($=(X=v.parameters)==null?void 0:X.docs)==null?void 0:$.source}}};var ee,se,ae;f.parameters={...f.parameters,docs:{...(ee=f.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  }}>
      <Toast variant="success" title="Success" message="Operation completed successfully." duration={0} />
      <Toast variant="error" title="Error" message="Something went wrong." duration={0} />
      <Toast variant="warning" title="Warning" message="Please review your changes." duration={0} />
      <Toast variant="info" title="Info" message="Here's some helpful information." duration={0} />
    </div>
}`,...(ae=(se=f.parameters)==null?void 0:se.docs)==null?void 0:ae.source}}};var re,te,oe;x.parameters={...x.parameters,docs:{...(re=x.parameters)==null?void 0:re.docs,source:{originalSource:`{
  render: () => {
    const [toasts, setToasts] = useState<Array<{
      id: number;
      variant: any;
      message: string;
    }>>([]);
    let idCounter = 0;
    const addToast = (variant: any, message: string) => {
      const id = ++idCounter;
      setToasts(prev => [...prev, {
        id,
        variant,
        message
      }]);
    };
    const removeToast = (id: number) => {
      setToasts(prev => prev.filter(t => t.id !== id));
    };
    return <div>
        <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        flexWrap: 'wrap'
      }}>
          <button onClick={() => addToast('success', 'Success toast!')} style={{
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #4ade80',
          background: '#dcfce7',
          cursor: 'pointer'
        }}>
            Show Success
          </button>
          <button onClick={() => addToast('error', 'Error toast!')} style={{
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #f87171',
          background: '#fee2e2',
          cursor: 'pointer'
        }}>
            Show Error
          </button>
          <button onClick={() => addToast('warning', 'Warning toast!')} style={{
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #fbbf24',
          background: '#fef3c7',
          cursor: 'pointer'
        }}>
            Show Warning
          </button>
          <button onClick={() => addToast('info', 'Info toast!')} style={{
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #60a5fa',
          background: '#dbeafe',
          cursor: 'pointer'
        }}>
            Show Info
          </button>
        </div>
        <ToastContainer position="top-right">
          {toasts.map(toast => <Toast key={toast.id} variant={toast.variant} message={toast.message} duration={3000} onClose={() => removeToast(toast.id)} />)}
        </ToastContainer>
      </div>;
  }
}`,...(oe=(te=x.parameters)==null?void 0:te.docs)==null?void 0:oe.source}}};const ye=["Success","Error","Warning","Info","NoTitle","WithAction","CustomIcon","NotClosable","LongMessage","AutoDismiss","InContainer","AllVariants","InteractiveDemo"];export{f as AllVariants,g as AutoDismiss,u as CustomIcon,n as Error,v as InContainer,c as Info,x as InteractiveDemo,m as LongMessage,d as NoTitle,p as NotClosable,o as Success,i as Warning,l as WithAction,ye as __namedExportsOrder,Te as default};
