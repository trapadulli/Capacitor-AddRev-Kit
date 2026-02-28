// AdMob provider

import { AdMob } from '@capacitor-community/admob';
import { APP_SETTINGS } from '../app.settings';

export async function enableAds() {
  await AdMob.initialize({
    appId: APP_SETTINGS.ADMOB_APP_ID
  });
  // Show banner
  await AdMob.showBanner({
    adUnitId: APP_SETTINGS.ADMOB_BANNER_UNIT_ID,
    position: 'BOTTOM_CENTER'
  });
}

export function disableAds() {
  // Hide banner, etc.
}
