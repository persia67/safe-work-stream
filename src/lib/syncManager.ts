import { supabase } from '@/integrations/supabase/client';
import { offlineStorage } from './offlineStorage';
import { toast } from '@/hooks/use-toast';

class SyncManager {
  private syncing = false;
  private syncInterval: number | null = null;

  async startAutoSync(intervalMs: number = 30000): Promise<void> {
    if (this.syncInterval) return;

    this.syncInterval = window.setInterval(() => {
      this.syncAll();
    }, intervalMs);

    // Initial sync
    await this.syncAll();
  }

  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async syncAll(): Promise<void> {
    if (this.syncing) return;
    if (!navigator.onLine) return;

    this.syncing = true;

    try {
      const pendingOps = await offlineStorage.getPendingOperations();
      
      if (pendingOps.length === 0) {
        this.syncing = false;
        return;
      }

      console.log(`Syncing ${pendingOps.length} pending operations...`);

      for (const op of pendingOps) {
        try {
          await this.syncOperation(op);
          await offlineStorage.markOperationSynced(op.id);
        } catch (error) {
          console.error('Failed to sync operation:', op, error);
        }
      }

      toast({
        title: 'همگام‌سازی موفق',
        description: `${pendingOps.length} عملیات با سرور همگام شد`,
      });

    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.syncing = false;
    }
  }

  private async syncOperation(op: any): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get user's organization
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organization_id')
      .eq('user_id', user.id)
      .single();

    const organization_id = profile?.organization_id;

    const dataWithOrg = {
      ...op.data,
      organization_id
    };

    switch (op.operation) {
      case 'insert':
        const { error: insertError } = await supabase
          .from(op.table)
          .insert(dataWithOrg);
        if (insertError) throw insertError;
        break;

      case 'update':
        const { id, ...updateData } = dataWithOrg;
        const { error: updateError } = await supabase
          .from(op.table)
          .update(updateData)
          .eq('id', id);
        if (updateError) throw updateError;
        break;

      case 'delete':
        const { error: deleteError } = await supabase
          .from(op.table)
          .delete()
          .eq('id', op.data.id);
        if (deleteError) throw deleteError;
        break;
    }
  }

  async saveOffline(table: string, operation: 'insert' | 'update' | 'delete', data: any): Promise<void> {
    // Add to pending operations
    await offlineStorage.addPendingOperation({
      table,
      operation,
      data
    });

    // Update local cache
    if (operation === 'insert' || operation === 'update') {
      await offlineStorage.addCachedItem(table, data);
    } else if (operation === 'delete') {
      await offlineStorage.removeCachedItem(table, data.id);
    }

    // Try to sync immediately if online
    if (navigator.onLine) {
      setTimeout(() => this.syncAll(), 100);
    }
  }

  async loadFromCache(table: string): Promise<any[]> {
    return await offlineStorage.getCachedData(table);
  }

  async cacheServerData(table: string, data: any[]): Promise<void> {
    await offlineStorage.cacheData(table, data);
  }
}

export const syncManager = new SyncManager();

// Listen for online/offline events
window.addEventListener('online', () => {
  console.log('Online - starting sync...');
  syncManager.syncAll();
  toast({
    title: 'آنلاین شدید',
    description: 'در حال همگام‌سازی داده‌ها...',
  });
});

window.addEventListener('offline', () => {
  console.log('Offline - data will be saved locally');
  toast({
    title: 'آفلاین شدید',
    description: 'داده‌ها به صورت محلی ذخیره می‌شوند',
    variant: 'destructive'
  });
});
