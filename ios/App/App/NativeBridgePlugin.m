#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(NativeBridgePlugin, "NativeBridge",
  CAP_PLUGIN_METHOD(getStatus, CAPPluginReturnPromise);
  CAP_PLUGIN_METHOD(purchase, CAPPluginReturnPromise);
  CAP_PLUGIN_METHOD(restore, CAPPluginReturnPromise);
  CAP_PLUGIN_METHOD(echo, CAPPluginReturnPromise);
)
