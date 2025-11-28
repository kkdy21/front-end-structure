# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Development (different environments)
npm run dev           # development mode
npm run dev:stag      # staging mode
npm run dev:prod      # production mode

# Build
npm run build         # TypeScript check + production build
npm run build:dev     # development build
npm run build:stag    # staging build
npm run build:prod    # production build

# Lint
npm run lint          # ESLint check

# Preview
npm run preview       # Preview production build
```

## Architecture Overview

This is a React 19 + TypeScript + Vite frontend application using Firebase as the backend.

### Key Technologies
- **React**: 19.0.0
- **TypeScript**: 5.7.0
- **Vite**: 6.2.0
- **State Management**: Zustand 5.0.8
- **Routing**: React Router v7.6.0
- **Styling**: Tailwind CSS v4.1.17 + Radix Themes
- **Backend**: Firebase 12.2.1 (Firestore, Storage, Functions, Auth)

### Path Alias
`@/*` maps to `src/*` (configured in tsconfig.json and vite.config.ts)

### Code Style
- 4-space indentation (enforced by ESLint)
- Max line length: 200 characters
- Use `type` imports: `import type { Foo } from './foo'` (enforced by `@typescript-eslint/consistent-type-imports`)
- `no-console` - Warn in dev, error in prod
- `no-debugger` - Warn in dev, error in prod

## Project Structure

```
src/
├── repositories/          # Data access layer with Firebase integration
├── router/                # Routing & RBAC configuration (guards, layouts)
├── service/               # Feature modules (auth, dashboard, etc.)
├── components/            # Shared UI components
│   ├── navigation/        # Navigation components (Sidebar - custom)
│   ├── layouts/           # App-level layout components (AppSidebar, AppHeader)
│   ├── feedback/          # User feedback components (ErrorBoundary, Toast)
│   └── icons/             # Icon wrapper components
├── hooks/                 # Custom React hooks (여러 store 조합용)
├── utils/                 # Helper functions
├── libs/                  # External library integrations (firebase)
├── types/                 # Global type definitions
├── constants/             # Global constants
├── stores/                # Global Zustand stores
├── assets/                # Static assets
├── App.tsx                # Root component (Theme Provider)
├── main.tsx               # Entry point
└── index.css              # Global styles (Radix Themes import)
```

### Service Directory Structure
Each service (e.g., `auth`, `dashboard`) follows this pattern:
```
src/service/{serviceName}/
├── routes/
│   ├── constants.ts       # Route path constants
│   ├── menu.ts            # Menu definition with accessKey
│   └── index.tsx          # RouteObject array
├── pages/                 # Page components
├── components/            # Service-specific components
├── hooks/                 # Service-specific hooks
├── stores/                # Service-specific Zustand stores
├── types/                 # Service-specific types
├── utils/                 # Service-specific utilities
└── constants/             # Service-specific constants
```

## Repository Pattern

API calls are abstracted through the Repository pattern built on Firebase:

```
src/repositories/
├── baseRepository.ts           # Firebase operations (CRUD, subscriptions, file upload)
├── baseStore.ts                # Common store state (isLoading, error, clearError)
├── referenceRepository.ts      # Aggregates all repositories
└── {domain}Repository/
    ├── api/
    │   ├── I{Domain}Repository.ts  # Interface
    │   └── {domain}Repository.ts   # Implementation extends BaseRepository
    ├── entity/                 # Domain entity class (DTO → Entity 변환)
    ├── schema/
    │   ├── api-verbs/          # Request parameter types (get.ts, create.ts, update.ts)
    │   └── dto/                # Response DTO types
    ├── store/                  # Zustand store (API 호출 + 상태 관리)
    ├── constants.ts
    └── types.ts
```

### 독립성 원칙 (Critical Convention)

**Repository와 Store는 반드시 독립적이어야 합니다:**

```
┌─────────────────────────────────────────────────────────────┐
│                      Components / Pages                      │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    src/hooks/useXxx.ts                       │
│         (여러 store/repository 조합, 비즈니스 로직)            │
└──────────┬────────────────────────────────────┬─────────────┘
           │                                    │
           ▼                                    ▼
┌─────────────────────┐              ┌─────────────────────┐
│     authStore       │              │     roleStore       │
│   (독립적, auth만)   │              │   (독립적, role만)   │
└──────────┬──────────┘              └──────────┬──────────┘
           │                                    │
           ▼                                    ▼
┌─────────────────────┐              ┌─────────────────────┐
│   authRepository    │              │   roleRepository    │
│ (Firebase Auth만)   │              │ (Firestore role만)  │
└─────────────────────┘              └─────────────────────┘
```

| 레이어 | 원칙 | 위반 예시 |
|--------|------|----------|
| **Repository** | 독립적, 다른 repository import 금지 | ❌ `authRepository`에서 `roleRepository` import |
| **Store** | 독립적, 다른 store import 금지 | ❌ `authStore`에서 `roleStore` import |
| **Hooks** | 여러 store/repository 조합 허용 | ✅ `useAuth`에서 authStore + roleStore 조합 |

### Hooks를 통한 Store 조합

여러 store의 데이터가 필요한 경우 해당 service의 `hooks/` 폴더에서 조합:

```typescript
// src/service/auth/hooks/useAuth.ts
export function useAuth() {
    const { firebaseUser, isAuthenticated, login } = useAuthStore();
    const { currentRole, getRoleByUserId } = useRoleStore();
    const { currentUser, getUserById } = useUserStore();

    // 통합 로그인: Firebase Auth → User 조회 → Role 조회
    const handleLogin = async (params: LoginParams) => {
        const firebaseUser = await login(params);
        await Promise.all([
            getUserById(firebaseUser.uid),
            getRoleByUserId(firebaseUser.uid),
        ]);
    };

    return {
        user: currentUser,
        role: currentRole,
        isAuthenticated,
        login: handleLogin,
    };
}
```

### BaseRepository Protected Methods
```typescript
checkAuth()                              // Validates user authentication
getCollection<T>(constraints?)           // Fetch multiple documents
getDocument<T>(id)                       // Fetch single document
create<T, D>(data)                       // Create new document
update<T, D>(id, data)                   // Update document
remove(id)                               // Delete document
uploadFile(file, path)                   // Upload to Firebase Storage
getFileUrl(path)                         // Get file download URL
call<T, D>(functionName, data)           // Call Cloud Function
subscribeCollection<T>(callback, constraints?) // Real-time subscription to collection
subscribeDocument<T>(id, callback)       // Real-time subscription to document
```

### Repository Layer Convention
- **api/**: Firebase와 직접 통신하는 메서드만 정의 (비즈니스 로직 없음, 다른 repository 참조 금지)
- **store/**: repository API를 호출하고 상태 관리 (다른 store 참조 금지)
- **entity/**: DTO를 받아서 getter로 변환하는 클래스 (snake_case → camelCase 변환)

### Store 사용 패턴
```typescript
// store에서 repository API 호출
import { referenceRepository } from '@/repositories/referenceRepository';

const { bookmarkRepository } = referenceRepository;
const data = await bookmarkRepository.getBookmarks(params);
```

### Base Store Pattern
```typescript
interface BaseState {
    isLoading: boolean;
    error: Error | null;
}

interface BaseActions {
    clearError: () => void;
}

// All domain stores extend these base states
```

### To add a new repository:
1. Create folder structure under `src/repositories/{domain}Repository/`
2. Define interface in `api/I{Domain}Repository.ts`
3. Implement repository extending `BaseRepository` in `api/{domain}Repository.ts`
4. Create entity class in `entity/{domain}Entity.ts`
5. Define DTOs in `schema/dto/{domain}DTO.ts`
6. Define request params in `schema/api-verbs/`
7. Create Zustand store in `store/{domain}Store.ts` (extends baseStore)
8. Register in `src/repositories/referenceRepository.ts`

### Current Repositories
- `authRepository` - Firebase Auth operations (login, logout, signup)
- `userRepository` - User profile management (+ userStore)
- `roleRepository` - Role & RBAC data (+ roleStore)
- `bookmarkRepository` - Bookmark CRUD (+ bookmarkStore)
- `studentRepository` - Student CRUD (+ studentStore)

## Routing & RBAC System

Uses RBAC (Role-Based Access Control) with pattern matching for page access.

### Route Structure
```
src/router/
├── config/
│   ├── menu/menuFilter.ts      # Menu collection & filtering
│   └── routes/
│       ├── index.tsx           # Main routes (combines public + private)
│       ├── private.ts          # Authenticated routes
│       └── public.ts           # Public routes
├── guards/RouteGuard.tsx       # Auth guard with pattern matching
└── layouts/PrivateLayout.tsx
```

### Service-specific Routes
Each service defines its own routes:
```
src/service/{serviceName}/routes/
├── constants.ts    # Route path constants
├── menu.ts         # Menu definition with accessKey
└── index.tsx       # RouteObject array
```

### Adding a New Service
1. Define route constants in `service/{name}/routes/constants.ts`
2. Define menu with `accessKey` for RBAC in `service/{name}/routes/menu.ts`
3. Define routes in `service/{name}/routes/index.tsx`
4. Register menu in `router/config/menu/menuFilter.ts`
5. Register routes in `router/config/routes/private.ts` or `public.ts`

### Access Pattern Matching
Located at `src/utils/accessPattern.ts`:
```typescript
// 2-depth pattern matching for page access
matchesPattern('dashboard.home', ['dashboard'])       // true - 1-depth matches all
matchesPattern('dashboard.home', ['dashboard.home'])  // true - exact match
matchesPattern('dashboard.analytics', ['dashboard.home']) // false

// URL path to access key conversion
pathToAccessKey('/dashboard/home')              // 'dashboard.home'
pathToAccessKey('/dashboard/analytics/reports') // 'dashboard.analytics'
```

**Rules**:
- 1-depth pattern (e.g., `'dashboard'`) → Matches all dashboard routes
- 2-depth pattern (e.g., `'dashboard.home'`) → Exact match only

### Route Guard Process
1. Check authentication status (authStore)
2. Check role exists and has page_access (roleStore)
3. Convert current URL to access key
4. Match against role's page_access patterns
5. Redirect to home if unauthorized

## Firebase Integration

### Configuration
Located at `src/libs/firebase.ts`:
- Firebase config from environment variables
- Exports: `auth`, `db`, `storage`, `functions`
- Cloud Functions configured for `asia-northeast3` region

### Environment Variables
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_BACKEND_BASE_URL
```

## Options Factory Pattern

Located at `src/utils/optionsFactory.ts` for type-safe constant management:

```typescript
const bookmarkTypeOptions = createOptions(
  [
    { id: 'SYSTEM', value: 'system', label: '시스템' },
    { id: 'USER', value: 'user', label: '사용자' },
  ] as const,
  { id: 'ALL', value: 'all', label: '전체' } // optional
);

// Generated utilities:
bookmarkTypeOptions.OPTIONS           // All options array
bookmarkTypeOptions.ID.SYSTEM         // Type-safe ID access
bookmarkTypeOptions.getOptionById('SYSTEM')    // Get full option
bookmarkTypeOptions.getOptionByValue('system') // Get by API value
bookmarkTypeOptions.isValidOptionId(str)       // Type guard
bookmarkTypeOptions.isValidOptionValue(val)    // Type guard
bookmarkTypeOptions.OPTIONS_WITH_ALL  // Array including ALL option
```

**Key Benefits**:
- Single source of truth for constants
- Type-safe frontend IDs (independent of API values)
- Separation: `id` (frontend), `value` (API), `label` (UI)

## UI Components - Radix Themes (Critical Convention)

### Radix Themes Overview

이 프로젝트는 **Radix Themes**를 사용합니다. Radix Themes는 완전한 디자인 시스템으로, 사전 스타일링된 고품질 React 컴포넌트를 제공합니다.

### Theme Provider 설정

앱 최상위에서 `Theme` 컴포넌트로 래핑:

```typescript
// src/App.tsx
import { Theme } from '@radix-ui/themes';

function App() {
    return (
        <Theme accentColor="blue" grayColor="slate" radius="medium" scaling="100%">
            {/* App content */}
        </Theme>
    );
}
```

### 주요 컴포넌트 카테고리

| 카테고리 | 컴포넌트 | 용도 |
|---------|---------|------|
| **Layout** | `Box`, `Flex`, `Grid`, `Container`, `Section` | 레이아웃 구성 |
| **Typography** | `Text`, `Heading`, `Code`, `Quote`, `Em`, `Strong` | 텍스트 스타일링 |
| **Form** | `Button`, `TextField`, `TextArea`, `Checkbox`, `Select`, `Switch`, `RadioGroup` | 폼 요소 |
| **Data Display** | `Card`, `Table`, `Badge`, `Avatar`, `Separator`, `DataList` | 데이터 표시 |
| **Feedback** | `Callout`, `Progress`, `Spinner` | 사용자 피드백 |
| **Navigation** | `Tabs`, `DropdownMenu` | 네비게이션 |
| **Overlay** | `Dialog`, `AlertDialog`, `Popover`, `Tooltip`, `HoverCard` | 오버레이 UI |

### Radix Themes Import 방식

```typescript
// ✅ 올바른 import (모든 컴포넌트는 @radix-ui/themes에서 직접 import)
import { Box, Flex, Text, Button, Card, TextField, Tabs, Badge } from '@radix-ui/themes';

