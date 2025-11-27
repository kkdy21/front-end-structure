// authRepository는 Firebase Auth만 담당
// User/Role 정보는 각 repository에서 독립적으로 관리
// 이 파일은 필요시 Auth 관련 추가 DTO 정의용으로 유지

export interface AuthErrorDTO {
    code: string;
    message: string;
}
