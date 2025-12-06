export interface RoleDTO {
  id: string;
  name: string;
  displayName?: string;  // 표시용 이름 (예: "관리자", "선생님")
  description?: string;
  pageAccess: string[];  // 페이지 접근 패턴 ["dashboard.*", "admin.users"]
  isActive: boolean;
  createdAt?: unknown;   // Firestore Timestamp
  updatedAt?: unknown;   // Firestore Timestamp
}

export interface UserDTO {
  id: string;
  email: string;
  name: string;
}

// 로그인 응답
export interface LoginResponseDTO {
  user: UserDTO;
  role: RoleDTO;
  permissions?: Record<string, boolean>;  // 기능 권한 (옵셔널)
}
