import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{r as l}from"./index-BNURykns.js";import{X as xe}from"./x-BAbVpizD.js";import{I as be}from"./info-B5XUCa8E.js";import{T as he}from"./triangle-alert-Dqss0hRc.js";import{C as we}from"./circle-x-BZUptzyg.js";import{C as Te}from"./circle-check-big-DdlYkAcn.js";import{Z as ye}from"./zap--N__6G4c.js";import"./createLucideIcon-e4Yg_r7P.js";const Se={success:{icon:e.jsx(Te,{size:20}),className:"ui-toast--success"},error:{icon:e.jsx(we,{size:20}),className:"ui-toast--error"},warning:{icon:e.jsx(he,{size:20}),className:"ui-toast--warning"},info:{icon:e.jsx(be,{size:20}),className:"ui-toast--info"}};function s({variant:o="info",title:a,message:S,duration:r=5e3,onClose:i,icon:t,action:n,closable:c=!0}){const[C,me]=l.useState(!0),[ge,fe]=l.useState(!1);l.useEffect(()=>{if(r>0){const ve=setTimeout(()=>{k()},r);return()=>clearTimeout(ve)}},[r]);const k=()=>{fe(!0),setTimeout(()=>{me(!1),i==null||i()},300)};if(!C)return null;const I=Se[o];return e.jsxs("div",{className:`ui-toast ${I.className} ${ge?"ui-toast--exiting":""}`,role:"alert","aria-live":"polite",children:[e.jsx("div",{className:"ui-toast-icon",children:t||I.icon}),e.jsxs("div",{className:"ui-toast-content",children:[a&&e.jsx("div",{className:"ui-toast-title",children:a}),e.jsx("div",{className:"ui-toast-message",children:S}),n&&e.jsx("button",{className:"ui-toast-action",onClick:n.onClick,children:n.label})]}),c&&e.jsx("button",{className:"ui-toast-close",onClick:k,"aria-label":"Close notification",children:e.jsx(xe,{size:16})})]})}function j({position:o="top-right",children:a}){return e.jsx("div",{className:`ui-toast-container ui-toast-container--${o}`,children:a})}s.__docgenInfo={description:"",methods:[],displayName:"Toast",props:{id:{required:!1,tsType:{name:"string"},description:""},variant:{required:!1,tsType:{name:"union",raw:"'success' | 'error' | 'warning' | 'info'",elements:[{name:"literal",value:"'success'"},{name:"literal",value:"'error'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'info'"}]},description:"",defaultValue:{value:"'info'",computed:!1}},title:{required:!1,tsType:{name:"string"},description:""},message:{required:!0,tsType:{name:"string"},description:""},duration:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"5000",computed:!1}},onClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},icon:{required:!1,tsType:{name:"ReactNode"},description:""},action:{required:!1,tsType:{name:"signature",type:"object",raw:`{
    label: string;
    onClick: () => void;
}`,signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"onClick",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!0}}]}},description:""},closable:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}}}};j.__docgenInfo={description:"",methods:[],displayName:"ToastContainer",props:{position:{required:!1,tsType:{name:"union",raw:"'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'",elements:[{name:"literal",value:"'top-right'"},{name:"literal",value:"'top-left'"},{name:"literal",value:"'bottom-right'"},{name:"literal",value:"'bottom-left'"},{name:"literal",value:"'top-center'"},{name:"literal",value:"'bottom-center'"}]},description:"",defaultValue:{value:"'top-right'",computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const We={title:"UI/Toast",component:s,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["success","error","warning","info"],description:"Toast variant style"},duration:{control:"number",description:"Auto-dismiss duration in ms (0 = no auto-dismiss)"},closable:{control:"boolean",description:"Show close button"}}},d={args:{variant:"success",title:"Success",message:"Your changes have been saved successfully.",duration:0}},u={args:{variant:"error",title:"Error",message:"Failed to save changes. Please try again.",duration:0}},p={args:{variant:"warning",title:"Warning",message:"Your session will expire in 5 minutes.",duration:0}},m={args:{variant:"info",title:"Info",message:"New updates are available. Refresh to see the latest version.",duration:0}},g={args:{variant:"success",message:"Operation completed successfully.",duration:0}},f={args:{variant:"info",title:"Update Available",message:"A new version is available.",action:{label:"Update Now",onClick:()=>alert("Updating...")},duration:0}},v={args:{variant:"success",title:"Powered Up",message:"Your account has been upgraded.",icon:e.jsx(ye,{size:20}),duration:0}},x={args:{variant:"warning",title:"Action Required",message:"You must complete this step to continue.",closable:!1,duration:0}},b={args:{variant:"info",title:"Detailed Information",message:"This is a longer message that provides more detailed information about what happened. It might span multiple lines and should still be readable and well-formatted within the toast component.",duration:0}},h={render:()=>{const[o,a]=l.useState(!0);return e.jsx("div",{children:o?e.jsx(s,{variant:"success",message:"This toast will auto-dismiss in 3 seconds",duration:3e3,onClose:()=>a(!1)}):e.jsx("button",{onClick:()=>a(!0),style:{padding:"8px 16px",borderRadius:"4px",border:"1px solid #ccc",cursor:"pointer"},children:"Show Toast Again"})})}},w={render:()=>e.jsxs(j,{position:"top-right",children:[e.jsx(s,{variant:"success",title:"Task Completed",message:"Your task has been completed successfully.",duration:0}),e.jsx(s,{variant:"info",title:"New Message",message:"You have a new message from Alice.",duration:0}),e.jsx(s,{variant:"warning",message:"Low disk space detected.",duration:0})]})},T={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsx(s,{variant:"success",title:"Success",message:"Operation completed successfully.",duration:0}),e.jsx(s,{variant:"error",title:"Error",message:"Something went wrong.",duration:0}),e.jsx(s,{variant:"warning",title:"Warning",message:"Please review your changes.",duration:0}),e.jsx(s,{variant:"info",title:"Info",message:"Here's some helpful information.",duration:0})]})},y={render:()=>{const[o,a]=l.useState([]);let S=0;const r=(t,n)=>{const c=++S;a(C=>[...C,{id:c,variant:t,message:n}])},i=t=>{a(n=>n.filter(c=>c.id!==t))};return e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",gap:"8px",marginBottom:"16px",flexWrap:"wrap"},children:[e.jsx("button",{onClick:()=>r("success","Success toast!"),style:{padding:"8px 12px",borderRadius:"4px",border:"1px solid #4ade80",background:"#dcfce7",cursor:"pointer"},children:"Show Success"}),e.jsx("button",{onClick:()=>r("error","Error toast!"),style:{padding:"8px 12px",borderRadius:"4px",border:"1px solid #f87171",background:"#fee2e2",cursor:"pointer"},children:"Show Error"}),e.jsx("button",{onClick:()=>r("warning","Warning toast!"),style:{padding:"8px 12px",borderRadius:"4px",border:"1px solid #fbbf24",background:"#fef3c7",cursor:"pointer"},children:"Show Warning"}),e.jsx("button",{onClick:()=>r("info","Info toast!"),style:{padding:"8px 12px",borderRadius:"4px",border:"1px solid #60a5fa",background:"#dbeafe",cursor:"pointer"},children:"Show Info"})]}),e.jsx(j,{position:"top-right",children:o.map(t=>e.jsx(s,{variant:t.variant,message:t.message,duration:3e3,onClose:()=>i(t.id)},t.id))})]})}};var N,A,R;d.parameters={...d.parameters,docs:{...(N=d.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    title: 'Success',
    message: 'Your changes have been saved successfully.',
    duration: 0
  }
}`,...(R=(A=d.parameters)==null?void 0:A.docs)==null?void 0:R.source}}};var E,q,W;u.parameters={...u.parameters,docs:{...(E=u.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    variant: 'error',
    title: 'Error',
    message: 'Failed to save changes. Please try again.',
    duration: 0
  }
}`,...(W=(q=u.parameters)==null?void 0:q.docs)==null?void 0:W.source}}};var Y,U,V;p.parameters={...p.parameters,docs:{...(Y=p.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    title: 'Warning',
    message: 'Your session will expire in 5 minutes.',
    duration: 0
  }
}`,...(V=(U=p.parameters)==null?void 0:U.docs)==null?void 0:V.source}}};var D,z,_;m.parameters={...m.parameters,docs:{...(D=m.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    title: 'Info',
    message: 'New updates are available. Refresh to see the latest version.',
    duration: 0
  }
}`,...(_=(z=m.parameters)==null?void 0:z.docs)==null?void 0:_.source}}};var P,L,O;g.parameters={...g.parameters,docs:{...(P=g.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    message: 'Operation completed successfully.',
    duration: 0
  }
}`,...(O=(L=g.parameters)==null?void 0:L.docs)==null?void 0:O.source}}};var M,$,B;f.parameters={...f.parameters,docs:{...(M=f.parameters)==null?void 0:M.docs,source:{originalSource:`{
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
}`,...(B=($=f.parameters)==null?void 0:$.docs)==null?void 0:B.source}}};var Z,F,H;v.parameters={...v.parameters,docs:{...(Z=v.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    title: 'Powered Up',
    message: 'Your account has been upgraded.',
    icon: <Zap size={20} />,
    duration: 0
  }
}`,...(H=(F=v.parameters)==null?void 0:F.docs)==null?void 0:H.source}}};var X,G,J;x.parameters={...x.parameters,docs:{...(X=x.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    title: 'Action Required',
    message: 'You must complete this step to continue.',
    closable: false,
    duration: 0
  }
}`,...(J=(G=x.parameters)==null?void 0:G.docs)==null?void 0:J.source}}};var K,Q,ee;b.parameters={...b.parameters,docs:{...(K=b.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    title: 'Detailed Information',
    message: 'This is a longer message that provides more detailed information about what happened. It might span multiple lines and should still be readable and well-formatted within the toast component.',
    duration: 0
  }
}`,...(ee=(Q=b.parameters)==null?void 0:Q.docs)==null?void 0:ee.source}}};var se,ae,te;h.parameters={...h.parameters,docs:{...(se=h.parameters)==null?void 0:se.docs,source:{originalSource:`{
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
}`,...(te=(ae=h.parameters)==null?void 0:ae.docs)==null?void 0:te.source}}};var re,oe,ne;w.parameters={...w.parameters,docs:{...(re=w.parameters)==null?void 0:re.docs,source:{originalSource:`{
  render: () => <ToastContainer position="top-right">
      <Toast variant="success" title="Task Completed" message="Your task has been completed successfully." duration={0} />
      <Toast variant="info" title="New Message" message="You have a new message from Alice." duration={0} />
      <Toast variant="warning" message="Low disk space detected." duration={0} />
    </ToastContainer>
}`,...(ne=(oe=w.parameters)==null?void 0:oe.docs)==null?void 0:ne.source}}};var ie,ce,le;T.parameters={...T.parameters,docs:{...(ie=T.parameters)==null?void 0:ie.docs,source:{originalSource:`{
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
}`,...(le=(ce=T.parameters)==null?void 0:ce.docs)==null?void 0:le.source}}};var de,ue,pe;y.parameters={...y.parameters,docs:{...(de=y.parameters)==null?void 0:de.docs,source:{originalSource:`{
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
}`,...(pe=(ue=y.parameters)==null?void 0:ue.docs)==null?void 0:pe.source}}};const Ye=["Success","Error","Warning","Info","NoTitle","WithAction","CustomIcon","NotClosable","LongMessage","AutoDismiss","InContainer","AllVariants","InteractiveDemo"];export{T as AllVariants,h as AutoDismiss,v as CustomIcon,u as Error,w as InContainer,m as Info,y as InteractiveDemo,b as LongMessage,g as NoTitle,x as NotClosable,d as Success,p as Warning,f as WithAction,Ye as __namedExportsOrder,We as default};
