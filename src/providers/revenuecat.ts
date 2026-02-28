// RevenueCat provider

import { Purchases } from '@revenuecat/purchases-capacitor';
import { APP_SETTINGS } from '../app.settings';

export async function initRevenueCat() {
  await Purchases.configure({ apiKey: APP_SETTINGS.REVENUECAT_API_KEY });
}

export async function isSubscribed() {
  const { customerInfo } = await Purchases.getCustomerInfo();
  return Boolean(customerInfo.entitlements?.active?.['pro']);
}

export async function purchase() {
  // Implement purchase logic
  return true;
}

export async function restore() {
  // Implement restore logic
  return true;
}
