export interface RoleDTO {
  role_id: string;
  name: string;
  role_type: string;
  page_access: string[];  // 페이지 접근 패턴 ["dashboard.*", "project.list"]
  state: 'ENABLED' | 'DISABLED';
  created_at?: string;
  updated_at?: string;
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
