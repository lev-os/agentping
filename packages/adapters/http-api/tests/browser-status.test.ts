import { describe, expect, it } from 'vitest';
import { createHttpApi, type IBrowserCDPAdapter } from '../src/index';

function browserAdapter(connected: boolean): IBrowserCDPAdapter {
  return {
    isExtensionConnected: () => connected,
    sendCDPCommand: async () => ({}),
    requestLease: async () => 'request',
    waitForLeaseDecision: async () => ({ approved: false }),
    revokeLease() {},
  };
}

describe('browser status', () => {
  it('reports extension connectivity without creating a lease', async () => {
    const app = createHttpApi({ pingService: {} as never, browserCDPAdapter: browserAdapter(true), enableLogger: false });
    const response = await app.request('/api/v1/browser/status');
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ available: true, extensionConnected: true });
  });
});
