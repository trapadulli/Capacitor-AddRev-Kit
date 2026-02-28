import UIKit
import Capacitor

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else {
            return
        }

        let window = UIWindow(windowScene: windowScene)
        let storyboard = UIStoryboard(name: "Main", bundle: nil)
        let rootViewController = storyboard.instantiateInitialViewController() ?? CAPBridgeViewController()
        window.rootViewController = rootViewController
        window.makeKeyAndVisible()

        self.window = window
    }

    func sceneDidDisconnect(_ scene: UIScene) {
        // Scene disconnected. Release any resources tied to this scene here.
    }

    func sceneDidBecomeActive(_ scene: UIScene) {
        // Scene became active. Restart any paused tasks here if needed.
    }

    func sceneWillResignActive(_ scene: UIScene) {
        // Scene will resign active. Pause ongoing tasks if needed.
    }

    func sceneWillEnterForeground(_ scene: UIScene) {
        // Scene will enter foreground. Undo changes made on entering the background here.
    }

    func sceneDidEnterBackground(_ scene: UIScene) {
        // Scene entered background. Save data and release shared resources here.
    }
}
