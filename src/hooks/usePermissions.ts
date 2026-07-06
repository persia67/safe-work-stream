import { useEffect, useState } from 'react';
import { getMatrix, canSync, type AppRole, type ModuleKey, type Action } from '@/lib/permissions';

export function usePermissionMatrix() {
  const [matrix, setMatrix] = useState<Awaited<ReturnType<typeof getMatrix>> | null>(null);
  useEffect(() => {
    let alive = true;
    getMatrix().then((m) => { if (alive) setMatrix(m); });
    return () => { alive = false; };
  }, []);
  return matrix;
}

export function usePermission(role: AppRole | undefined | null, module: ModuleKey, action: Action) {
  const matrix = usePermissionMatrix();
  return canSync(matrix, role, module, action);
}
