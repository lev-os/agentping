export type ToggleDrawerMessage = { type: 'toggleDrawer' };

function isMissingReceiverError(error: unknown): boolean {
  return /could not establish connection|receiving end does not exist/i.test(String(error));
}

export async function sendToggleDrawer(
  tabId: number,
  sendMessage: (tabId: number, message: ToggleDrawerMessage) => Promise<unknown>,
  injectContentScript: () => Promise<unknown>,
): Promise<void> {
  try {
    await sendMessage(tabId, { type: 'toggleDrawer' });
  } catch (error) {
    if (!isMissingReceiverError(error)) throw error;
    await injectContentScript();
    await sendMessage(tabId, { type: 'toggleDrawer' });
  }
}
