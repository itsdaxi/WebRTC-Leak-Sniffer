# WebRTC-Leak-Sniffer
Security research tool to monitor and visualize WebRTC leaks in real-time. Intercepts STUN/TURN requests via RTCPeerConnection to expose real IPs behind VPNs/Proxies. Features instant geolocation (ISP/City/Coords), a self-healing draggable UI, and hotkey support. Essential for privacy auditing. Requires Tampermonkey and ipgeolocation.io API.

WebRTC Leak Sniffer is a powerful security research tool designed to monitor and visualize WebRTC leaks in real-time. It intercepts STUN/TURN requests to detect real IP addresses that might be exposed even when using a VPN or Proxy.

## 🚀 Features
- **WebRTC Interception**: Automatically catches IP candidates by hooking into the `RTCPeerConnection` API.
- **Real-time Geolocation**: Instantly retrieves Country, City, ISP, and Coordinates for the detected IP.
- **Immortal UI**: A self-healing, high-priority overlay panel that stays visible regardless of site-specific CSS.
- **Draggable Interface**: Customizable positioning via a simple drag-and-drop header.
- **Hotkey Support**: Press `R` to quickly reset the tracker and clear cached data.

## 🎭 Showcase
<img width="261" height="92" alt="image" src="https://github.com/user-attachments/assets/ec00dc28-3f7d-49db-979d-cb96b307324f" />

<img width="261" height="184" alt="image" src="https://github.com/user-attachments/assets/88c541f8-2f7c-4cd9-9d6c-7e4172a0771b" />

## 🛠 Prerequisites (Important!)
To ensure the script works correctly on all pages, you must configure your Browser/Tampermonkey settings:

1. **Allow Access to File URLs**: 
   - Open your browser's **Extensions** page (e.g., `chrome://extensions`).
   - Find **Tampermonkey** and click **Details**.
   - Enable the toggle: **"Allow access to file URLs"**.
2. **Developer Mode**:
   - Ensure your browser's "Developer Mode" is turned **ON** in the Extensions page.
3. **Allow User Scripts**:
   - In some browsers (like Brave or Safari), ensure that "Allow User Scripts" is enabled in the security settings.

## 📖 Mini Tutorial: How to Install
1. **Install Manager**: Download [Tampermonkey](https://www.tampermonkey.net/) for your browser.
2. **Create Script**: Click the Tampermonkey icon, then select **"Create a new script..."**.
3. **Paste Code**: Delete the default template and paste the code from `webrtc_sniffer.user.js`.
4. **Add API Key**: 
   - Sign up for a free key at [ipgeolocation.io](https://ipgeolocation.io/).
   - Find the line `const apiKey = "YOUR_API_KEY_HERE";` and replace it with your real key.
5. **Save**: Click `File` -> `Save` (or `Ctrl+S`).
6. **Test**: Visit any website. A black panel should appear in the top-right corner as soon as a WebRTC connection is initiated.

## ⚖️ Disclaimer
**For Educational Purposes Only.**
This project was created to demonstrate privacy vulnerabilities related to WebRTC leaks. The author (**Daxi**) is not responsible for any misuse, illegal activities, or violations of third-party Terms of Service performed with this tool. Use it at your own risk for personal privacy auditing and security research.

## 📜 License
This project is licensed under the [MIT License](LICENSE).
