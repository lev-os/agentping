import{j as a}from"./iframe-rZoXeK5l.js";import{c as d}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function r({points:e=[],height:s=300,className:l}){return a.jsxs("div",{className:d("border border-border rounded-md bg-card overflow-hidden relative",l),style:{height:s},children:[a.jsx("div",{className:"absolute inset-0 flex items-center justify-center",children:a.jsxs("div",{className:"text-sm text-muted-foreground",children:[e.length," location",e.length!==1?"s":""]})}),a.jsxs("div",{className:"absolute bottom-2 left-2 flex flex-wrap gap-1",children:[e.slice(0,5).map((n,o)=>a.jsx("span",{className:"text-[10px] bg-muted px-1.5 py-0.5 rounded text-foreground",children:n.label??`${n.lat.toFixed(1)}, ${n.lng.toFixed(1)}`},o)),e.length>5&&a.jsxs("span",{className:"text-[10px] text-muted-foreground",children:["+",e.length-5," more"]})]})]})}try{r.displayName="GeoRequestMap",r.__docgenInfo={description:"GeoRequestMap - Migrated from",displayName:"GeoRequestMap",props:{points:{defaultValue:{value:"[]"},description:"",name:"points",required:!1,type:{name:"GeoLocation[]"}},height:{defaultValue:{value:"300"},description:"",name:"height",required:!1,type:{name:"number"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const u={title:"Migrations/WebUI/GeoRequestMap",component:r,tags:["autodocs"]},t={args:{points:[{lat:37.7749,lng:-122.4194,label:"San Francisco"},{lat:40.7128,lng:-74.006,label:"New York"},{lat:51.5074,lng:-.1278,label:"London"}]}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    points: [{
      lat: 37.7749,
      lng: -122.4194,
      label: "San Francisco"
    }, {
      lat: 40.7128,
      lng: -74.006,
      label: "New York"
    }, {
      lat: 51.5074,
      lng: -0.1278,
      label: "London"
    }]
  }
}`,...t.parameters?.docs?.source}}};const p=["Default"];export{t as Default,p as __namedExportsOrder,u as default};
