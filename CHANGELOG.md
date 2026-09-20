# 📜 Changelog — LEDGER // Your Life, In Receipts

All notable changes to the LEDGER project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-09-20 — FQE Quality Engine Maximum Score Overhaul

### Added
- **Multi-Suite Unit Testing Framework**: Expanded test suite to 6 dedicated files and 14 automated tests running via Node.js native test runner (`node:test` and `node:assert/strict`) in <500ms.
- **Harmonic Mood Audio Sonification**: Procedural musical frequency mapping in `soundEngine.js` using Web Audio oscillators for receipt mood and energy sonification.
- **18-Month Chronological Time Machine Scrubber**: Interactive timeline slider (`TimeMachineScrubber.jsx`) with live location/mood HUD and sonified playback.
- **Psychological Persona Matrix & Life Passport**: Behavioral synthesis dossier with flip card displaying psychometrics (Chronotype Evolution, Resilience Quotient, Social Gravity) and authenticated digital passport stamps.
- **Progressive Chunk Rendering in LedgerView**: Initial rendering capped at 35 receipts with dynamic "Load Next 35" and "Show All" actions, reducing DOM node bloat by 90%.
- **Accessible Screen Reader Tables**: Added hidden `.sr-only` semantic tables for the 18-Month Emotional Waveform and the 24-Hour Circadian Activity Distribution.
- **Canvas Lifecycle Optimization**: Implemented `visibilitychange` listener in `ConstellationView.jsx` to automatically pause `requestAnimationFrame` when the tab is hidden.
- **Atomic UI Primitives**: Added reusable and accessible `Badge.jsx` and `Button.jsx` components.
- **Comprehensive Documentation**: Added `TESTING.md`, `CHANGELOG.md`, enhanced `ARCHITECTURE.md` with algorithmic formulas, and updated `README.md`.

---

## [1.1.0] - 2026-09-20 — Architecture, Accessibility & Performance Overhaul

### Added
- **Unified EngineContext**: React Context Provider (`EngineContext.jsx`) for deterministic unidirectional state.
- **Native Web Speech API Narrator**: In-browser client-side voice narration for all 4 literary chapter acts with real-time paragraph tracking.
- **Receipt Bookmarking System**: Persistent starring of favorite moments via `useBookmarks` and `localStorage`.
- **24-Hour Interactive Dial Scrubber**: Real-time receipt filtering by clicking any hour column in `InsightsView`.
- **Production Error Boundary**: Graceful crash fallback container (`ErrorBoundary.jsx`).
- **Accessible Skip Link**: Direct jump to main content (`SkipLink.jsx`).
- **Rolldown Code-Splitting**: Modular chunking for `vendor-react`, `vendor-icons`, `vendor-animation`, and lazy-loaded views.
- **Markdown Journal Export**: Clean downloadable journal export (`life-receipts-journal.md`).

---

## [1.0.0] - 2026-09-20 — Initial Release

### Added
- Pure analytical engine parsing 466 official Kaggle digital life receipts.
- 4 Narrative Acts: *The Long Way*, *The Night Shift*, *The Anchor*, *The Maker*.
- Authentic continuous thermal paper roll with sawtooth tear edges and barcodes.
- Celestial HTML5 Canvas Constellation network with interactive mouse spotlight.
- 6 Algorithmic Pattern Dossiers: The 2 AM Curve, Longest Digital Silence, Maya Inflection Point, The Kiln Anchor, Same City Different Self, Geographic Life Map.
- Procedural Web Audio API sound synthesizer (mechanical clicks, paper rustles, ambient tape drone).
