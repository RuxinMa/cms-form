
# CMS Form Builder (React + TypeScript + Vite)

A lightweight, fully tested CMS form built with **React (TypeScript)** and **Vite**.  
The form dynamically generates fields from `assessment_1.json`, includes real-time validation, and **uses MSW (Mock Service Worker) to mock API calls** on save, allowing realistic testing of POST requests without a backend.


## 🌐 Live Demo

[Deploy on Vercel](https://cms-form-ldqr.vercel.app/)

---

## 🧩 Tech Stack

* **Framework:** React + TypeScript
* **UI Library:** Material UI (MUI)
* **Form Management:** React Hook Form
* **Validation:** Zod
* **Testing:** Vitest + React Testing Library
* **Build Tool:** Vite


## 📁 Project Structure

```
src/
├── components/
│   ├── CMSForm.tsx                # Main form container
│   ├── CMSForm.test.tsx           # Integration test
│   └── FormFields/                # Field groups
│       ├── BasicInfoFields.tsx
│       ├── ContentFields.tsx
│       ├── MetadataFields.tsx
│       ├── MediaFields.tsx
│       └── SEOFields.tsx
├── utils/
│   └── generateSlug.ts
├── types/
│   └── cms.types.ts
├── schemas/
│   └── cms.schema.ts
├── services/
│   └── api.service.ts
└── test/
    └── setup.ts
```

## 🧪 Testing & Coverage

**Test Commands**

```bash
npm run test           # Run all tests
npm run test:ui        # Run tests in UI mode
npm run test:coverage  # Generate coverage report
````

**Latest Test Summary**

```
Test Files:  9 passed
Tests:       146 passed
Duration:    27.71s
```

**Coverage Report**

| Category               | % Stmts   | % Branch  | % Funcs   | % Lines   |
| ---------------------- | --------- | --------- | --------- | --------- |
| **All files**          | **93.51** | **91.01** | **94.73** | **94.33** |
| components             | 100       | 87.5      | 100       | 100       |
| components/FormFields  | 93.47     | 94        | 93.33     | 95.55     |
| schemas                | 100       | 100       | 100       | 100       |
| services               | 83.33     | 70        | 100       | 83.33     |
| utils                  | 100       | 100       | 100       | 100       |
| mocks                  | 90.9      | 100       | 100       | 90.9      |

## ⚙️ Development

**Run locally:**

```bash
npm run dev
```

**Build for production:**

```bash
npm run build
```

**Preview build:**

```bash
npm run preview
```