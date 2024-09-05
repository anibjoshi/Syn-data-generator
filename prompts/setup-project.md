
# Setup Instructions for DataFactory Project

**Goal**:

Use this guide to setup this project.

It uses **TypeScript**, **Next.js App Router**, **React**, **Shadcn UI**, **Radix UI**, and **Tailwind**.

Write the complete code for every step. Do not get lazy. Write everything that is needed.

Your goal is to completely finish the setup.

---
### Prerequisites

1. **Node.js** version 16.x or later.
2. **npm** or **yarn** for dependency management.

---

### Project Structure

- Follow a **feature-based directory structure**. Each feature will contain its components, subcomponents, types, and helpers. 
- All component directories should be named using **lowercase with dashes** (e.g., `components/custom-button`).

```bash
.
├── components/
│   ├── schema-input/
│   ├── row-count-input/
│   ├── data-preview/
│   └── output-format-selector/
├── helpers/
│   └── parse-schema.ts
├── pages/
│   ├── index.tsx
├── types/
│   └── schema.ts
└── utils/
    └── fetch-data.ts
```

### Setup Next.js with TypeScript

1. Initialize **Next.js** as a TypeScript project:
   ```bash
   npx create-next-app@latest datafactory --typescript
   cd datafactory
   ```

2. Install **Shadcn UI**, **Radix UI**, and **Tailwind CSS**:
   ```bash
   npm install @shadcn/ui radix-ui tailwindcss
   ```

3. Configure **Tailwind CSS** by creating `tailwind.config.js` and `postcss.config.js`:
   ```bash
   npx tailwindcss init
   ```

4. Update your **Tailwind config** to use **Radix UI** utilities:
   ```javascript
   module.exports = {
     content: [
       './pages/**/*.{js,ts,jsx,tsx}',
       './components/**/*.{js,ts,jsx,tsx}',
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

5. Set up **Shadcn UI** components:
   - Import Shadcn UI components and styles in each relevant feature folder.

---

### Implementing UI Components

#### Functional Components & UI Libraries

1. Each component must use **functional components** in **TypeScript**:
   - Use **interfaces** for props.
   - Avoid classes; favor **functional and declarative programming**.

2. **UI Components** should leverage:
   - **Shadcn UI** for reusable components.
   - **Radix UI** for accessible and customizable primitives.
   - **Tailwind CSS** for responsive, mobile-first styling.

#### Example: Input Form Component (in `components/schema-input`)

```typescript
// schema-input.tsx

import { useState } from 'react'

interface SchemaInputProps {
  value: string
  onChange: (value: string) => void
}

export function SchemaInput({ value, onChange }: SchemaInputProps) {
  return (
    <div>
      <label htmlFor="schema" className="block text-sm font-medium">
        Paste your CREATE TABLE statement
      </label>
      <textarea
        id="schema"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-40 bg-gray-800 text-white p-3 rounded-md"
      />
    </div>
  )
}
```

---

### Performance Optimization

- Limit the usage of **`use client`** only to small UI components that require Web APIs (e.g., handling form submissions).
- Prefer **React Server Components (RSC)** and Next.js **SSR** for data fetching and state management.
- Wrap client components in **Suspense** for better performance, using a fallback spinner for loading states.

---

### Adding Dynamic Imports

Use **Next.js dynamic imports** for non-critical components to improve load performance.

```typescript
import dynamic from 'next/dynamic'

const DynamicOutputFormatSelector = dynamic(
  () => import('../components/output-format-selector'),
  { suspense: true }
)
```

---

### TypeScript Conventions

- Always use **TypeScript** for strict type safety.
- Use **interfaces** for prop types and other type definitions.
- Avoid **enums** in favor of **maps**.

---

### URL State Management with `nuqs`

For managing URL search parameters, install **nuqs**:

```bash
npm install nuqs
```

Configure URL state management for parameters like the selected database and output format.

```typescript
import { useNuqs } from 'nuqs'

export function useDatabaseUrlState() {
  const [database, setDatabase] = useNuqs('database', 'PostgreSQL')
  return [database, setDatabase]
}
```

---

### Testing & Linting

1. **ESLint** and **Prettier** should be set up to ensure consistent code style across the project.

   Install the required dependencies:
   ```bash
   npm install eslint prettier eslint-plugin-react eslint-config-prettier --save-dev
   ```

2. Create **`.eslintrc.json`**:
   ```json
   {
     "extends": ["next/core-web-vitals", "prettier"],
     "plugins": ["react"],
     "rules": {
       "react/react-in-jsx-scope": "off",
       "no-unused-vars": "error"
     }
   }
   ```

---

### Final Notes

1. **Responsive Design**: Ensure the app is built mobile-first using Tailwind’s responsive classes (`sm`, `md`, `lg`, `xl`).
2. **Web Vitals**: Optimize for **LCP**, **CLS**, and **FID** to improve Core Web Vitals. Test performance via Next.js built-in analytics and Lighthouse.
