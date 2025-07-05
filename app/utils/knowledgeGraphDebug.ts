import { getCurrentChatId } from './fileLocks';

/**
 * Debug utilities for Knowledge Graph localStorage
 * These functions help troubleshoot issues with published metadata
 */

export interface KnowledgeGraphStorageEntry {
  knowledgeGraphId: string;
  ipfsCid: string;
  publishedAt: string;
}

/**
 * Get all Knowledge Graph entries from localStorage
 */
export function getAllKnowledgeGraphEntries(): Array<{
  key: string;
  chatId: string;
  userAddress: string;
  data: KnowledgeGraphStorageEntry;
}> {
  const entries: Array<{
    key: string;
    chatId: string;
    userAddress: string;
    data: KnowledgeGraphStorageEntry;
  }> = [];

  if (typeof localStorage === 'undefined') {
    return entries;
  }

  // Look for all keys that match the Knowledge Graph pattern
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('kg_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        const keyParts = key.split('_');

        if (keyParts.length >= 3) {
          const chatId = keyParts.slice(1, -1).join('_'); // Handle chat IDs with underscores
          const userAddress = keyParts[keyParts.length - 1];

          entries.push({
            key,
            chatId,
            userAddress,
            data,
          });
        }
      } catch (error) {
        console.warn(`Failed to parse Knowledge Graph entry: ${key}`, error);
      }
    }
  }

  return entries;
}

/**
 * Get Knowledge Graph entry for current chat
 */
export function getCurrentChatKnowledgeGraphEntry(userAddress: string): KnowledgeGraphStorageEntry | null {
  if (typeof localStorage === 'undefined' || !userAddress) {
    return null;
  }

  const chatId = getCurrentChatId();
  const key = `kg_${chatId}_${userAddress}`;
  const data = localStorage.getItem(key);

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.warn(`Failed to parse Knowledge Graph entry for current chat: ${key}`, error);
    return null;
  }
}

/**
 * Clear all Knowledge Graph entries (for debugging)
 */
export function clearAllKnowledgeGraphEntries(): number {
  if (typeof localStorage === 'undefined') {
    return 0;
  }

  const entries = getAllKnowledgeGraphEntries();

  for (const entry of entries) {
    localStorage.removeItem(entry.key);
  }

  console.log(`🧹 Cleared ${entries.length} Knowledge Graph entries from localStorage`);
  return entries.length;
}

/**
 * Clear Knowledge Graph entry for current chat
 */
export function clearCurrentChatKnowledgeGraphEntry(userAddress: string): boolean {
  if (typeof localStorage === 'undefined' || !userAddress) {
    return false;
  }

  const chatId = getCurrentChatId();
  const key = `kg_${chatId}_${userAddress}`;

  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`🧹 Cleared Knowledge Graph entry for current chat: ${key}`);
    return true;
  }

  return false;
}

/**
 * Debug console helper - prints all Knowledge Graph entries
 */
export function debugKnowledgeGraphStorage(): void {
  console.group('🌐 Knowledge Graph Storage Debug');

  const currentChatId = getCurrentChatId();
  console.log('Current Chat ID:', currentChatId);

  const allEntries = getAllKnowledgeGraphEntries();
  console.log(`Total entries found: ${allEntries.length}`);

  if (allEntries.length === 0) {
    console.log('📭 No Knowledge Graph entries found in localStorage');
  } else {
    console.table(
      allEntries.map((entry) => ({
        Key: entry.key,
        'Chat ID': entry.chatId,
        'User Address': entry.userAddress,
        'Knowledge Graph ID': entry.data.knowledgeGraphId,
        'Published At': entry.data.publishedAt,
        'Is Current Chat': entry.chatId === currentChatId,
      })),
    );
  }

  console.groupEnd();
}

// Make debug functions available globally for easy console access
if (typeof window !== 'undefined') {
  (window as any).kgDebug = {
    getAllEntries: getAllKnowledgeGraphEntries,
    getCurrentEntry: getCurrentChatKnowledgeGraphEntry,
    clearAll: clearAllKnowledgeGraphEntries,
    clearCurrent: clearCurrentChatKnowledgeGraphEntry,
    debug: debugKnowledgeGraphStorage,
  };

  console.log('🌐 Knowledge Graph debug utilities available at window.kgDebug');
  console.log('Available commands:');
  console.log('  window.kgDebug.debug() - Print all entries');
  console.log('  window.kgDebug.clearAll() - Clear all entries');
  console.log('  window.kgDebug.clearCurrent(userAddress) - Clear current chat entry');
}
