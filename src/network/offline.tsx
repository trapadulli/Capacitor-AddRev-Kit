import React, { useState, useEffect } from 'react';
import { Network } from '@capacitor/network';

export function OfflineModal() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    Network.getStatus().then(status => setOffline(!status.connected));
    const listener = Network.addListener('networkStatusChange', status => {
      setOffline(!status.connected);
    });
    return () => {
      listener.then(handle => handle.remove()).catch(() => {});
    };
  }, []);

  if (!offline) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      background: '#ff4444',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '18px',
      padding: '16px',
      textAlign: 'center',
      zIndex: 9999,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}>
      You need to be online to use this app.
    </div>
  );
}
