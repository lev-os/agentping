import{j as r}from"./iframe-rZoXeK5l.js";import{E as n}from"./EntityForm-B3iVHNGn.js";import{m as s,a as e}from"./mock-crud-decorator-B3Qu2xkx.js";import{C as i}from"./context-B7dRIH3-.js";import"./preload-helper-PPVm8Dsz.js";import"./FieldRenderer-BVhlFiYP.js";import"./input-Bv_grbQj.js";import"./utils-CDN07tui.js";import"./textarea-gT2HoxmG.js";import"./label-DBRaLFZd.js";import"./index-DJNgIyCh.js";import"./index-p5YmI0II.js";import"./index-fvHFeWab.js";import"./index-DBhjKPQa.js";import"./index-DqYXjM1N.js";import"./index-B_jtOnfb.js";const h={title:"Migrations/Canonical/Recipes/EntityForm",component:n,tags:["autodocs"],decorators:[o=>r.jsx(i,{config:e,initialItems:s,children:r.jsx(o,{})})]},t={args:{onSubmit:async o=>{console.log("submit",o)}}},a={args:{initialData:{name:"Agent Alpha",status:"active"},onSubmit:async o=>{console.log("submit",o)},onCancel:()=>{console.log("cancel")}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    onSubmit: async data => {
      console.log("submit", data);
    }
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    initialData: {
      name: "Agent Alpha",
      status: "active"
    },
    onSubmit: async data => {
      console.log("submit", data);
    },
    onCancel: () => {
      console.log("cancel");
    }
  }
}`,...a.parameters?.docs?.source}}};const v=["Create","Edit"];export{t as Create,a as Edit,v as __namedExportsOrder,h as default};
