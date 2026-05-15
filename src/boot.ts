import { AdMob } from '@capacitor-community/admob';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { rcInit, rcIsSubscribed } from './revenuecat';

export async function boot() {
  if (Capacitor) {
    try {
      const nativeBridge = Capacitor.registerPlugin('NativeBridge');
      (window as any).NativeBridge = nativeBridge;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[boot-debug] failed to register NativeBridge plugin', e);
    }
  }

  try {
    await rcInit();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[boot-debug] rcInit failed, continuing with defaults', e);
  }

  let noAds = false;
  try {
    noAds = await rcIsSubscribed();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[boot-debug] rcIsSubscribed failed, assuming not subscribed', e);
  }

  (window as any).__NO_ADS__ = noAds;

  if (!noAds) {
    try {
      await AdMob.initialize();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[boot-debug] AdMob initialization failed, continuing', e);
    }
  }

  // refresh on foreground
  App.addListener('appStateChange', async s => {
    if (s.isActive) {
      try {
        const active = await rcIsSubscribed();
        (window as any).__NO_ADS__ = active;
        if (active) {
          // Add your own ad cleanup logic here if needed
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[boot-debug] foreground rcIsSubscribed failed', e);
      }
    }
  });
}

// Debug: log bridge availability early for diagnostics
;(function debugNativeBoot() {
  try {
    // eslint-disable-next-line no-console
    console.log('[boot-debug] window.Capacitor:', (window as any).Capacitor ? true : false);
    // eslint-disable-next-line no-console
    console.log('[boot-debug] Capacitor.isNativePlatform:', (window as any).Capacitor && typeof (window as any).Capacitor.isNativePlatform === 'function' ? (window as any).Capacitor.isNativePlatform() : 'not-available');
    // eslint-disable-next-line no-console
    console.log('[boot-debug] typeof Purchases:', typeof (window as any).Purchases);
    // eslint-disable-next-line no-console
    console.log('[boot-debug] typeof NativeBridge:', typeof (window as any).NativeBridge);
    // eslint-disable-next-line no-console
    console.log('[boot-debug] __NativeGate:', (window as any).__NativeGate || null);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[boot-debug] debug check failed', e);
  }
})();
