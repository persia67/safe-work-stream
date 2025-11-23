import { useEffect, useState } from 'react';
import { syncManager } from '@/lib/syncManager';
import { offlineStorage } from '@/lib/offlineStorage';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    // Initialize offline storage
    offlineStorage.init();

    // Start auto-sync
    syncManager.startAutoSync(30000); // Sync every 30 seconds

    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Update pending count periodically
    const updatePendingCount = async () => {
      const ops = await offlineStorage.getPendingOperations();
      setPendingCount(ops.length);
    };

    updatePendingCount();
    const interval = setInterval(updatePendingCount, 5000);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      clearInterval(interval);
      syncManager.stopAutoSync();
    };
  }, []);

  return {
    isOnline,
    pendingCount,
    syncNow: () => syncManager.syncAll()
  };
};
