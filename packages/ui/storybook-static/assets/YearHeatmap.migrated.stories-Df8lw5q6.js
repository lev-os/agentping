import{Y as d}from"./year-heatmap-duSvQQt7.js";import"./iframe-rZoXeK5l.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CDN07tui.js";const g={title:"Migrations/WebUI/Root/YearHeatmap",component:d,parameters:{layout:"centered"},tags:["autodocs"]};function n(r){const o=[],a=new Date(r,0,1);for(;a.getFullYear()===r;){const c=a.toISOString().slice(0,10),s=a.getDay(),m=s>0&&s<6;o.push({date:c,value:Math.floor(m?Math.random()*10:Math.random()*3)}),a.setDate(a.getDate()+1)}return o}const e={args:{data:n(2025),year:2025}},t={args:{data:n(2024),year:2024,colorScale:["#1a1a2e","#16213e","#0f3460","#533483","#e94560"]}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    data: generateData(2025),
    year: 2025
  }
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    data: generateData(2024),
    year: 2024,
    colorScale: ["#1a1a2e", "#16213e", "#0f3460", "#533483", "#e94560"]
  }
}`,...t.parameters?.docs?.source}}};const f=["Default","CustomColors"];export{t as CustomColors,e as Default,f as __namedExportsOrder,g as default};
