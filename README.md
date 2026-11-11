# VEYROST AURA

**Version:** 0.1.0  
**Status:** Alpha — functional prototype; real-device validation still required.

VEYROST AURA is a mobile-first, browser-based spatial interface controlled by index-finger movement and thumb–index pinching. It combines a 21-landmark hand tracker with a deterministic gesture geometry and temporal-stability layer.

**Live demo:** https://khayom1.github.io/Scancam/  
**Repository:** https://github.com/Khayom1/Scancam

## What works in this release

- Live camera start/stop with explicit permission request.
- Hand landmark skeleton overlay and virtual index-finger cursor.
- Index fingertip movement controls the cursor and moves the 3D object.
- Thumb–index pinch controls object scale and selects the two built-in interface actions.
- Gesture state is stabilized over consecutive frames; pinch uses separate engage/release thresholds (hysteresis).
- Invalid landmark arrays are rejected instead of being interpreted as gestures.
- Lost-hand handling resets the cursor and releases the interaction state safely.
- Camera processing and rendering use separate animation loops.
- CDN fallback for Three.js and MediaPipe Hands.
- Mobile renderer pixel-ratio cap and camera resolution/frame-rate constraints.

## Gestures

| Input | Action |
|---|---|
| Move index fingertip | Move virtual cursor and reposition 3D object |
| Pinch thumb + index | Scale 3D object |
| Pinch and release over RESET OBJECT | Reset object position and scale |
| Pinch and release over ROTATE ON/OFF | Toggle object rotation |

The interaction intentionally uses only the index fingertip for pointing and thumb–index distance for pinch. It does not attempt to infer elbow, wrist, or full-body pose.

## Architecture

```text
Camera stream
   ↓
MediaPipe Hands (21 landmarks)
   ↓
gesture-core.js
   ├─ Landmark validation
   ├─ Palm-relative pinch measurement
   ├─ Finger extension geometry
   ├─ Temporal stability filter
   └─ Pinch hysteresis
   ↓
Cursor + command gate
   ↓
Three.js scene and local UI actions
```

## Reliability design

- **Fail closed:** missing, malformed, or incomplete landmarks never trigger a command.
- **Temporal gate:** a gesture must persist for at least three inference results before state transition.
- **Hysteresis:** pinch engages below 0.31 palm-width ratio and releases above 0.43, reducing rapid toggling.
- **Safe hand loss:** the cursor is hidden and the gesture state is reset after tracking loss.
- **Isolated failures:** inference errors stop the camera pipeline and display an error without intentionally destroying the rendered interface.
- **Local-only interaction:** gesture actions are limited to controls inside this application. This browser page does not control Android system UI or other apps.

## Run

Open the HTTPS GitHub Pages deployment, allow camera permission, and keep one hand clearly visible in good lighting.

Camera access requires HTTPS or localhost and a browser that supports getUserMedia, WebGL, and the MediaPipe runtime.

## Automated tests

The deterministic gesture core tests can be run in a Node.js environment:

```bash
node --test tests/gesture-core.test.cjs
```

The test suite covers valid and malformed landmarks, open-palm classification, temporal stabilization, pinch engage/release, and state reset.

## Known limitations

- This alpha release has not yet been validated on a representative set of physical Android devices.
- Gesture thresholds are geometry heuristics, not a personalized learned model; hand size, camera angle, lighting, and occlusion can affect results.
- No claim is made that crashes are impossible. The goal is graceful failure and preventing uncertain gestures from firing commands.
- The browser cannot globally control Android apps. System-wide control would require a separate native Android application and explicit OS permissions.
- CDN access is still required to download the vision and 3D libraries.

## Privacy

Camera access begins only after the user presses the start button. The app does not intentionally record or upload camera footage to a project backend. Third-party CDN assets are downloaded at runtime. Review the providers' terms and privacy policies before production deployment.

## Project files

```text
Scancam/
├── index.html
├── gesture-core.js
├── tests/
│   └── gesture-core.test.cjs
└── README.md
```

## Maintainer

**Khayom — VEYROST Technology Lab**

## License

No LICENSE file is included. Reuse and redistribution are not granted by an explicit open-source license.
