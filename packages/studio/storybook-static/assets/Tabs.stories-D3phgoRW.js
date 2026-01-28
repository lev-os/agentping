import{j as a}from"./jsx-runtime-BjG_zV1W.js";import{T as n,a as s,b as e,c as i}from"./Tabs-DWG1meoA.js";import"./index-BNURykns.js";const E={title:"UI/Tabs",component:n,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{defaultTab:{control:"text",description:"Initial active tab ID"}}},d={render:()=>a.jsxs(n,{defaultTab:"tab1",children:[a.jsxs(s,{"aria-label":"Basic tabs example",children:[a.jsx(e,{id:"tab1",children:"First Tab"}),a.jsx(e,{id:"tab2",children:"Second Tab"}),a.jsx(e,{id:"tab3",children:"Third Tab"})]}),a.jsx(i,{id:"tab1",children:a.jsx("p",{children:"Content for the first tab"})}),a.jsx(i,{id:"tab2",children:a.jsx("p",{children:"Content for the second tab"})}),a.jsx(i,{id:"tab3",children:a.jsx("p",{children:"Content for the third tab"})})]})},t={render:()=>a.jsxs(n,{defaultTab:"notifications",children:[a.jsxs(s,{"aria-label":"Tabs with badges",children:[a.jsx(e,{id:"notifications",badge:5,children:"Notifications"}),a.jsx(e,{id:"messages",badge:12,children:"Messages"}),a.jsx(e,{id:"settings",badge:0,children:"Settings"})]}),a.jsx(i,{id:"notifications",children:a.jsx("p",{children:"You have 5 notifications"})}),a.jsx(i,{id:"messages",children:a.jsx("p",{children:"You have 12 unread messages"})}),a.jsx(i,{id:"settings",children:a.jsx("p",{children:"No pending settings"})})]})},r={render:()=>a.jsxs(n,{defaultTab:"errors",children:[a.jsxs(s,{"aria-label":"Tabs with warning badges",children:[a.jsx(e,{id:"info",badge:3,children:"Info"}),a.jsx(e,{id:"warnings",badge:7,badgeVariant:"warning",children:"Warnings"}),a.jsx(e,{id:"errors",badge:2,badgeVariant:"warning",children:"Errors"})]}),a.jsx(i,{id:"info",children:a.jsx("p",{children:"3 informational messages"})}),a.jsx(i,{id:"warnings",children:a.jsx("p",{children:"7 warnings detected"})}),a.jsx(i,{id:"errors",children:a.jsx("p",{children:"2 errors need attention"})})]})},l={render:()=>a.jsxs(n,{defaultTab:"active",children:[a.jsxs(s,{"aria-label":"Tabs with disabled state",children:[a.jsx(e,{id:"active",children:"Active"}),a.jsx(e,{id:"disabled",disabled:!0,children:"Disabled"}),a.jsx(e,{id:"available",children:"Available"})]}),a.jsx(i,{id:"active",children:a.jsx("p",{children:"This tab is active"})}),a.jsx(i,{id:"disabled",children:a.jsx("p",{children:"This content cannot be accessed"})}),a.jsx(i,{id:"available",children:a.jsx("p",{children:"This tab is available"})})]})},b={render:()=>a.jsxs(n,{defaultTab:"profile",children:[a.jsxs(s,{"aria-label":"Profile tabs",children:[a.jsx(e,{id:"profile",children:"Profile"}),a.jsx(e,{id:"settings",children:"Settings"}),a.jsx(e,{id:"notifications",badge:3,children:"Notifications"}),a.jsx(e,{id:"code",children:"Code"})]}),a.jsx(i,{id:"profile",children:a.jsxs("div",{style:{padding:"16px",minWidth:"400px"},children:[a.jsx("h3",{children:"User Profile"}),a.jsx("p",{children:"Name: John Doe"}),a.jsx("p",{children:"Email: john@example.com"})]})}),a.jsx(i,{id:"settings",children:a.jsxs("div",{style:{padding:"16px",minWidth:"400px"},children:[a.jsx("h3",{children:"Settings"}),a.jsxs("label",{children:[a.jsx("input",{type:"checkbox"})," Enable notifications"]}),a.jsx("br",{}),a.jsxs("label",{children:[a.jsx("input",{type:"checkbox"})," Dark mode"]})]})}),a.jsx(i,{id:"notifications",children:a.jsxs("div",{style:{padding:"16px",minWidth:"400px"},children:[a.jsx("h3",{children:"Notifications (3)"}),a.jsxs("ul",{children:[a.jsx("li",{children:"New message from Alice"}),a.jsx("li",{children:"System update available"}),a.jsx("li",{children:"Task completed successfully"})]})]})}),a.jsx(i,{id:"code",children:a.jsxs("div",{style:{padding:"16px",minWidth:"400px"},children:[a.jsx("h3",{children:"Code Snippet"}),a.jsx("pre",{style:{background:"#f5f5f5",padding:"8px",borderRadius:"4px"},children:a.jsx("code",{children:`function hello() {
  console.log("Hello, World!");
}`})})]})})]})},o={render:()=>a.jsxs("div",{children:[a.jsx("p",{style:{marginBottom:"16px",fontSize:"14px",color:"#666"},children:"Use Arrow Left/Right, Home, and End keys to navigate tabs"}),a.jsxs(n,{defaultTab:"tab1",children:[a.jsxs(s,{"aria-label":"Keyboard navigation example",children:[a.jsx(e,{id:"tab1",children:"Tab 1"}),a.jsx(e,{id:"tab2",children:"Tab 2"}),a.jsx(e,{id:"tab3",children:"Tab 3"}),a.jsx(e,{id:"tab4",children:"Tab 4"}),a.jsx(e,{id:"tab5",children:"Tab 5"})]}),a.jsx(i,{id:"tab1",children:"Content 1"}),a.jsx(i,{id:"tab2",children:"Content 2"}),a.jsx(i,{id:"tab3",children:"Content 3"}),a.jsx(i,{id:"tab4",children:"Content 4"}),a.jsx(i,{id:"tab5",children:"Content 5"})]})]})};var c,T,h;d.parameters={...d.parameters,docs:{...(c=d.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => <Tabs defaultTab="tab1">
      <TabList aria-label="Basic tabs example">
        <Tab id="tab1">First Tab</Tab>
        <Tab id="tab2">Second Tab</Tab>
        <Tab id="tab3">Third Tab</Tab>
      </TabList>
      <TabPanel id="tab1">
        <p>Content for the first tab</p>
      </TabPanel>
      <TabPanel id="tab2">
        <p>Content for the second tab</p>
      </TabPanel>
      <TabPanel id="tab3">
        <p>Content for the third tab</p>
      </TabPanel>
    </Tabs>
}`,...(h=(T=d.parameters)==null?void 0:T.docs)==null?void 0:h.source}}};var p,x,g;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <Tabs defaultTab="notifications">
      <TabList aria-label="Tabs with badges">
        <Tab id="notifications" badge={5}>Notifications</Tab>
        <Tab id="messages" badge={12}>Messages</Tab>
        <Tab id="settings" badge={0}>Settings</Tab>
      </TabList>
      <TabPanel id="notifications">
        <p>You have 5 notifications</p>
      </TabPanel>
      <TabPanel id="messages">
        <p>You have 12 unread messages</p>
      </TabPanel>
      <TabPanel id="settings">
        <p>No pending settings</p>
      </TabPanel>
    </Tabs>
}`,...(g=(x=t.parameters)==null?void 0:x.docs)==null?void 0:g.source}}};var j,f,m;r.parameters={...r.parameters,docs:{...(j=r.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <Tabs defaultTab="errors">
      <TabList aria-label="Tabs with warning badges">
        <Tab id="info" badge={3}>Info</Tab>
        <Tab id="warnings" badge={7} badgeVariant="warning">Warnings</Tab>
        <Tab id="errors" badge={2} badgeVariant="warning">Errors</Tab>
      </TabList>
      <TabPanel id="info">
        <p>3 informational messages</p>
      </TabPanel>
      <TabPanel id="warnings">
        <p>7 warnings detected</p>
      </TabPanel>
      <TabPanel id="errors">
        <p>2 errors need attention</p>
      </TabPanel>
    </Tabs>
}`,...(m=(f=r.parameters)==null?void 0:f.docs)==null?void 0:m.source}}};var u,P,v;l.parameters={...l.parameters,docs:{...(u=l.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <Tabs defaultTab="active">
      <TabList aria-label="Tabs with disabled state">
        <Tab id="active">Active</Tab>
        <Tab id="disabled" disabled>Disabled</Tab>
        <Tab id="available">Available</Tab>
      </TabList>
      <TabPanel id="active">
        <p>This tab is active</p>
      </TabPanel>
      <TabPanel id="disabled">
        <p>This content cannot be accessed</p>
      </TabPanel>
      <TabPanel id="available">
        <p>This tab is available</p>
      </TabPanel>
    </Tabs>
}`,...(v=(P=l.parameters)==null?void 0:P.docs)==null?void 0:v.source}}};var y,w,C;b.parameters={...b.parameters,docs:{...(y=b.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <Tabs defaultTab="profile">
      <TabList aria-label="Profile tabs">
        <Tab id="profile">
          Profile
        </Tab>
        <Tab id="settings">
          Settings
        </Tab>
        <Tab id="notifications" badge={3}>
          Notifications
        </Tab>
        <Tab id="code">
          Code
        </Tab>
      </TabList>
      <TabPanel id="profile">
        <div style={{
        padding: '16px',
        minWidth: '400px'
      }}>
          <h3>User Profile</h3>
          <p>Name: John Doe</p>
          <p>Email: john@example.com</p>
        </div>
      </TabPanel>
      <TabPanel id="settings">
        <div style={{
        padding: '16px',
        minWidth: '400px'
      }}>
          <h3>Settings</h3>
          <label>
            <input type="checkbox" /> Enable notifications
          </label>
          <br />
          <label>
            <input type="checkbox" /> Dark mode
          </label>
        </div>
      </TabPanel>
      <TabPanel id="notifications">
        <div style={{
        padding: '16px',
        minWidth: '400px'
      }}>
          <h3>Notifications (3)</h3>
          <ul>
            <li>New message from Alice</li>
            <li>System update available</li>
            <li>Task completed successfully</li>
          </ul>
        </div>
      </TabPanel>
      <TabPanel id="code">
        <div style={{
        padding: '16px',
        minWidth: '400px'
      }}>
          <h3>Code Snippet</h3>
          <pre style={{
          background: '#f5f5f5',
          padding: '8px',
          borderRadius: '4px'
        }}>
            <code>{\`function hello() {\\n  console.log("Hello, World!");\\n}\`}</code>
          </pre>
        </div>
      </TabPanel>
    </Tabs>
}`,...(C=(w=b.parameters)==null?void 0:w.docs)==null?void 0:C.source}}};var S,W,L;o.parameters={...o.parameters,docs:{...(S=o.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => <div>
      <p style={{
      marginBottom: '16px',
      fontSize: '14px',
      color: '#666'
    }}>
        Use Arrow Left/Right, Home, and End keys to navigate tabs
      </p>
      <Tabs defaultTab="tab1">
        <TabList aria-label="Keyboard navigation example">
          <Tab id="tab1">Tab 1</Tab>
          <Tab id="tab2">Tab 2</Tab>
          <Tab id="tab3">Tab 3</Tab>
          <Tab id="tab4">Tab 4</Tab>
          <Tab id="tab5">Tab 5</Tab>
        </TabList>
        <TabPanel id="tab1">Content 1</TabPanel>
        <TabPanel id="tab2">Content 2</TabPanel>
        <TabPanel id="tab3">Content 3</TabPanel>
        <TabPanel id="tab4">Content 4</TabPanel>
        <TabPanel id="tab5">Content 5</TabPanel>
      </Tabs>
    </div>
}`,...(L=(W=o.parameters)==null?void 0:W.docs)==null?void 0:L.source}}};const D=["Basic","WithBadges","WithWarningBadge","WithDisabledTab","RichContent","KeyboardNavigation"];export{d as Basic,o as KeyboardNavigation,b as RichContent,t as WithBadges,l as WithDisabledTab,r as WithWarningBadge,D as __namedExportsOrder,E as default};
