import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'AgentPing Browser Bridge',
    version: '0.1.0',
    description: 'Bridges Chrome DevTools Protocol to AgentPing daemon',
    permissions: ['debugger', 'activeTab', 'tabs', 'storage', 'alarms'],
    icons: {
      16: '/assets/dot-gray.svg',
    },
  },
});
