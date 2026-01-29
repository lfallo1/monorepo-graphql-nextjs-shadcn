# UI Package Refactor Plan

## Objective
Extract reusable UI components into a shared `packages/ui` package with Storybook for component documentation and development.

## Status: COMPLETE ✅

## Final Structure

```
monorepo-store-demo/
├── apps/
│   ├── server/                    # Unchanged
│   └── client/
│       ├── src/
│       │   ├── app/               # Unchanged
│       │   ├── components/
│       │   │   ├── organisms/     # App-specific (uses GraphQL, routing)
│       │   │   ├── templates/     # App-specific layouts
│       │   │   └── providers/     # App-specific providers
│       │   ├── lib/               # Unchanged
│       │   └── graphql/           # Unchanged
│       └── package.json           # Uses @store-demo/ui dependency
├── packages/
│   └── ui/
│       ├── src/
│       │   ├── atoms/             # Button, Input, Label, Badge, Card, Dialog, Table, Select
│       │   ├── molecules/         # FormField, PriceDisplay
│       │   ├── lib/               # utils.ts (cn function)
│       │   ├── styles/            # globals.css (Tailwind + CSS variables)
│       │   └── index.ts           # Main exports
│       ├── .storybook/            # Storybook config
│       ├── package.json
│       ├── tsconfig.json
│       └── tsup.config.ts
└── package.json                   # Workspaces: apps/*, packages/*
```

## What Moved to packages/ui

### Atoms (from client/src/components/ui/)
- [x] button.tsx
- [x] input.tsx
- [x] label.tsx
- [x] badge.tsx
- [x] card.tsx
- [x] dialog.tsx
- [x] table.tsx
- [x] select.tsx

### Molecules (from client/src/components/molecules/)
- [x] FormField.tsx
- [x] PriceDisplay.tsx

### Utilities
- [x] lib/utils.ts (cn function)
- [x] styles/globals.css (CSS variables)

## What Stays in client

### Organisms (app-specific dependencies)
- Header.tsx (uses next/navigation, next/link)
- ProductCard.tsx (uses next/link, @store-demo/ui)
- OrderCard.tsx (uses next/link, @store-demo/ui)
- CreateProductDialog.tsx (uses @apollo/client, @store-demo/ui)
- CreateOrderDialog.tsx (uses @apollo/client, @store-demo/ui)

### Templates
- MainLayout.tsx (uses organisms)

### Providers
- ApolloProvider.tsx (app-specific)

---

## Implementation Steps - All Complete

### Phase 1: Setup packages/ui ✅
- [x] 1.1 Create package.json with proper exports
- [x] 1.2 Create tsconfig.json
- [x] 1.3 Create tsup.config.ts for building
- [x] 1.4 Copy lib/utils.ts
- [x] 1.5 Create CSS variables file

### Phase 2: Move Atoms ✅
- [x] 2.1 Copy all shadcn components to packages/ui/src/atoms/
- [x] 2.2 Update imports to use local utils
- [x] 2.3 Create atoms/index.ts barrel export

### Phase 3: Move Molecules ✅
- [x] 3.1 Copy FormField.tsx to packages/ui/src/molecules/
- [x] 3.2 Copy PriceDisplay.tsx to packages/ui/src/molecules/
- [x] 3.3 Update imports to use local atoms
- [x] 3.4 Create molecules/index.ts barrel export

### Phase 4: Create Main Exports ✅
- [x] 4.1 Create src/index.ts with all exports
- [x] 4.2 Verify package builds

### Phase 5: Setup Storybook ✅
- [x] 5.1 Install Storybook dependencies
- [x] 5.2 Configure .storybook/main.ts
- [x] 5.3 Configure .storybook/preview.ts with Tailwind

### Phase 6: Create Stories ✅
- [x] 6.1 Button.stories.tsx
- [x] 6.2 Input.stories.tsx
- [x] 6.3 Label.stories.tsx
- [x] 6.4 Badge.stories.tsx
- [x] 6.5 Card.stories.tsx
- [x] 6.6 Dialog.stories.tsx
- [x] 6.7 Table.stories.tsx
- [x] 6.8 Select.stories.tsx
- [x] 6.9 FormField.stories.tsx
- [x] 6.10 PriceDisplay.stories.tsx

### Phase 7: Update Client App ✅
- [x] 7.1 Add @store-demo/ui to client dependencies
- [x] 7.2 Update root package.json workspaces
- [x] 7.3 Update client imports to use @store-demo/ui
- [x] 7.4 Remove old component files from client

### Phase 8: Verification ✅
- [x] 8.1 Run npm install from root
- [x] 8.2 Build ui package
- [x] 8.3 Build client

---

## Package Exports

```typescript
// packages/ui/src/index.ts

// Atoms
export { Button, buttonVariants } from "./atoms/button"
export { Input } from "./atoms/input"
export { Label } from "./atoms/label"
export { Badge, badgeVariants } from "./atoms/badge"
export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent } from "./atoms/card"
export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "./atoms/dialog"
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "./atoms/table"
export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue } from "./atoms/select"

// Molecules
export { FormField } from "./molecules/FormField"
export { PriceDisplay } from "./molecules/PriceDisplay"

// Utilities
export { cn } from "./lib/utils"
```

## Client Import Changes

```typescript
// Before
import { Button } from "@/components/atoms";
import { FormField } from "@/components/molecules";

// After
import { Button, FormField } from "@store-demo/ui";
```

---

## How to Run Storybook

```bash
cd packages/ui
npm run storybook
```

Storybook will be available at http://localhost:6006

---

## Progress Tracking

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1 | ✅ Complete | Setup packages/ui |
| Phase 2 | ✅ Complete | Move Atoms |
| Phase 3 | ✅ Complete | Move Molecules |
| Phase 4 | ✅ Complete | Create Main Exports |
| Phase 5 | ✅ Complete | Setup Storybook |
| Phase 6 | ✅ Complete | Create Stories |
| Phase 7 | ✅ Complete | Update Client App |
| Phase 8 | ✅ Complete | Verification |
