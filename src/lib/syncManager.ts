// Local-first mode: no remote sync happens unless the app is deployed onto
// a server and an external sync endpoint is configured. These methods are
// kept as no-ops so existing call sites continue to compile.

class SyncManager {
  async startAutoSync(_intervalMs?: number): Promise<void> {}
  stopAutoSync(): void {}
  async syncAll(): Promise<void> {}
  async saveOffline(_table: string, _operation: 'insert' | 'update' | 'delete', _data: any): Promise<void> {}
  async loadFromCache(_table: string): Promise<any[]> { return []; }
  async cacheServerData(_table: string, _data: any[]): Promise<void> {}
}

export const syncManager = new SyncManager();
