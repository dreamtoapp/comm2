"use client";
import { useState } from 'react';

import { syncOrderInWay } from '@/utils/syncOrderInWay';

export default function SyncOrderInWayButton() {
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncOrderInWay()
    } catch (e) {
      alert("Sync failed!");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <button
      onClick={handleSync}
      disabled={syncing}
      className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {syncing ? "Syncing..." : "Sync OrderInWay (TEMP)"}
    </button>
  );
}
