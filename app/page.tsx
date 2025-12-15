'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [serverInfo, setServerInfo] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('/api/account/server-info')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data.data, "text/xml");
            const resultText = xmlDoc.getElementsByTagName("result")[0]?.textContent || "";
            
            const lines = resultText.split('\n');
            const onlinePlayers = lines.find(l => l.includes("Online players"))?.trim();
            const uptime = lines.find(l => l.includes("Server uptime"))?.trim();
            
            setServerInfo({
              "Online Players": onlinePlayers || "0",
              "Uptime": uptime?.split(':')[1]?.trim() || uptime || "Unknown",
            });
          } catch (e) {
            console.error("Error parsing server info XML", e);
            setServerInfo(data);
          }
        } else {
          setServerInfo(data);
        }
      })
      .catch((err) => console.error('Failed to fetch server info:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/account/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        setMessage('Account created successfully!');
        setUsername('');
        setPassword('');
      } else {
        const errorData = await res.json().catch(() => ({}));
        setMessage(`Error: ${errorData.message || 'Failed to create account'}`);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-serif font-bold tracking-tight text-[#FFD100] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" style={{ textShadow: '0 0 10px rgba(255, 209, 0, 0.5)' }}>
            Filip - WotLK
          </h1>
          <p className="text-xl text-[#00C2FF] font-serif tracking-wide drop-shadow-md">
            Wrath of the Lich King - Private TMHE Server
          </p>
        </div>

        {/* Server Info Section */}
        <div className="bg-[#151515]/90 p-6 rounded-lg border-2 border-[#4a4a4a] shadow-[0_0_20px_rgba(0,194,255,0.1)] backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00C2FF] to-transparent opacity-50"></div>
          <h2 className="text-xl font-serif font-semibold mb-4 text-[#FFD100] border-b border-[#333] pb-2">Realm Status</h2>
          {serverInfo ? (
            <div className="space-y-3 text-sm">
              {Object.entries(serverInfo).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-[#a0a0a0] font-medium">{key}</span>
                  <span className="font-mono text-[#00C2FF] font-bold">{String(value)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-[#222] rounded w-3/4"></div>
                <div className="h-4 bg-[#222] rounded"></div>
              </div>
            </div>
          )}
        </div>

        {/* Account Creation Form */}
        <div className="bg-[#151515]/90 p-6 rounded-lg border-2 border-[#4a4a4a] shadow-xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD100] to-transparent opacity-50"></div>
          <h2 className="text-xl font-serif font-semibold mb-4 text-[#FFD100] border-b border-[#333] pb-2">Create Account</h2>
                    <p className="text-xl text-[#FFD100] font-serif tracking-wide drop-shadow-md">
            Max 1 account per IP.
          </p>
          <br />
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#a0a0a0] mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded border border-[#333] bg-[#0a0a0a] px-3 py-2 text-[#e0e0e0] placeholder-[#555] focus:border-[#FFD100] focus:outline-none focus:ring-1 focus:ring-[#FFD100] sm:text-sm transition-colors"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#a0a0a0] mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded border border-[#333] bg-[#0a0a0a] px-3 py-2 text-[#e0e0e0] placeholder-[#555] focus:border-[#FFD100] focus:outline-none focus:ring-1 focus:ring-[#FFD100] sm:text-sm transition-colors"
                placeholder="Enter password"
              />
            </div>

            {message && (
              <div className={`p-3 rounded border text-sm font-medium ${message.includes('success') ? 'bg-green-900/20 border-green-800 text-green-400' : 'bg-red-900/20 border-red-800 text-red-400'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center rounded border border-[#FFD100] bg-[#800000] px-4 py-2 text-sm font-bold text-[#FFD100] shadow-[0_0_10px_rgba(128,0,0,0.5)] hover:bg-[#a00000] hover:shadow-[0_0_15px_rgba(255,209,0,0.3)] focus:outline-none focus:ring-2 focus:ring-[#FFD100] focus:ring-offset-2 focus:ring-offset-[#000] disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-wider"
            >
              {isLoading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
