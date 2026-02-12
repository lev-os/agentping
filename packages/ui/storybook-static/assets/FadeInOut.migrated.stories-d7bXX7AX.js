import{r as f,j as r,b as g}from"./iframe-rZoXeK5l.js";import{c as s}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function b({show:e,children:t,duration:a=200,className:n}){const[o,i]=f.useState(e);f.useEffect(()=>{e&&i(!0)},[e]);const u=()=>{e||i(!1)};return o?r.jsx("div",{className:s(e?"animate-in fade-in-0":"animate-out fade-out-0",n),style:{animationDuration:`${a}ms`},onAnimationEnd:u,children:t}):null}function h({items:e,renderItem:t,keyExtractor:a,staggerDelay:n=50,initialDelay:o=0,className:i,itemClassName:u}){return r.jsx("div",{className:s("flex flex-col",i),children:e.map((l,y)=>r.jsx("div",{className:s("animate-in fade-in-0 slide-in-from-bottom-2",u),style:{animationDelay:`${o+y*n}ms`,animationFillMode:"backwards"},children:t(l,y)},a(l,y)))})}const _={primary:"bg-primary",success:"bg-emerald-500",warning:"bg-amber-500",error:"bg-destructive",info:"bg-cyan-500"},x={sm:"h-1.5 w-1.5",default:"h-2 w-2",lg:"h-3 w-3"};function v({variant:e="primary",size:t="default",className:a,label:n}){return r.jsxs("span",{className:s("relative inline-flex",x[t],a),role:"status","aria-label":n||`${e} status indicator`,children:[r.jsx("span",{className:s("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",_[e])}),r.jsx("span",{className:s("relative inline-flex rounded-full h-full w-full",_[e])})]})}function N({activeIndex:e,tabCount:t,containerRef:a,className:n}){const[o,i]=f.useState({});return f.useLayoutEffect(()=>{if(!a.current)return;const l=a.current.querySelectorAll('[role="tab"]')[e];l&&i({width:l.offsetWidth,transform:`translateX(${l.offsetLeft}px)`})},[e,a,t]),r.jsx("span",{className:s("absolute bottom-0 h-0.5 bg-primary transition-all duration-200",n),style:o})}try{b.displayName="FadeInOut",b.__docgenInfo={description:"",displayName:"FadeInOut",props:{show:{defaultValue:null,description:"Whether the content is visible",name:"show",required:!0,type:{name:"boolean"}},children:{defaultValue:null,description:"Content to animate",name:"children",required:!0,type:{name:"ReactNode"}},duration:{defaultValue:{value:"200"},description:"Duration in ms (default: 200)",name:"duration",required:!1,type:{name:"number"}},className:{defaultValue:null,description:"Custom class",name:"className",required:!1,type:{name:"string"}}}}}catch{}try{h.displayName="AnimatedList",h.__docgenInfo={description:"",displayName:"AnimatedList",props:{items:{defaultValue:null,description:"Items to render",name:"items",required:!0,type:{name:"T[]"}},renderItem:{defaultValue:null,description:"Render function for each item",name:"renderItem",required:!0,type:{name:"(item: T, index: number) => ReactNode"}},keyExtractor:{defaultValue:null,description:"Key extractor function",name:"keyExtractor",required:!0,type:{name:"(item: T, index: number) => string"}},staggerDelay:{defaultValue:{value:"50"},description:"Stagger delay in ms (default: 50)",name:"staggerDelay",required:!1,type:{name:"number"}},initialDelay:{defaultValue:{value:"0"},description:"Initial delay in ms (default: 0)",name:"initialDelay",required:!1,type:{name:"number"}},className:{defaultValue:null,description:"Container class",name:"className",required:!1,type:{name:"string"}},itemClassName:{defaultValue:null,description:"Item container class",name:"itemClassName",required:!1,type:{name:"string"}}}}}catch{}try{v.displayName="PulsingDot",v.__docgenInfo={description:"",displayName:"PulsingDot",props:{variant:{defaultValue:{value:"primary"},description:"Color variant",name:"variant",required:!1,type:{name:"enum",value:[{value:'"success"'},{value:'"warning"'},{value:'"error"'},{value:'"info"'},{value:'"primary"'}]}},size:{defaultValue:{value:"default"},description:"Size variant",name:"size",required:!1,type:{name:"enum",value:[{value:'"default"'},{value:'"sm"'},{value:'"lg"'}]}},className:{defaultValue:null,description:"Custom class",name:"className",required:!1,type:{name:"string"}},label:{defaultValue:null,description:"Accessible label",name:"label",required:!1,type:{name:"string"}}}}}catch{}try{N.displayName="AnimatedTabIndicator",N.__docgenInfo={description:"",displayName:"AnimatedTabIndicator",props:{activeIndex:{defaultValue:null,description:"Active tab index",name:"activeIndex",required:!0,type:{name:"number"}},tabCount:{defaultValue:null,description:"Total number of tabs",name:"tabCount",required:!0,type:{name:"number"}},containerRef:{defaultValue:null,description:"Tab container ref for measuring",name:"containerRef",required:!0,type:{name:"RefObject<HTMLElement>"}},className:{defaultValue:null,description:"Custom class",name:"className",required:!1,type:{name:"string"}}}}}catch{}const V={title:"Migrations/WebUI/Sofia/FadeInOut",component:b,tags:["autodocs"],argTypes:{show:{control:"boolean"},duration:{control:{type:"number",min:50,max:2e3,step:50}}}},d={args:{show:!0,children:"Hello, I fade in and out!"}},c={args:{show:!1,children:"You can't see me"}},m={args:{show:!0,duration:400,children:g.createElement("div",{style:{padding:"1rem",borderRadius:"0.5rem",background:"linear-gradient(135deg, #1e293b 0%, #334155 100%)",color:"#e2e8f0",fontFamily:"monospace"}},g.createElement("h3",{style:{margin:"0 0 0.5rem"}},"Notification"),g.createElement("p",{style:{margin:0,opacity:.8}},"Agent task completed successfully."))}},p={args:{show:!0,duration:1e3,children:"I fade in slowly over 1 second"}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    show: true,
    children: "Hello, I fade in and out!"
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    show: false,
    children: "You can't see me"
  }
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    show: true,
    duration: 400,
    children: React.createElement("div", {
      style: {
        padding: "1rem",
        borderRadius: "0.5rem",
        background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
        color: "#e2e8f0",
        fontFamily: "monospace"
      }
    }, React.createElement("h3", {
      style: {
        margin: "0 0 0.5rem"
      }
    }, "Notification"), React.createElement("p", {
      style: {
        margin: 0,
        opacity: 0.8
      }
    }, "Agent task completed successfully."))
  }
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    show: true,
    duration: 1000,
    children: "I fade in slowly over 1 second"
  }
}`,...p.parameters?.docs?.source}}};const E=["Default","Hidden","WithContent","SlowFade"];export{d as Default,c as Hidden,p as SlowFade,m as WithContent,E as __namedExportsOrder,V as default};
