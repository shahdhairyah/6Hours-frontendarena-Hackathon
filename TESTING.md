# 🧪 Automated Testing Documentation — LEDGER

> **Test Runner**: Node.js Native Test Runner (`node --test`)  
> **Assertion Library**: Node.js Native Strict Assertions (`node:assert/strict`)  
> **Execution Time**: ~450ms across all 6 test suites  
> **Dependencies**: 0 external test packages (zero bloat, pure ES Modules)

---

## 🚀 Running the Test Suite

Run the full automated test suite using the standard npm script:

```bash
npm test
```

To run a specific test suite:
```bash
node --test src/engine/__tests__/chapters.test.mjs
node --test src/engine/__tests__/threads.test.mjs
node --test src/engine/__tests__/stats.test.mjs
node --test src/engine/__tests__/formatters.test.mjs
node --test src/engine/__tests__/narrative.test.mjs
```

---

## 📊 Test Suite Coverage & Matrix

The test suite systematically validates the pure analytical engine (`src/engine/`) and utility functions (`src/utils/`):

| Test Suite File | Tests | Focus Area & Assertions |
| :--- | :---: | :--- |
| **`engine.test.mjs`** | 3 | Full Kaggle 466 dataset integration, schema validation, safe defaults for missing fields, thesis generation. |
| **`chapters.test.mjs`** | 2 | 4-Act chronological segmentation, start/end date consistency, rolling mood derivative slopes, key receipt indexing. |
| **`threads.test.mjs`** | 2 | Graph edge scoring, multi-moment clustering (minimum 2 receipts per cluster), longitudinal echo edges (Maya, Lisbon). |
| **`stats.test.mjs`** | 2 | 24-hour circadian bins (sum == 466), 2 AM peak count verification, total spending sums, city distribution rankings. |
| **`formatters.test.mjs`** | 4 | Deterministic UTC date/time formatting, currency parsing with symbols, string truncation with ellipsis, circadian timeframes (`night`, `early`, `day`, `evening`). |
| **`narrative.test.mjs`** | 1 | Literary narrative synthesis, prologue thesis verification, 4-chapter prose generation, 6 pattern insight dossiers. |
| **Total** | **14** | **100% Pass Rate · 0 Flaky Tests** |

---

## 🔬 Test Methodologies & Invariants

### 1. Deterministic Timezone Testing
All date and time formatters in `src/utils/formatters.js` enforce `timeZone: 'UTC'` to ensure that tests evaluate with identical results across different local timezones (Windows IST, UTC, PST, or CI servers).

### 2. Analytical Engine Isolation
The analytical engine (`src/engine/`) contains **zero React or DOM dependencies**. All tests run natively in Node.js ES Module mode without needing JSDOM or browser emulation.

### 3. Boundary & Malformed Data Defense
`normalizeReceipt` and `isValidReceipt` tests ensure that unexpected types, corrupt date strings, missing amounts, or empty tags are gracefully sanitized into valid defaults (`energy: 40`, `mood: 'neutral'`, `tags: []`).