// ❌ 잘못된 import (개별 패키지에서 import 금지)
import { Box } from '@radix-ui/react-box';
```

### 컴포넌트 작성 패턴

```tsx
import { Box, Card, Flex, Text, Heading, Button, Badge } from '@radix-ui/themes';

export function ExampleComponent() {
    return (
        <Flex direction="column" gap="4">
            <Box>
                <Heading size="6" weight="bold">제목</Heading>
                <Text size="2" color="gray">설명</Text>
            </Box>

            <Card size="2">
                <Flex justify="between" align="center">
                    <Text>콘텐츠</Text>
                    <Badge color="blue">라벨</Badge>
                </Flex>
            </Card>

            <Button size="2">확인</Button>
        </Flex>
    );
}
```

### Radix Themes 토큰 시스템

Radix Themes는 CSS 변수를 통한 토큰 시스템을 제공합니다:

**Color Scales** (1-12 단계):
- `--gray-1` ~ `--gray-12` (배경 → 전경)
- `--accent-1` ~ `--accent-12` (Theme accentColor 기반)
- `--blue-1` ~ `--blue-12`, `--red-1`, `--green-1`, `--amber-1` 등

**사용 예시**:
```tsx
<Flex
    style={{
        background: 'var(--blue-3)',
        color: 'var(--blue-11)'
    }}
