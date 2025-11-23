//기존 상수 관리 방식에서는 프론트엔드와 백엔드 간의 데이터 불일치, UI 표시값 변경 시 코드 수정 및 추가적인 Mapping 객체가 필요한 문제가 있었습니다. 이러한 문제를 해결하기 위해 상수 타입 관리자를 도입하여, 데이터 구조와 표시 로직을 분리하고 타입 안정성을 보장했습니다. 또한 단일 변수에서 상수 정의와 관리가 가능하도록 하여 유지보수성과 가독성을 향상시켰습니다.

/**
* { id, value, label } 구조의 역할과 장점

### id: 프론트엔드 내부용 식별자 (Stable Frontend Identifier)
- 역할: 프론트엔드 코드 내에서 특정 옵션을 식별하기 위한 고유하고 안정적인 키입니다.
- 사용 예:
  - React/Vue 등에서 리스트 렌더링 시 key 값으로 사용 (key={option.id})
  - 로직 분기 처리 (if (selected.id === 'ACTIVE') { ... })
  - 상태 관리 라이브러리에서 특정 아이템을 참조할 때
- 장점: 백엔드에서 사용하는 value 값이 변경되더라도(예: 1 -> PAYMENT_CARD), 프론트엔드 코드는 id를 바라보기 때문에 전혀 영향을 받지 않습니다. 프론트엔드 로직과 백엔드 데이터의 의존성을 분리하는 핵심적인 역할을 합니다.

### value: 백엔드와의 계약 (API Contract Value)
- 역할: 서버로 데이터를 전송하거나 서버로부터 데이터를 받을 때 사용하는 값입니다. 즉, API 스키마와 일치시켜야 하는 값입니다.
- 사용 예:
  - 폼(Form) 전송 시 서버에 보낼 값
  - API 응답으로 받은 값을 해석할 때
- 장점: 프론트엔드의 UI(label)나 내부 로직(id)이 어떻게 바뀌든, 서버와의 통신 규약은 이 value를 통해 일관되게 유지됩니다.

### label: 사용자 표시용 텍스트 (UI Display Text)
- 역할: 화면의 드롭다운, 라디오 버튼, 표 등에 사용자에게 직접 보여줄 텍스트입니다.
- 사용 예:
  - <option value={option.value}>{option.label}</option>
- 장점: 언제든지 기획 변경이나 다국어 지원(i18n) 등으로 텍스트를 수정해야 할 때, label 값만 바꾸면 되므로 다른 로직에 전혀 영향을 주지 않습니다.
 */

/*
- drop down 생성시 default value 설정, key는 id value는 value, render는 label. onChange시 id 또는 value를 전달할거고 그 데이터를 기반으로 value 업데이트
- request 요청시 id를 기반으로 value를 찾아서 적용
- response에서 value값으로 전달했을 때 value로 label을 찾아서 사용 ( value로 id를 찾고 그 id로 label을 찾아서 사용 또는 value로 option을 찾고 label을 찾음)
*/

// 제네릭 타입을 미리 정의하여 가독성을 높입니다.
type BaseOption = { id: string; value: string | number; label: string };
type OptionsArray = readonly BaseOption[];

// --- 함수 오버로딩 선언부 ---

// 시그니처 1: 'allOption'이 제공된 경우의 반환 타입을 정의합니다.
// ('ID_WITH_ALL' 등이 필수로 포함됩니다.)
export function createOptions<
    T extends OptionsArray,
    A extends BaseOption & { id: "ALL" }
>(
    options: T,
    allOption: A
): {
    OPTIONS: T;
    ID: { [K in T[number]["id"]]: K };
    getOptionById: (id: T[number]["id"]) => T[number];
    getOptionByValue: (value: T[number]["value"]) => T[number];
    isValidOptionId: (id: string) => id is T[number]["id"];
    isValidOptionValue: (value: string | number) => value is T[number]["value"];
    ALL_OPTION: A;
    OPTIONS_WITH_ALL: readonly (A | T[number])[];
    ID_WITH_ALL: { [K in A["id"] | T[number]["id"]]: K };
};

// 시그니처 2: 'allOption'이 제공되지 않은 경우의 반환 타입을 정의합니다.
// ('ID_WITH_ALL' 등이 포함되지 않습니다.)
export function createOptions<T extends OptionsArray>(
    options: T
): {
    OPTIONS: T;
    ID: { [K in T[number]["id"]]: K };
    getOptionById: (id: T[number]["id"]) => T[number];
    getOptionByValue: (value: T[number]["value"]) => T[number];
    isValidOptionId: (id: string) => id is T[number]["id"];
    isValidOptionValue: (value: string | number) => value is T[number]["value"];
};

// --- 함수 오버로딩 구현부 ---

// 'any'를 사용하여 실제 구현 로직을 작성할수도 있지만 복잡하지 않아서 타입 작성
export function createOptions<
    T extends OptionsArray,
    A extends BaseOption & { id: "ALL" }
>(options: T, allOption?: A) {
    const idToOptionMap = new Map<T[number]["id"], T[number]>(
        options.map((o) => [o.id, o])
    );
    const valueToOptionMap = new Map<T[number]["value"], T[number]>(
        options.map((o) => [o.value, o])
    );

    const ID = Object.fromEntries(options.map((o) => [o.id, o.id])) as {
        [K in T[number]["id"]]: K;
    };

    const baseManager = {
        OPTIONS: options,
        ID,
        getOptionById: (id: T[number]["id"]) => idToOptionMap.get(id),
        getOptionByValue: (value: T[number]["value"]) =>
            valueToOptionMap.get(value),
        isValidOptionId: (id: string): id is T[number]["id"] =>
            idToOptionMap.has(id as T[number]["id"]),
        isValidOptionValue: (value: string | number): value is T[number]["value"] =>
            valueToOptionMap.has(value as T[number]["value"]),
    };

    if (allOption) {
        return {
            ...baseManager,
            ALL_OPTION: allOption,
            OPTIONS_WITH_ALL: [allOption, ...options],
            ID_WITH_ALL: { ...ID, [allOption.id]: allOption.id },
        };
    }

    return baseManager;
}
