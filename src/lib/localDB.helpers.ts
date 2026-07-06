// Re-exports of the low-level table helpers used by remoteAdapter to keep a
// shadow cache in IndexedDB. Split into its own module to avoid circular imports.
export { getAll, putRow, updateRow, deleteRow } from './localDB';
