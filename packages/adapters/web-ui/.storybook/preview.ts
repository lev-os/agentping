import type { Preview } from '@storybook/react';
import { createElement } from 'react';
import '../src/styles/tokens.css';
import '../src/styles/global.css';
import '../src/styles/theme-sofia.css';
import { LoadingStateProvider } from '../src/components/sofia/dashboard/LoadingStateProvider';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'skynet',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'agentping', title: 'AgentPing', icon: 'mirror' },
          { value: 'skynet', title: 'Skynet', icon: 'lightning' },
          { value: 'syslog', title: 'Syslog', icon: 'database' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
    mode: {
      name: 'Mode',
      description: 'Theme mode',
      defaultValue: 'dark',
      toolbar: {
        icon: 'contrast',
        items: [
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'light', title: 'Light', icon: 'sun' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'skynet';
      const mode = context.globals.mode || 'dark';

      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-storybook', 'true');
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-mode', mode);
        document.body.setAttribute('data-storybook', 'true');
        document.body.setAttribute('data-theme', theme);
        document.body.setAttribute('data-mode', mode);
      }

      return createElement(LoadingStateProvider, null, Story());
    },
  ],
};

export default preview;
