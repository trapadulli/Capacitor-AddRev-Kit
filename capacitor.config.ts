
import type { CapacitorConfig } from '@capacitor/cli';
import { APP_SETTINGS } from './src/app.settings';


const config = {
  appId: APP_SETTINGS.APP_ID,
  appName: APP_SETTINGS.APP_NAME,
  webDir: 'www',
  autoRegisterPlugins: false,
  server: {
    url: APP_SETTINGS.REMOTE_URL,
    cleartext: false,
    allowNavigation: APP_SETTINGS.ALLOW_NAVIGATION,
    errorPath: 'index.html'
  },
  packageClassList: [
    'AdMobPlugin',
    'MediaPlugin',
    'AppPlugin',
    'CAPNetworkPlugin',
    'StatusBarPlugin',
    'PurchasesPlugin',
    'NativeBridgePlugin'
  ],
  ios: {
    contentInset: 'automatic',
    autoRegisterPlugins: false,
    packageClassList: [
      'AdMobPlugin',
      'MediaPlugin',
      'AppPlugin',
      'CAPNetworkPlugin',
      'StatusBarPlugin',
      'PurchasesPlugin',
      'NativeBridgePlugin'
    ]
  } as any
} as CapacitorConfig & { packageClassList: string[] };

export default config;
