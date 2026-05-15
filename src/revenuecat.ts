import { Capacitor } from "@capacitor/core";
import { Purchases } from "@revenuecat/purchases-capacitor";

const runtimeConfig = (window as any).__ADREVKIT_CONFIG__ || {};
const RC_API_KEY: string = runtimeConfig.revenueCatApiKey || "";
const ENTITLEMENT: string = runtimeConfig.revenueCatEntitlement || "no_ads";

export async function rcInit() {
  if (Capacitor.getPlatform() !== "ios") return;
  if (!RC_API_KEY) {
    // Native iOS config can configure RevenueCat directly (AppDelegate fallback path).
    return;
  }
  try {
    await Purchases.configure({ apiKey: RC_API_KEY });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[revenuecat] configure failed", e);
    return;
  }
}

export async function rcIsSubscribed(): Promise<boolean> {
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    return Boolean(customerInfo.entitlements?.active?.[ENTITLEMENT]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[revenuecat] getCustomerInfo failed", e);
    return false;
  }
}

export async function rcBuyMonthly(): Promise<boolean> {
  alert("rcBuyMonthly called!!!"); // temporary debug
  try {
    const offeringsResult = await Purchases.getOfferings();
    const monthlyPkg = offeringsResult.current?.availablePackages?.find(
      (p: any) => p.packageType === "MONTHLY",
    );
    if (!monthlyPkg) return false;
    const { customerInfo } = await Purchases.purchasePackage({
      aPackage: monthlyPkg,
    });
    return Boolean(customerInfo.entitlements?.active?.[ENTITLEMENT]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[revenuecat] purchasePackage failed", e);
    return false;
  }
}

export async function rcRestore(): Promise<boolean> {
  try {
    const { customerInfo } = await Purchases.restorePurchases();
    return Boolean(customerInfo.entitlements?.active?.[ENTITLEMENT]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[revenuecat] restorePurchases failed", e);
    return false;
  }
}

export async function rcLogIn(appUserID: string) {
  try {
    await Purchases.logIn({ appUserID });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[revenuecat] logIn failed", e);
  }
}
export async function rcLogOut() {
  try {
    await Purchases.logOut();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[revenuecat] logOut failed", e);
  }
}
