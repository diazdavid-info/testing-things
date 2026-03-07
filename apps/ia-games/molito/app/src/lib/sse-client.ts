export interface SSEConfig {
  gameCode: string;
  playerId: string;
  playerKey: string;
  onDisconnectBannerUpdate?: (rivalConnected: boolean, elapsed: number) => void;
  onStateChange?: () => void;
  onConnectionStatusChange?: (status: "connected" | "disconnected") => void;
}

export function initSSE(config: SSEConfig): void {
  const { gameCode, playerId, playerKey } = config;
  let lastState = "";
  let retryDelay = 1000;
  let rivalDisconnectedSince: number | null = null;

  function handleConnectedState(connected: Record<string, boolean>) {
    if (!playerKey) return;
    const rivalKey = playerKey === "player1" ? "player2" : "player1";
    const rivalConnected = connected[rivalKey];

    if (!rivalConnected) {
      if (!rivalDisconnectedSince) rivalDisconnectedSince = Date.now();
      const elapsed = Date.now() - rivalDisconnectedSince;
      config.onDisconnectBannerUpdate?.(false, elapsed);
    } else {
      rivalDisconnectedSince = null;
      config.onDisconnectBannerUpdate?.(true, 0);
    }
  }

  function connectSSE() {
    const es = new EventSource(`/api/games/${gameCode}/stream?playerId=${playerId}`);

    es.onopen = () => {
      retryDelay = 1000;
      config.onConnectionStatusChange?.("connected");
    };

    es.onmessage = (event) => {
      if (!event.data) return;
      const stateStr = event.data;
      try {
        const state = JSON.parse(stateStr);
        if (state.connected) handleConnectedState(state.connected);
      } catch { /* ignore */ }
      if (lastState && stateStr !== lastState) {
        config.onStateChange?.();
      }
      lastState = stateStr;
    };

    es.onerror = () => {
      es.close();
      config.onConnectionStatusChange?.("disconnected");
      setTimeout(connectSSE, retryDelay);
      retryDelay = Math.min(retryDelay * 2, 30_000);
    };
  }

  connectSSE();
}
