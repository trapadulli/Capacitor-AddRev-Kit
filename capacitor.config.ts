import type { CapacitorConfig } from "@capacitor/cli";
import dotenv from "dotenv";

dotenv.config();

const REMOTE_URL = process.env.CAP_SERVER_URL || "https://your-remote-app.example.com";
const SERVER_CLEARTEXT =
  (process.env.CAP_SERVER_CLEARTEXT || "false").toLowerCase() === "true";
const ALLOW_NAVIGATION = (
  process.env.CAP_ALLOW_NAVIGATION || "your-remote-app.example.com"
)
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);
const RC_ENTITLEMENT = process.env.RC_ENTITLEMENT || "no_ads";
const IOS_REVENUECAT_API_KEY = process.env.IOS_REVENUECAT_API_KEY || "";
const IOS_ADMOB_APP_ID = process.env.IOS_ADMOB_APP_ID || "";

const config = {
  appId: "com.AdRevKit.app",
  appName: "Capacitor AdRevKit",
  webDir: "www",
  autoRegisterPlugins: false,
  server: {
    url: REMOTE_URL,
    cleartext: SERVER_CLEARTEXT,
    allowNavigation: ALLOW_NAVIGATION,
    errorPath: "index.html",
  },
  plugins: {
    NativeBridge: {
      revenueCatApiKey: IOS_REVENUECAT_API_KEY,
      entitlement: RC_ENTITLEMENT,
    },
    AdMob: {
      appId: IOS_ADMOB_APP_ID,
    },
  },
  packageClassList: [
    "AdMobPlugin",
    "MediaPlugin",
    "AppPlugin",
    "CAPNetworkPlugin",
    "StatusBarPlugin",
    "PurchasesPlugin",
    "NativeBridgePlugin",
  ],
  ios: {
    contentInset: "automatic",
    autoRegisterPlugins: false,
    packageClassList: [
      "AdMobPlugin",
      "MediaPlugin",
      "AppPlugin",
      "CAPNetworkPlugin",
      "StatusBarPlugin",
      "PurchasesPlugin",
      "NativeBridgePlugin",
    ],
  } as any,
} as CapacitorConfig & { packageClassList: string[] };

export default config;
