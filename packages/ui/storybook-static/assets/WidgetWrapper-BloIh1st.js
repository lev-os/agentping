import{r,j as h}from"./iframe-CzJrb7DT.js";function m(e){return e<300?"compact":e<500?"standard":"expanded"}function s({widgetId:e,children:d,className:o}){const t=r.useRef(null),[n,c]=r.useState({width:400,height:300});r.useEffect(()=>{if(!t.current)return;const a=new ResizeObserver(p=>{for(const l of p){const{width:u,height:f}=l.contentRect;c({width:u,height:f})}});return a.observe(t.current),()=>a.disconnect()},[]);const i=m(n.width);return h.jsx("div",{ref:t,"data-widget-id":e,"data-variant":i,className:o??"h-full w-full",style:{containerType:"inline-size"},children:d({variant:i,containerWidth:n.width,containerHeight:n.height})})}try{s.displayName="WidgetWrapper",s.__docgenInfo={description:`WidgetWrapper - Provides responsive variant detection via ResizeObserver

Uses ResizeObserver to detect container width and provide variant context.
CSS container queries handle layout; this sets data-variant for React logic.

Variants:
- compact: <300px width (mobile, sidebar widgets)
- standard: 300-500px width (medium cards)
- expanded: >500px width (full-size panels)`,displayName:"WidgetWrapper",props:{widgetId:{defaultValue:null,description:"",name:"widgetId",required:!0,type:{name:"string"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}export{s as W};
