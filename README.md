# ScanCam

<div align="center">

  <h3>Real-time hand tracking. Interactive 3D. In your browser.</h3>
  <p>A mobile-first computer-vision experiment that turns hand gestures into 3D object controls.</p>
  <p>
    <a href="https://github.com/Khayom1/Scancam"><img src="https://img.shields.io/badge/status-prototype-orange?style=for-the-badge" alt="Prototype status"></a>
    <img src="https://img.shields.io/badge/platform-web-0ea5e9?style=for-the-badge" alt="Web">
    <img src="https://img.shields.io/badge/rendering-Three.js-black?style=for-the-badge" alt="Three.js">
    <img src="https://img.shields.io/badge/vision-MediaPipe-4285F4?style=for-the-badge" alt="MediaPipe">
  </p>
  **[Launch ScanCam](https://khayom1.github.io/Scancam/) · [Report a bug](https://github.com/Khayom1/Scancam/issues)**
</div>

---

## Overview

ScanCam is a browser-based hand-tracking demo. It uses the device camera and MediaPipe Hands to detect a hand, then maps the distance between the thumb tip and index-finger tip to the scale of a holographic 3D object.

The project is a static web application. It does not require an application backend, account, or installation. Three.js and MediaPipe are loaded from public CDNs.

> **Status: Prototype / experimental.** This is not a production-ready biometric, security, or accessibility system. Performance and compatibility depend on the device, browser, lighting, and network.

## Features

- **Gesture zoom:** pinch the thumb and index finger to scale the 3D object.
- **Hand-position control:** move the hand to shift the object horizontally and vertically.
- **Smoothing:** interpolation reduces visible jitter in gesture input.
- **Camera lifecycle controls:** explicit start and stop controls; camera tracks are released on stop and page exit.
- **Responsive 3D scene:** renderer adapts to viewport changes and limits pixel ratio for mobile devices.
- **Runtime metrics:** approximate render FPS, hand-detection state, and current zoom.
- **Error handling:** clear messages for common permission, missing-camera, and camera-busy errors.
- **No project-owned upload endpoint:** frames are not intentionally recorded or uploaded by ScanCam.

## How it works

1. The user grants camera permission after pressing **Start camera**.
2. The browser streams frames locally to MediaPipe Hands.
3. MediaPipe returns 21 hand landmarks.
4. ScanCam reads landmark 4 (thumb tip), 8 (index fingertip), and 0 (wrist).
5. The distance between landmarks 4 and 8 controls object scale; wrist position controls object translation.
6. Three.js renders the animated scene.

### Architecture

```text
Camera
  │ getUserMedia (browser)
  ▼
HTMLVideoElement
  │ video frames
  ▼
MediaPipe Hands
  │ 21 hand landmarks
  ▼
Gesture mapping + smoothing
  │ scale / x / y
  ▼
Three.js scene
  │
  ▼
WebGL renderer → Screen
```

## Technology

| Technology | Responsibility |
|---|---|
| HTML5 / CSS | Application structure and responsive interface |
| JavaScript | Camera lifecycle, gesture mapping, render loop |
| MediaPipe Hands | Real-time hand landmark detection |
| Three.js | 3D scene, geometry, lighting, animation |
| WebRTC getUserMedia | Browser camera access |
| WebGL | Hardware-accelerated rendering |

## Run locally

### GitHub Pages

Open the deployed page:

**https://khayom1.github.io/Scancam/**

If Pages is not enabled, open **Settings → Pages**, select the **main** branch and **/(root)**, then save.

### Local development

Camera access generally requires a secure context: HTTPS or localhost.

```bash
python -m http.server 8000
```

Then open http://localhost:8000 in your browser. Opening the HTML file directly with a file URL may prevent camera access.

## How to use

1. Open ScanCam in a modern browser.
2. Press **Фаъол кардани камера** and allow camera access.
3. Keep one hand visible in front of the camera with reasonable lighting.
4. Move your thumb and index finger apart to enlarge the object.
5. Bring them closer to shrink it.
6. Move your hand to reposition the object.
7. Press **Қатъ кардан** to release the camera.

## Requirements and compatibility

- A camera-enabled device.
- A modern browser with WebRTC, WebGL, and JavaScript enabled.
- HTTPS or localhost for camera permission.
- Internet access to load Three.js and MediaPipe from their CDNs.
- Good, even lighting and a hand clearly visible to the camera.

Mobile devices may reduce resolution or frame rate to manage heat and battery usage. The FPS indicator measures the render loop; it is not a performance guarantee and does not represent camera or inference FPS.

## Privacy

- Camera permission is requested only after the user presses the start button.
- The application does not intentionally record, save, or upload camera footage to a ScanCam server.
- Frames are passed from the video element to the MediaPipe library in the browser.
- Third-party CDN requests are made to load the libraries. Review the providers' privacy policies and terms before deployment.
- Camera tracks are stopped when the user presses Stop or leaves the page.

Do not use this prototype for identity verification, surveillance, medical diagnosis, or other high-stakes decisions.

## Known limitations

- Tracking quality varies with lighting, camera quality, hand orientation, and occlusion.
- Only one hand is tracked.
- Gesture thresholds are currently fixed in source code.
- The application depends on third-party CDN availability.
- Compatibility and performance have not been benchmarked across a representative device matrix.
- Automated unit, integration, and end-to-end tests are not yet included.

## Roadmap

- [ ] Add an in-app sensitivity calibration flow.
- [ ] Add selectable gesture profiles and two-hand interaction.
- [ ] Add a camera-device selector.
- [ ] Add automated tests for gesture mapping and camera lifecycle.
- [ ] Add reproducible mobile performance benchmarks.
- [ ] Pin and self-host dependency versions for controlled releases.
- [ ] Add accessibility improvements and more interface languages.

## Contributing

Issues and pull requests are welcome.

1. Fork the repository.
2. Create a focused branch.
3. Make and test your change on desktop and mobile where possible.
4. Describe the change and include reproduction steps or screenshots.
5. Open a pull request.

Do not claim a tested device, browser, or FPS result unless it has actually been measured.

## Project structure

```text
Scancam/
├── index.html   # Application, interface, camera pipeline, and 3D scene
└── README.md    # Project documentation
```

## Maintainer

**Khayom — VEYROST Technology Lab**

- GitHub: [@Khayom1](https://github.com/Khayom1)
- Repository: [Khayom1/Scancam](https://github.com/Khayom1/Scancam)

## License

No license file is currently included. Until a license is added, the source code is not granted an explicit open-source reuse license. Add a LICENSE file before accepting external reuse or redistribution.
