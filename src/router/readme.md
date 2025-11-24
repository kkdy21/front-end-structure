# 라우터 및 권한 관리 시스템

## 📋 목차
- [개요](#개요)
- [백엔드 데이터 구조](#백엔드-데이터-구조)
- [프론트엔드 구조](#프론트엔드-구조)
- [권한 체크 흐름](#권한-체크-흐름)
- [메뉴 시스템](#메뉴-시스템)
- [구현 예시](#구현-예시)

## 개요

이 시스템은 **RBAC (Role-Based Access Control)** 기반으로 페이지 접근과 메뉴 표시를 제어합니다.

### 핵심 원칙
1. **백엔드**: 사용자 role과 page_access 패턴만 제공
2. **프론트엔드**: 정적 메뉴/라우트 정의를 가지고 패턴 매칭으로 필터링
3. **분리**: page_access (페이지 접근)와 permissions (CRUD 작업)를 분리

## 백엔드 데이터 구조

### Role 데이터
```typescript
// 백엔드에서 제공하는 Role 정보
{
  "id": "role-123",
  "name": "Manager",
  "description": "프로젝트 매니저",
  "pageAccess": [
    "dashboard.*",           // 대시보드 전체 접근
    "project.list",         // 프로젝트 목록만 접근
    "project.create"        // 프로젝트 생성 접근
  ],
  "permissions": [
    "project:read",         // 프로젝트 읽기
    "project:create",       // 프로젝트 생성
    "user:read"            // 사용자 읽기
  ]
}
```

### 패턴 매칭 규칙
- `*` : 해당 레벨의 모든 항목 매칭
- `dashboard.*` : dashboard로 시작하는 모든 경로
- `dashboard.analytics.*` : dashboard.analytics의 모든 하위 경로
- `dashboard.home` : 정확히 dashboard.home만 매칭

## 프론트엔드 구조

### 폴더 구조
```
src/router/
├── config/
│   ├── constants.ts           # 라우터 전역 상수
│   ├── menu/
│   │   └── registry.ts        # 메뉴 레지스트리 (수집 & 필터링)
│   └── routes/
│       ├── index.tsx          # 전체 라우트 통합
│       ├── private.ts         # 인증 필요 라우트
│       └── public.ts          # 공개 라우트
├── guards/
│   └── RequireAuth.tsx        # 권한 체크 가드
├── layouts/
│   └── PrivateLayout.tsx      # 인증된 사용자 레이아웃
└── index.ts                   # 라우터 진입점
```

### 서비스별 라우트 구조
```
src/service/{서비스명}/routes/
├── constants.ts               # 라우트 상수 정의
├── menu.ts                    # 메뉴 정의
├── index.ts                   # 라우트 정의
└── admin/                     # 하위 도메인 (선택적)
    ├── constants.ts
    ├── menu.ts
    └── index.ts
```

## 권한 체크 흐름

### 1. 로그인 시
```typescript
// 1. 백엔드에서 사용자 정보와 role 받기
const response = await authApi.login(credentials);

// 2. authStore에 저장
authStore.setUser({
  user: response.user,
  role: {
    pageAccess: ["dashboard.*", "project.list"],
    permissions: ["project:read"]
  }
});
```

### 2. 라우트 접근 시 (RequireAuth)
```typescript
// guards/RequireAuth.tsx
function RequireAuth() {
  const { isAuthenticated, role } = useAuthStore();
  const location = useLocation();

  // 1. 로그인 체크
  if (!isAuthenticated) {
    return <Navigate to={AUTH_ROUTES.LOGIN} />;
  }

  // 2. 현재 경로를 accessKey로 변환
  // /dashboard/home → dashboard.home
  const accessKey = pathToAccessKey(location.pathname);

  // 3. page_access 패턴 매칭
  const isAllowed = matchesPattern(accessKey, role.pageAccess);

  if (!isAllowed) {
    return <Navigate to="/" />;  // 권한 없음
  }

  return <Outlet />;  // 권한 있음, 진행
}
```

### 3. 메뉴 표시 (Sidebar)
```typescript
// components/Sidebar.tsx
function Sidebar() {
  const { role } = useAuthStore();

  // role.pageAccess에 따라 메뉴 필터링
  const filteredMenus = useMemo(() => {
    if (!role) return [];
    return filterMenusByAccess(ALL_MENUS, role.pageAccess);
  }, [role]);

  // 접근 가능한 메뉴만 렌더링
}
```

## 메뉴 시스템

### 메뉴 정의 (정적)
```typescript
// service/dashboard/routes/menu.ts
export const dashboardMenu: MenuItem = {
  id: 'dashboard',
  title: '대시보드',
  path: DASHBOARD_ROUTES.ROOT,    // '/dashboard'
  icon: 'LayoutDashboard',
  accessKey: 'dashboard',          // 패턴 매칭용
  children: [
    {
      id: 'dashboard-home',
      title: '홈',
      path: DASHBOARD_ROUTES.HOME,  // '/dashboard/home'
      accessKey: 'dashboard.home',
      icon: 'Home',
    }
  ]
};
```

### 메뉴 수집 및 필터링
```typescript
// router/config/menu/registry.ts

// 1. 모든 서비스 메뉴 수집
export const ALL_MENUS = [
  dashboardMenu,
  projectMenu,
  adminMenu,
].filter(Boolean);

// 2. page_access에 따른 필터링
export function filterMenusByAccess(
  menus: MenuItem[],
  pageAccess: string[]
): MenuItem[] {
  return menus
    .map(menu => {
      // 현재 메뉴 접근 가능 여부
      const hasAccess = matchesPattern(menu.accessKey, pageAccess);

      // 자식 메뉴 재귀 필터링
      const filteredChildren = menu.children
        ? filterMenusByAccess(menu.children, pageAccess)
        : [];

      // 접근 불가 + 자식도 없으면 제거
      if (!hasAccess && filteredChildren.length === 0) {
        return null;
      }

      return { ...menu, children: filteredChildren };
    })
    .filter(Boolean);
}
```

## 구현 예시

### 1. 새 서비스 추가하기

#### Step 1: 라우트 상수 정의
```typescript
// service/blog/routes/constants.ts
export const PAGE_NAME = 'blog' as const;

export const BLOG_ROUTES = {
  ROOT: `/${PAGE_NAME}`,
  LIST: `/${PAGE_NAME}/list`,
  CREATE: `/${PAGE_NAME}/create`,
  DETAIL: `/${PAGE_NAME}/:id`,
} as const;
```

#### Step 2: 메뉴 정의
```typescript
// service/blog/routes/menu.ts
import { BLOG_ROUTES } from './constants';

export const blogMenu: MenuItem = {
  id: 'blog',
  title: '블로그',
  path: BLOG_ROUTES.ROOT,
  icon: 'FileText',
  accessKey: 'blog',
  children: [
    {
      id: 'blog-list',
      title: '글 목록',
      path: BLOG_ROUTES.LIST,
      accessKey: 'blog.list',
      icon: 'List',
    }
  ]
};
```

#### Step 3: 라우트 정의
```typescript
// service/blog/routes/index.ts
export const blogRoutes: RouteObject[] = [
  {
    path: BLOG_ROUTES.ROOT,
    element: <BlogLayout />,
    children: [
      { path: BLOG_ROUTES.LIST, element: <BlogList /> },
      { path: BLOG_ROUTES.CREATE, element: <BlogCreate /> },
    ]
  }
];
```

#### Step 4: 레지스트리에 추가
```typescript
// router/config/menu/registry.ts
import { blogMenu } from '@/service/blog/routes/menu';

export const ALL_MENUS = [
  dashboardMenu,
  projectMenu,
  blogMenu,  // 추가
  adminMenu,
];
```

```typescript
// router/config/routes/private.ts
import { blogRoutes } from '@/service/blog/routes';

export const privateRoutes: RouteObject[] = [
  ...dashboardRoutes,
  ...blogRoutes,  // 추가
];
```

### 2. 권한 체크 사용 예시

#### 페이지 컴포넌트에서 권한 체크
```typescript
function ProjectCreatePage() {
  const { role } = useAuthStore();

  // CRUD 권한 체크 (permissions)
  const canCreate = role.permissions.includes('project:create');

  if (!canCreate) {
    return <div>프로젝트 생성 권한이 없습니다.</div>;
  }

  return <ProjectForm />;
}
```

#### 조건부 UI 렌더링
```typescript
function ProjectActions() {
  const { hasPermission } = useAuthStore();

  return (
    <div>
      {hasPermission('project:edit') && (
        <Button>수정</Button>
      )}
      {hasPermission('project:delete') && (
        <Button variant="destructive">삭제</Button>
      )}
    </div>
  );
}
```

## 장점

1. **보안**: URL 직접 접근도 차단 (RequireAuth)
2. **UX**: 접근 불가능한 메뉴 미표시
3. **유지보수**: 메뉴와 라우트가 각 서비스에 캡슐화
4. **확장성**: 새 서비스 추가 시 기존 코드 수정 최소화
5. **타입 안전**: TypeScript로 모든 경로 타입 체크

## 주의사항

- **page_access**: 페이지/메뉴 접근 제어용
- **permissions**: CRUD 등 세부 작업 권한용
- 두 개념을 명확히 분리하여 사용
- 백엔드와 프론트엔드의 accessKey 패턴 일치 필요