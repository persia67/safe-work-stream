// Local-first mode: no separate "offline credential cache" is needed because
// the entire auth layer is local already. These helpers are kept as no-ops so
// any older import sites keep compiling.

export async function persistOfflineCredentials(_email: string, _password: string): Promise<void> {}
export function hasOfflineCredentials(_email: string): boolean { return false; }
export function listOfflineEmails(): string[] { return []; }
export async function tryOfflineLogin(_email: string, _password: string): Promise<boolean> { return false; }
export function clearOfflineCredentials(_email?: string): void {}
