import Capacitor

class MainBridgeViewController: CAPBridgeViewController {

    override func capacitorDidLoad() {
        super.capacitorDidLoad()

        guard let bridge = bridge else {
            CAPLog.print("❌ NativeBridgePlugin registration skipped: bridge unavailable")
            return
        }

        let pluginInstance = NativeBridgePlugin()
        bridge.registerPluginInstance(pluginInstance)
        CAPLog.print("✅ Registered NativeBridgePlugin instance from MainBridgeViewController")
    }
}
