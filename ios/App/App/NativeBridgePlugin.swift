import Capacitor
import RevenueCat

@objc(NativeBridgePlugin)
public class NativeBridgePlugin: CAPPlugin, CAPBridgedPlugin {
    private let primaryEntitlement = "no_ads"

    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getStatus", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "purchase", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restore", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "echo", returnType: CAPPluginReturnPromise)
    ]

    public let jsName = "NativeBridge"
    public let identifier = "NativeBridgePlugin"

    override public func load() {
        super.load()
        print("✅ NativeBridge plugin loaded successfully!")
    }

    @objc func getStatus(_ call: CAPPluginCall) {
        print("[NativeBridge] getStatus invoked")
        Purchases.shared.getCustomerInfo { customerInfo, error in
            if let error = error {
                print("[RevenueCat] getStatus error: \(error.localizedDescription)")
                call.resolve([
                    "isSubscribed": false,
                    "error": error.localizedDescription
                ])
                return
            }
            let activeEntitlements = customerInfo?.entitlements.active ?? [:]
            let entitlement = activeEntitlements[self.primaryEntitlement] ?? activeEntitlements.values.first
            let isSubscribed = entitlement != nil
            // Convert entitlement keys to [String]
            let entitlementKeys = Array(activeEntitlements.keys)
            // Use entitlement product identifier
            let productId = entitlement?.productIdentifier ?? ""
            print("[NativeBridge] getStatus resolved -> isSubscribed: \(isSubscribed), productId: \(productId)")
            call.resolve([
                "isSubscribed": isSubscribed,
                "productId": productId,
                "entitlements": entitlementKeys,
                "expirationDate": entitlement?.expirationDate?.iso8601 ?? ""
            ])
        }
    }

    @objc func purchase(_ call: CAPPluginCall) {
        let requestedProductId = call.getString("productId") ?? "no_ads_monthy_99_cents"
        Purchases.shared.getOfferings { offerings, error in
            if let error = error {
                print("[RevenueCat] getOfferings error: \(error.localizedDescription)")
                call.resolve([
                    "success": false,
                    "productId": requestedProductId,
                    "error": error.localizedDescription
                ])
                return
            }
            // Helper to read productIdentifier using KVC to support multiple RevenueCat SDK versions
            func productIdentifierForPackage(_ pkg: Any) -> String {
                let obj = pkg as AnyObject
                if let id = obj.value(forKeyPath: "storeProduct.productIdentifier") as? String {
                    return id
                }
                if let id = obj.value(forKeyPath: "product.productIdentifier") as? String {
                    return id
                }
                return ""
            }

            // Debug: log available offerings and packages
            if let offs = offerings {
                print("[RevenueCat] Offerings available: \(offs.all.map { $0.key })")
                if let current = offs.current {
                    // Prepare package identifiers separately to avoid complex inline interpolation
                    let packageIds = current.availablePackages.map { pkg -> String in
                        return productIdentifierForPackage(pkg)
                    }
                    print("[RevenueCat] Current offering: \(current.identifier)")
                    print("[RevenueCat] Packages in current offering: \(packageIds)")
                }
            }

            guard let offering = offerings?.current else {
                call.resolve([
                    "success": false,
                    "productId": requestedProductId,
                    "error": "No current offering available."
                ])
                return
            }
            // Find package by comparing productIdentifier or package identifier
            let matchedPackage = offering.availablePackages.first(where: { pkg in
                let storeId = productIdentifierForPackage(pkg)
                if storeId == requestedProductId { return true }
                if let packageId = (pkg as AnyObject).value(forKeyPath: "identifier") as? String,
                   packageId == requestedProductId { return true }
                return false
            })

            let packageToPurchase: Package?
            if let matchedPackage = matchedPackage {
                packageToPurchase = matchedPackage
            } else {
                packageToPurchase = offering.availablePackages.first
                if let fallback = packageToPurchase {
                    let storeId = productIdentifierForPackage(fallback)
                    print("[RevenueCat] Requested productId \(requestedProductId) not found. Falling back to \(storeId).")
                }
            }

            guard let packageToPurchase = packageToPurchase else {
                call.resolve([
                    "success": false,
                    "productId": requestedProductId,
                    "error": "Product not found in offerings."
                ])
                return
            }

            let productIdToReport = productIdentifierForPackage(packageToPurchase)
            print("[RevenueCat] Attempting purchase for productId: \(productIdToReport)")
            Purchases.shared.purchase(package: packageToPurchase) { transaction, customerInfo, error, userCancelled in
                if let error = error {
                    print("[RevenueCat] purchase error: \(error.localizedDescription)")
                    call.resolve([
                        "success": false,
                        "productId": productIdToReport.isEmpty ? requestedProductId : productIdToReport,
                        "error": error.localizedDescription
                    ])
                    return
                }
                let activeEntitlements = customerInfo?.entitlements.active ?? [:]
                let entitlement = activeEntitlements[self.primaryEntitlement] ?? activeEntitlements.values.first
                let isSubscribed = entitlement != nil
                call.resolve([
                    "success": isSubscribed,
                    "productId": productIdToReport.isEmpty ? requestedProductId : productIdToReport,
                    "error": userCancelled ? "User cancelled" : ""
                ])
            }
        }
    }

    @objc func restore(_ call: CAPPluginCall) {
        print("[NativeBridge] restore invoked")
        Purchases.shared.restorePurchases { customerInfo, error in
            if let error = error {
                print("[RevenueCat] restore error: \(error.localizedDescription)")
                call.resolve([
                    "success": false,
                    "error": error.localizedDescription
                ])
                return
            }
            let activeEntitlements = customerInfo?.entitlements.active ?? [:]
            let entitlements = Array(activeEntitlements.keys)
            let entitlement = activeEntitlements[self.primaryEntitlement] ?? activeEntitlements.values.first
            let isSubscribed = entitlement != nil
            print("[NativeBridge] restore resolved -> success: \(isSubscribed), entitlements: \(entitlements)")
            call.resolve([
                "success": isSubscribed,
                "subscriptions": entitlements,
                "error": ""
            ])
        }
    }

    // Simple echo method for quick bridge tests from the WebView / Xcode console
    @objc func echo(_ call: CAPPluginCall) {
        let message = call.getString("message") ?? ""
        print("[NativeBridge][echo] received: \(message)")
        call.resolve([
            "message": message
        ])
    }
}

// Helper for ISO8601 formatting
extension Date {
    var iso8601: String {
        return ISO8601DateFormatter().string(from: self)
    }
}
