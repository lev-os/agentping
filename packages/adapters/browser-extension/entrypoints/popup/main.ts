export default defineUnlistedScript(() => {
  const statusDot = document.getElementById('statusDot')!;
  const statusText = document.getElementById('statusText')!;
  const requestsDiv = document.getElementById('requests')!;
  const leasesDiv = document.getElementById('leases')!;

  function updateStatus(state: string) {
    const colors: Record<string, string> = {
      disconnected: 'gray',
      connecting: 'amber', 
      connected: 'green',
      leased: 'green'
    };
    const texts: Record<string, string> = {
      disconnected: 'Not connected',
      connecting: 'Connecting...',
      connected: 'Connected',
      leased: 'Active lease'
    };
    statusDot.className = `dot ${colors[state] || 'gray'}`;
    statusText.textContent = texts[state] || state;
  }

  function renderRequests(pending: any[]) {
    if (!pending || pending.length === 0) {
      requestsDiv.innerHTML = '<div class="empty">None pending</div>';
      return;
    }
    requestsDiv.innerHTML = pending.map(req => `
      <div class="card">
        <div class="agent">${req.agentName || 'Unknown Agent'}</div>
        <div class="scopes">
          ${(req.scopes || ['default']).map((s: string) => `<span class="scope">${s}</span>`).join('')}
        </div>
        <div class="buttons">
          <button class="btn btn-grant" data-request="${req.requestId}">Grant</button>
          <button class="btn btn-deny" data-request="${req.requestId}">Deny</button>
        </div>
      </div>
    `).join('');

    requestsDiv.querySelectorAll('.btn-grant').forEach(btn => {
      btn.addEventListener('click', () => {
        const requestId = (btn as HTMLElement).dataset.request;
        chrome.runtime.sendMessage({ type: 'approveLease', requestId });
        refresh();
      });
    });

    requestsDiv.querySelectorAll('.btn-deny').forEach(btn => {
      btn.addEventListener('click', () => {
        const requestId = (btn as HTMLElement).dataset.request;
        chrome.runtime.sendMessage({ type: 'denyLease', requestId });
        refresh();
      });
    });
  }

  function renderLeases(leases: any[]) {
    if (!leases || leases.length === 0) {
      leasesDiv.innerHTML = '<div class="empty">No active leases</div>';
      return;
    }
    leasesDiv.innerHTML = leases.map(lease => `
      <div class="card">
        <div>Scopes: ${(lease.scopes || ['default']).join(', ')}</div>
        <div style="color: #888; font-size: 11px; margin-top: 4px;">
          Expires: ${new Date(lease.expiresAt).toLocaleTimeString()}
        </div>
      </div>
    `).join('');
  }

  function refresh() {
    chrome.runtime.sendMessage({ type: 'getDrawerState' }, (response) => {
      if (response) {
        updateStatus(response.connectionState);
        renderRequests(response.pendingLeases);
        renderLeases(response.activeLeases);
      }
    });
  }

  refresh();
  setInterval(refresh, 2000);
});
