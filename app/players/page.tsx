'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PlayersPage() {
  const [players, setPlayers] = useState<Array<{ id: number; username: string }>>([]);
  const [playersLoading, setPlayersLoading] = useState(true);
  const [playerMessage, setPlayerMessage] = useState('');

  useEffect(() => {
    setPlayersLoading(true);
    setPlayerMessage('');
    fetch('/api/account/players')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load players');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setPlayers(data.map((p) => ({ id: p.id, username: p.username })));
        } else {
          setPlayers([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setPlayerMessage('Could not load players.');
      })
      .finally(() => setPlayersLoading(false));
  }, []);

  const handleDelete = async (username: string) => {
    if (typeof window !== 'undefined' && !window.confirm(`Delete ${username}?`)) return;
    setPlayerMessage('');
    try {
      const res = await fetch(`/api/Account/${encodeURIComponent(username)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setPlayers((prev) => prev.filter((p) => p.username !== username));
    } catch (err) {
      console.error(err);
      setPlayerMessage(`Could not delete ${username}.`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-4xl space-y-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="text-left space-y-1">
            <h1 className="text-4xl font-serif font-bold tracking-tight text-[#FFD100] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" style={{ textShadow: '0 0 10px rgba(255, 209, 0, 0.5)' }}>
              Players
            </h1>
            <p className="text-sm text-[#a0a0a0]">View and manage player accounts.</p>
          </div>
          <Link
            href="/"
            className="rounded border border-[#FFD100] px-4 py-2 text-sm font-bold text-[#FFD100] bg-[#2a0a0a] hover:bg-[#3a0f0f] transition-colors"
          >
            Back to home
          </Link>
        </div>

        <div className="bg-[#151515]/90 p-6 rounded-lg border-2 border-[#4a4a4a] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00C2FF] to-transparent opacity-50"></div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-semibold text-[#FFD100] border-b border-[#333] pb-2">Players</h2>
            {playersLoading && <span className="text-xs text-[#a0a0a0] animate-pulse">Loading...</span>}
          </div>

          {playerMessage && (
            <div className="mb-4 p-3 rounded border text-sm font-medium bg-red-900/20 border-red-800 text-red-400">
              {playerMessage}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-[#a0a0a0] border-b border-[#333]">
                  <th className="py-2 pr-4 font-medium">Username</th>
                  <th className="py-2 pr-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {playersLoading ? (
                  <tr>
                    <td className="py-3 text-[#a0a0a0]" colSpan={2}>Loading players...</td>
                  </tr>
                ) : players.length === 0 ? (
                  <tr>
                    <td className="py-3 text-[#a0a0a0]" colSpan={2}>No players found.</td>
                  </tr>
                ) : (
                  players.map((player) => (
                    <tr key={player.id} className="border-b border-[#222] last:border-0">
                      <td className="py-3 pr-4 font-mono text-[#e0e0e0]">{player.username}</td>
                      <td className="py-3 pr-4">
                        <button
                          type="button"
                          onClick={() => handleDelete(player.username)}
                          className="rounded border border-[#FFD100] px-3 py-1 text-xs font-bold text-[#FFD100] bg-[#2a0a0a] hover:bg-[#3a0f0f] transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
