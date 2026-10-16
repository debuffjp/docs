# Desktop builds

A debuff game is a static web app, so it can ship as a desktop app by wrapping it in a native window. We recommend **[Tauri](https://tauri.app)**. It uses the operating system's own webview instead of bundling a browser, so installers stay tiny.

On our Windows test, the starter game (`npm create debuff`) became a **1.8 MB installer** (2.8 MB as an MSI). The app opened its window in about a second and used about 33 MB of memory. Electron apps typically start around 80 to 100 MB.

::: info Status
These steps are tested on **Windows** with Tauri 2. macOS and Linux follow the same steps with their own prerequisites, but we haven't verified them yet. A `debuff desktop` command that does this for you is [on the roadmap](https://github.com/debuffjp/debuff/blob/main/docs/roadmap.md).
:::

## 1. Prerequisites

You need Rust and the platform's webview tooling. Follow Tauri's [prerequisites guide](https://v2.tauri.app/start/prerequisites/):

- **Windows:** Rust (the MSVC toolchain), Microsoft C++ Build Tools and WebView2 (preinstalled on Windows 11).
- **macOS:** Rust and the Xcode command line tools.
- **Linux:** Rust, `webkit2gtk-4.1` and the build packages listed by Tauri.

## 2. Add Tauri to your game

From your game's folder (made with `npm create debuff`):

```bash
npm install -D @tauri-apps/cli@2
```

```bash
npx tauri init --ci --app-name my-game --window-title "my game" --frontend-dist ../dist --dev-url http://localhost:5173 --before-dev-command "npm run dev" --before-build-command "npm run build"
```

This creates `src-tauri/`. Open `src-tauri/tauri.conf.json` and set two things:

- `identifier`: a unique reverse-domain id such as `com.yourname.mygame`. Tauri refuses to build with its placeholder.
- The window size under `app.windows`, for example `"width": 960, "height": 540`, to match your game's aspect ratio.

## 3. Run and build

```bash
npx tauri dev
```

This runs your game in a desktop window with hot reload. The debuff dev panel works as usual.

```bash
npx tauri build
```

This builds the production game (`npm run build`), compiles the native shell and writes installers to `src-tauri/target/release/bundle/`. On Windows that's an NSIS `…-setup.exe` and an `.msi`. The first build compiles Rust dependencies and takes a few minutes; later builds are much faster.

## Things to know for games

- **Webview differences:** Windows uses WebView2 (Chromium). macOS and Linux use WebKit (WKWebView and WebKitGTK), so test there before you ship. WebGL2 is widely supported, but **gamepad support in WebKit-based webviews is limited**. If your game needs controllers on macOS or Linux, test early, or use a native gamepad plugin such as [tauri-plugin-gamepad](https://github.com/DeveloperMindset-com/tauri-plugin-gamepad).
- **Linux graphics:** some Linux setups, often with NVIDIA GPUs, show a blank window because of a WebKitGTK driver issue. Tauri documents [the workaround](https://v2.tauri.app/develop/debug/linux-graphics/).
- **The splash:** production builds open with the "made with debuff" card. Pass `splash: false` to `new Game()` to remove it.
- **Fullscreen:** set `"fullscreen": true` on the window, or toggle it at runtime with Tauri's window API.

## Shipping

- **itch.io:** zip the installer, or the app folder, and upload it as a Windows, macOS or Linux download. You can also upload your web build (`dist/`) as a browser-playable version of the same game.
- **Steam:** works, but needs Steamworks integration through a community Rust crate. There's no official Tauri plugin.

## Alternatives

**Electron** bundles its own Chromium, so behaviour is identical on every platform, including gamepads. The cost is installers around 100 MB. Pick it if WebKit differences on macOS or Linux block you.
