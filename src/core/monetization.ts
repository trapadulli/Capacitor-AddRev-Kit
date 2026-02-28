// Monetization Orchestrator
import { initRevenueCat, isSubscribed, purchase, restore } from '../providers/revenuecat';
import { enableAds, disableAds } from '../providers/admob';

export async function bootMonetization() {
  await initRevenueCat();
  const pro = await isSubscribed();
  if (pro) {
    disableAds();
  } else {
    enableAds();
  }
}

export async function handlePurchase() {
  const result = await purchase();
  if (result) disableAds();
}

export async function handleRestore() {
  const result = await restore();
  if (result) disableAds();
}
