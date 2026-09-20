# 🤝 Contributing to LEDGER

Thank you for your interest in contributing to **LEDGER // Your Life, In Receipts**! This document provides guidelines and workflows for contributing to the project.

---

## 🛠️ Development Setup

### Prerequisites
- **Node.js**: Version 18 or higher (LTS recommended).
- **npm**: Version 9 or higher.

### Quickstart
1. Clone the repository and navigate into the root directory:
   ```bash
   cd 66
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173/` in your browser.

---

## 🧪 Testing & Quality Standards

Before submitting changes, all automated tests and linter checks must pass cleanly.

### 1. Code Quality & Linting (`oxlint`)
We use `oxlint` for high-performance static analysis.
```bash
npm run lint
```
> **Rule**: Zero errors and zero warnings are required. Unused imports, unused variables, and improper dependencies must be resolved.

### 2. Automated Unit Tests
We use Node.js's native test runner to test our analytical engine without mock overhead:
```bash
npm test
```
All unit tests are located in `src/engine/__tests__/`. When adding new engine capabilities or algorithms, always add corresponding unit test assertions in `.test.mjs` files.

### 3. Production Build Verification
Verify that the Vite 8 + Rolldown build finishes without errors:
```bash
npm run build
npm run preview -- --port 4173
```

---

## 📐 Architecture & Coding Guidelines

1. **Zero Backend Constraint**:
   - Do not introduce server-side endpoints, remote database connections, or mandatory API keys.
   - All data parsing, aggregation, and synthesis must run client-side in the browser.

2. **Analytical Engine Purity**:
   - Code inside `src/engine/` must remain pure JavaScript functions.
   - Do not import React hooks, DOM APIs, or browser globals into engine modules.

3. **Accessibility (WCAG AA Compliance)**:
   - Ensure interactive elements are reachable via keyboard (`Tab`, `Shift+Tab`, `Enter`, `Space`).
   - Use semantic HTML tags (`<header>`, `<main>`, `<section>`, `<nav>`, `<button>`).
   - Provide `aria-label` or `aria-labelledby` for icon-only buttons.
   - Ensure proper contrast ratios for text on paper/dark backgrounds.

4. **Component Design**:
   - Keep components modular and single-responsibility.
   - Use `EngineContext` for shared state rather than prop drilling.
   - Code-split large views using `React.lazy()` where appropriate.

---

## 📄 License
By contributing to LEDGER, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
