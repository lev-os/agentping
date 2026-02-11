interface ConnectionStatusProps {
  connected: boolean;
}

export function ConnectionStatus({ connected }: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      <span
        className={`
          w-2 h-2 rounded-full
          ${
            connected
              ? 'bg-[#00ff9d]'
              : 'bg-[#ff2a6d] animate-pulse'
          }
        `}
      />
      <span className={connected ? 'text-[#00ff9d]' : 'text-[#ff2a6d]'}>
        {connected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
}
