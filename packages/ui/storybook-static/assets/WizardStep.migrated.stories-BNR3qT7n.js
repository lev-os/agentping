import{W as r}from"./wizard-step-B5MU7eeZ.js";import"./iframe-rZoXeK5l.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CDN07tui.js";const p={title:"Migrations/WebUI/Root/WizardStep",component:r,parameters:{layout:"centered"},tags:["autodocs"]},e={args:{title:"Configure API Keys",description:"Enter your API credentials to connect to external services.",stepNumber:2,totalSteps:4,isFirst:!1,isLast:!1}},t={args:{title:"Welcome",description:"Let's get started with your setup.",stepNumber:1,totalSteps:3,isFirst:!0,isLast:!1}},s={args:{title:"Review & Deploy",description:"Confirm your settings and deploy.",stepNumber:3,totalSteps:3,isFirst:!1,isLast:!0}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Configure API Keys",
    description: "Enter your API credentials to connect to external services.",
    stepNumber: 2,
    totalSteps: 4,
    isFirst: false,
    isLast: false
  }
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Welcome",
    description: "Let's get started with your setup.",
    stepNumber: 1,
    totalSteps: 3,
    isFirst: true,
    isLast: false
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Review & Deploy",
    description: "Confirm your settings and deploy.",
    stepNumber: 3,
    totalSteps: 3,
    isFirst: false,
    isLast: true
  }
}`,...s.parameters?.docs?.source}}};const c=["Default","FirstStep","LastStep"];export{e as Default,t as FirstStep,s as LastStep,c as __namedExportsOrder,p as default};
