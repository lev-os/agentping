import{D as a}from"./data-pipeline-DRJkZrH2.js";import"./iframe-rZoXeK5l.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CDN07tui.js";const i={title:"Migrations/WebUI/Data/DataPipeline",component:a,parameters:{layout:"centered"},tags:["autodocs"]},t={args:{title:"ETL Pipeline",stages:[{id:"ingest",name:"Ingest",status:"success",throughput:"1.2k/s"},{id:"transform",name:"Transform",status:"running",throughput:"800/s"},{id:"validate",name:"Validate",status:"idle"},{id:"load",name:"Load",status:"idle"}]}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    title: "ETL Pipeline",
    stages: [{
      id: "ingest",
      name: "Ingest",
      status: "success",
      throughput: "1.2k/s"
    }, {
      id: "transform",
      name: "Transform",
      status: "running",
      throughput: "800/s"
    }, {
      id: "validate",
      name: "Validate",
      status: "idle"
    }, {
      id: "load",
      name: "Load",
      status: "idle"
    }]
  }
}`,...t.parameters?.docs?.source}}};const o=["Default"];export{t as Default,o as __namedExportsOrder,i as default};
