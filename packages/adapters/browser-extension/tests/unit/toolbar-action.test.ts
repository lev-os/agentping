import { describe, expect, it, vi } from 'vitest';
import { sendToggleDrawer } from '../../lib/toolbar-action';

describe('sendToggleDrawer', () => {
  it('injects the content script and retries when the tab has no receiver', async () => {
    const sendMessage = vi.fn()
      .mockRejectedValueOnce(new Error('Could not establish connection'))
      .mockResolvedValueOnce(undefined);
    const injectContentScript = vi.fn().mockResolvedValue(undefined);

    await sendToggleDrawer(42, sendMessage, injectContentScript);

    expect(injectContentScript).toHaveBeenCalledOnce();
    expect(sendMessage).toHaveBeenNthCalledWith(1, 42, { type: 'toggleDrawer' });
    expect(sendMessage).toHaveBeenNthCalledWith(2, 42, { type: 'toggleDrawer' });
  });
});
