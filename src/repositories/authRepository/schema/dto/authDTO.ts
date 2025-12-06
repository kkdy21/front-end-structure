// authRepository는 Firebase Auth만 담당
// User/Role 정보는 각 repository에서 독립적으로 관리

export interface AuthErrorDTO {
    code: string;
    message: string;
}

/**
 * 회원가입 Cloud Function 응답 데이터
 * user-create Cloud Function의 응답 형식
 */
export interface SignupResultDTO {
    uid: string;
    email: string;
    displayName: string;
    roleId: string;
}
