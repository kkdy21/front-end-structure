## 프로젝트 README: MSW 및 Repository 설정 안내

### Repository 패턴 및 API 관리

이 프로젝트는 API 호출을 추상화하고 데이터 접근 로직을 중앙에서 관리하기 위해 **Repository 패턴**을 사용합니다. 각 도메인 (예: `bookmarks`, `menu`)은 자체 Repository (`src/repositories/bookmarkRepository/api/bookmarkRepository.ts`, `src/repositories/menuRepository/api/menuRepository.ts`)를 가지며, 이는 `BaseRepository`를 확장하여 구현됩니다. 모든 Repository는 `src/repositories/referenceRepository.ts`를 통해 통합되어 참조됩니다.

이러한 구조는 다음과 같은 이점을 제공합니다:
* API 통신 로직의 캡슐화 및 재사용성 증대
* 컴포넌트와 데이터 소스 간의 결합도 감소
* API 명세 변경 시 유지보수 용이성 향상

### Mock Service Worker (MSW) 통합

개발 중 API 모킹을 위해 **Mock Service Worker (MSW)**를 사용합니다. MSW는 실제 백엔드 API 대신 미리 정의된 응답을 반환하여, 프론트엔드 개발 생산성과 테스트 용이성을 높입니다.

#### 주요 특징 및 이점

* **개발 환경 전용**: MSW는 개발 환경(`process.env.NODE_ENV === 'development'`)에서만 활성화됩니다.
* **동적 핸들러 제어**: 브라우저 개발자 콘솔(`window.mswControl`)을 통해 각 API 모킹 핸들러를 실시간으로 제어할 수 있습니다.
* **설정 유지**: 핸들러 활성화 상태는 `localStorage`에 저장되어 세션 간 유지가 가능합니다.
* **Repository 모방**: MSW 핸들러는 각 Repository의 API 호출 경로 및 응답 형식을 모방하여 설계됩니다. (예: `bookmarkMockhandler.ts`는 `bookmarkRepository`의 API를 모킹)
* **독립적인 프론트엔드 개발**: 백엔드 API 개발 진행 상황에 관계없이 UI 개발 및 테스트를 진행할 수 있습니다.
* **다양한 시나리오 테스트**: 성공, 실패, 특정 에러 상황 등 다양한 API 응답 시나리오를 손쉽게 시뮬레이션할 수 있습니다.

#### 시작하기 및 제어

MSW는 애플리케이션 시작 시 자동으로 초기화됩니다. (`src/main.tsx` 참고) 개발자 콘솔에서 `window.mswControl` 객체를 사용하여 핸들러를 관리할 수 있습니다.

**주요 콘솔 명령어**:

* `mswControl.listHandlers()`: 모든 핸들러와 현재 상태를 확인합니다.
* `mswControl.enableHandler('핸들러_ID')` / `mswControl.disableHandler('핸들러_ID')`: 특정 핸들러를 켜거나 끕니다.
* `mswControl.enableGroup('그룹명')` / `mswControl.disableGroup('그룹명')`: 그룹 단위로 핸들러를 제어합니다.
* `mswControl.help()`: 전체 명령어 목록을 확인합니다.

핸들러 ID와 그룹명은 `mswControl.listHandlers()`로 확인하거나, 각 mock 핸들러 파일 (예: `src/repositories/bookmarkRepository/mock/bookmarkMockhandler.ts`, `src/repositories/menuRepository/mock/menuMockhandler.ts`) 내의 상수 정의를 참조할 수 있습니다.

#### 새로운 Mock 핸들러 추가

1.  **핸들러 정의**: 해당 Repository의 `mock` 폴더 (예: `src/repositories/someApiRepository/mock/`)에 `xxxMockhandler.ts` 파일을 생성합니다. 이 파일에는 핸들러 ID, 실제 `msw` 핸들러 로직, 그리고 핸들러 그룹 정보가 포함됩니다. (참고: `bookmarkMockhandler.ts`)
2.  **통합 핸들러 등록**: `src/libs/msw/mswHandlers.ts` 파일의 `mockHandlerGroups` 객체에 새로 만든 핸들러 그룹을 추가합니다.

이 과정을 통해 새로운 API 모킹을 손쉽게 추가하고 관리할 수 있습니다.


turbo, vitest lint-staged 추가