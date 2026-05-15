import { Network } from '@capacitor/network';

export function setupNetworkStatusAlert() {
  Network.addListener('networkStatusChange', status => {
    if (!status.connected) {
      alert('You need to be online to use this app.');
    }
  });
}

// Optionally, check at startup
export async function checkInitialNetworkStatus() {
  const status = await Network.getStatus();
  if (!status.connected) {
    alert('You need to be online to use this app.');
  }
}