>
    <Text>Content</Text>
</Flex>
```

**Spacing Scale**:
- `--space-1` ~ `--space-9` (props로 사용: `gap="4"`, `p="3"`, `m="2"`)

**Radius Scale**:
- `--radius-1` ~ `--radius-6`

### Radix Themes Props 패턴

**Responsive Props**:
```tsx
<Grid columns={{ initial: '1', sm: '2', lg: '3' }} gap="4">

<Flex display={{ initial: 'none', sm: 'flex' }}>

<Text size={{ initial: '2', md: '4' }}>
```

**Color Props**:
```tsx
<Button color="blue">
<Badge color="green">
<Text color="gray">
<Callout.Root color="red">
```

**Size Props**:
```tsx
<Button size="1">작은</Button>
<Button size="2">중간</Button>
<Button size="3">큰</Button>

<Card size="1">
<Card size="2">
<Card size="3">
```

**Variant Props**:
```tsx
<Button variant="solid">기본</Button>
<Button variant="soft">부드러운</Button>
<Button variant="outline">외곽선</Button>
<Button variant="ghost">투명</Button>
```

### Component Directory Structure

```
src/components/
├── navigation/            # 커스텀 Sidebar (Radix Themes에 없음)
│   ├── sidebar.tsx        # shadcn/ui 기반 커스텀 Sidebar 유지
│   ├── collapsible.tsx
│   └── index.ts
├── feedback/              # 커스텀 피드백 컴포넌트
│   ├── spinner.tsx
│   ├── sonner.tsx         # Toast (Sonner 라이브러리)
│   ├── ErrorBoundary.tsx
│   └── index.ts
├── layouts/               # App-level 레이아웃
│   ├── AppSidebar.tsx     # Radix Themes + 커스텀 Sidebar
│   ├── AppHeader.tsx      # Radix Themes 컴포넌트 사용
│   └── index.ts
├── icons/                 # 아이콘 래퍼
│   ├── Icon.tsx
│   └── index.ts
└── primitives/            # 레거시 (필요시 제거 예정)
```

### Import 규칙 (Updated for Radix Themes)

```typescript
// ✅ Radix Themes 컴포넌트
import { Box, Flex, Text, Button, Card, TextField, Tabs, Badge } from '@radix-ui/themes';

