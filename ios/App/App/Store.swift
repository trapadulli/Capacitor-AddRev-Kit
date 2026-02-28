import StoreKit

actor Store {
    static let shared = Store()
    private let pid = "no_ads_monthy_99_cents"
    private var products: [Product] = []

    func load() async throws {
        if products.isEmpty { products = try await Product.products(for: [pid]) }
    }

    func isActive() async -> Bool {
        for await r in Transaction.currentEntitlements {
            if case .verified(let t) = r, t.productID == pid,
               t.revocationDate == nil,
               (t.expirationDate == nil || t.expirationDate! > Date()) { return true }
        }
        return false
    }

    func purchase() async -> Bool {
        do {
            try await load()
            guard let p = products.first(where: {$0.id == pid}) else { return false }
            let result = try await p.purchase()
            if case .success(let vr) = result, case .verified(let tx) = vr { await tx.finish() }
            return await isActive()
        } catch { return await isActive() }
    }

    func restore() async -> Bool {
        try? await AppStore.sync()
        return await isActive()
    }
}
