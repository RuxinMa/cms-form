# CMS Form Builder (React + TypeScript + Vite)

A lightweight, fully tested CMS form built with **React (TypeScript)** and **Vite**.  
The form dynamically generates fields from `assessment_1.json`, includes real-time validation, and **uses MSW (Mock Service Worker) to mock API calls** on save, allowing realistic testing of POST requests without a backend.

## 🌐 Live Demo

[Deploy on Vercel](https://cms-form-ldqr.vercel.app/)

> The form interacts with a mock API, so submitting data will return realistic responses without a backend.

---

## 🖥️ API Calls

This project uses **MSW (Mock Service Worker)** to simulate backend API calls for the CMS form.  

- **POST /api/cms/content** → Submits the CMS form data  
  - Returns a JSON response with `success`, `data`, and `message` fields  
  - Example response:

```json
{
  "success": true,
  "data": {
    "id": "cms-1699999999999-abc123",
    "heading": "Hello World",
    "description": "Sample description",
    "content": "Sample content...",
    "seo_title": "Hello World",
    "seo_description": "Sample description",
    "created_at": "2025-11-11T00:00:00.000Z",
    "read_time_minutes": 1
  },
  "message": "Content created successfully"
}
````

* **How it works:**

  * In development, requests are intercepted by MSW and handled in the browser.
  * In production (Vercel demo), the Service Worker is also enabled via `VITE_USE_MOCK=true` to allow realistic testing.
  * No real backend is required; all API calls return mocked responses.


## 🧩 Tech Stack

* **Framework:** React + TypeScript
* **UI Library:** Material UI (MUI)
* **Form Management:** React Hook Form
* **Validation:** Zod
* **Testing:** Vitest + React Testing Library
* **Build Tool:** Vite
* **Mocking API:** MSW (Mock Service Worker)


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
├── services/
│   └── api.service.ts             # API service functions
├── mocks/                         # MSW handlers for API mocking
│   ├── browser.ts
│   └── handlers.ts
├── schemas/
│   └── cms.schema.ts
├── types/
│   └── cms.types.ts
├── utils/
│   └── generateSlug.ts
└── test/
    └── setup.ts
```

## 🧪 Testing & Coverage

**Test Commands**

```bash
npm run test           # Run all tests
npm run test:ui        # Run tests in UI mode
npm run test:coverage  # Generate coverage report
```

**Latest Test Summary**

```
Test Files:  9 passed
Tests:       146 passed
Duration:    27.71s
```

**Coverage Report**

| Category              | % Stmts   | % Branch  | % Funcs   | % Lines   |
| --------------------- | --------- | --------- | --------- | --------- |
| **All files**         | **93.51** | **91.01** | **94.73** | **94.33** |
| components            | 100       | 87.5      | 100       | 100       |
| components/FormFields | 93.47     | 94        | 93.33     | 95.55     |
| schemas               | 100       | 100       | 100       | 100       |
| services              | 83.33     | 70        | 100       | 83.33     |
| utils                 | 100       | 100       | 100       | 100       |
| mocks                 | 90.9      | 100       | 100       | 90.9      |


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

**Notes:**

* MSW will automatically start in development.
* To enable MSW in the deployed demo, ensure `VITE_USE_MOCK=true` in Vercel environment variables.

```