
# CMS Form Builder (React + TypeScript + Vite)

A lightweight, fully tested CMS form built with **React (TypeScript)** and **Vite**.
The form dynamically generates fields from `assessment_1.json`, includes real-time validation, and mocks an API call on save.


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
Tests:       137 passed
Duration:    17.74s
```

**Coverage Report**

| Category               | % Stmts   | % Branch  | % Funcs   | % Lines   |
| ---------------------- | --------- | --------- | --------- | --------- |
| **All files**          | **92.79** | **88.50** | **95.55** | **93.20** |
| components             | 100       | 87.5      | 100       | 100       |
| components/CMSForm.tsx | 100       | 87.5      | 100       | 100       |
| components/FormFields  | 93.47     | 94        | 93.33     | 95.55     |
| schemas                | 100       | 100       | 100       | 100       |
| services               | 86.48     | 73.68     | 100       | 83.87     |
| utils                  | 100       | 100       | 100       | 100       |

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