// ✅ 커스텀 Navigation (Sidebar는 Radix Themes에 없음)
import { Sidebar, SidebarProvider, SidebarTrigger } from '@/components/navigation';

// ✅ 커스텀 Feedback
import { Toaster, ErrorBoundary } from '@/components/feedback';

// ✅ 레이아웃 컴포넌트
import { AppSidebar, AppHeader } from '@/components/layouts';

// ✅ 아이콘
import { Icon } from '@/components/icons';
import { User, Settings } from 'lucide-react';
```

### 커스텀 Sidebar 유지

Radix Themes에는 Sidebar 컴포넌트가 없으므로, 기존 shadcn/ui 기반 커스텀 Sidebar를 유지합니다:

```typescript
// src/components/navigation/sidebar.tsx - 기존 유지
export {
    Sidebar,
    SidebarProvider,
    SidebarContent,
    SidebarTrigger,
    // ... 기타 Sidebar 컴포넌트들
}
```

### Layout 컴포넌트 위치 규칙

| 컴포넌트 유형 | 위치 | 예시 |
|--------------|------|------|
| **라우터 레이아웃** | `router/layouts/` | `PrivateLayout.tsx` (Outlet 포함) |
| **UI 레이아웃** | `components/layouts/` | `AppSidebar.tsx`, `AppHeader.tsx` |

### CSS Utility (Tailwind + Radix 병행)

Tailwind CSS는 Radix Themes와 함께 사용 가능합니다:

```typescript
// src/utils/cn.ts
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```tsx
// Tailwind와 Radix Themes 병행 사용
<Flex className="hover:shadow-md transition-shadow">
    <Card size="2">
        <Text>Content</Text>
    </Card>
</Flex>
```

