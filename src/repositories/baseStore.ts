/**
 * 모든 스토어의 공통 상태
 */
export interface BaseState {
    isLoading: boolean;
    error: Error | null;
}

/**
 * 공통 액션
 */
export interface BaseActions {
    clearError: () => void;
}

/**
 * 공통 초기 상태
 */
export const baseInitialState: BaseState = {
    isLoading: false,
    error: null,
};