### Radix Themes vs Tailwind 사용 기준

| 상황 | 권장 | 예시 |
|------|------|------|
| 레이아웃, 타이포그래피, 폼, 카드 | **Radix Themes** | `<Flex>`, `<Card>`, `<Button>` |
| hover, transition 등 상태 | **Tailwind** | `className="hover:bg-gray-2"` |
| 커스텀 스타일링 | **CSS 변수 + style** | `style={{ background: 'var(--blue-3)' }}` |
| 반응형 레이아웃 | **Radix Themes Props** | `columns={{ initial: '1', lg: '3' }}` |

## Key Implementation Patterns

### Pattern 1: DTO to Entity Conversion
```typescript
// Store converts DTO → Entity
const data = await bookmarkRepository.getBookmarks();
const entities = data.map(dto => new BookmarkEntity(dto, index));
set({ bookmarks: entities });

// Component uses entity getters
entity.name       // camelCase converted from DTO
entity.createdAt  // Date object from string
```

### Pattern 2: Error Handling
```typescript
// All stores follow same error pattern
async action() {
    set({ isLoading: true, error: null });
    try {
        // ... operation
        set({ isLoading: false });
    } catch (err) {
        set({ error: err as Error, isLoading: false });
        throw err;
    }
}
```

### Pattern 3: Real-time Subscriptions
```typescript
// Store manages subscription lifecycle
subscribeBookmarks: () => {
    set({ isLoading: true });
    return bookmarkRepository.subscribeBookmarks(
        (data) => {
            const entities = data.map(dto => new BookmarkEntity(dto, index));
            set({ bookmarks: entities, isLoading: false });
        },
        (error) => set({ error, isLoading: false })
    );
}

// Component cleanup
useEffect(() => {
    const unsubscribe = store.subscribeBookmarks();
    return () => unsubscribe?.();
}, []);
```

### Pattern 4: Multi-Store Composition via Hooks
```typescript
// src/service/auth/hooks/useAuth.ts - 여러 store 조합
export function useAuth() {
    const authStore = useAuthStore();
    const roleStore = useRoleStore();
    const userStore = useUserStore();

    const login = async (params) => {
        const firebaseUser = await authStore.login(params);
        await Promise.all([
            userStore.getUserById(firebaseUser.uid),
            roleStore.getRoleByUserId(firebaseUser.uid),
        ]);
    };

    return {
        user: userStore.currentUser,
        role: roleStore.currentRole,
        isAuthenticated: authStore.isAuthenticated,
        login,
    };
}
```

### Pattern 5: Radix Themes Card with Icon
```tsx
// 공통 패턴: 아이콘 + 카드
<Card size="2">
    <Flex justify="between" align="start">
        <Flex direction="column" gap="1">
            <Text size="2" color="gray">제목</Text>
            <Heading size="6">값</Heading>
        </Flex>
        <Flex
            align="center"
            justify="center"
            style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-3)',
                background: 'var(--blue-3)'
            }}
        >
            <Icon style={{ color: 'var(--blue-11)' }} />
        </Flex>
    </Flex>
</Card>
```

## App Bootstrap

### Entry Point Flow
1. `main.tsx` → Renders `App.tsx`
2. `App.tsx` → Wraps with `Theme` (Radix Themes) → `AuthProvider`
3. `AuthProvider` → Initializes Firebase auth state, loads user/role data
4. `RouterProvider` → Handles routing after auth ready

### AuthProvider Role
`AuthProvider`는 여러 store를 조합하는 역할:
- `authStore.subscribeAuthState()` → Firebase Auth 상태 감지
- `userStore.getUserById()` → 사용자 정보 로드
- `roleStore.getRoleByUserId()` → 권한 정보 로드
