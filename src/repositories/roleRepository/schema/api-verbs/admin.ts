/**
 * Role Admin API - Request/Response Types
 *
 * Admin 전용 Role 관리 API
 */

// ==================== Request Types ====================

/**
 * Role 목록 조회 요청 (Admin)
 */
export interface AdminGetRolesParameters {
    includeInactive?: boolean;
}

/**
 * 유저에게 Role 할당 요청
 */
export interface AssignRoleParameters {
    userId: string;
    roleId: string;
}

/**
 * 유저의 Role 제거 요청
 */
export interface RemoveRoleParameters {
    userId: string;
}

/**
 * 특정 Role의 유저 목록 조회 요청
 */
export interface GetUsersByRoleParameters {
    roleId: string;
}

// ==================== Response Types ====================

/**
 * Role 정보 (백엔드 응답)
 */
export interface RoleResponse {
    id: string;
    name: string;
    displayName: string;
    description?: string;
    pageAccess: string[];
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * 유저 정보 (백엔드 응답)
 */
export interface UserWithRoleResponse {
    id: string;
    email: string;
    displayName: string;
    photoURL?: string;
    roleId: string | null;
    pageAccess: string[];
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Role 목록 조회 응답
 */
export interface GetRolesResponse {
    roles: RoleResponse[];
}

/**
 * Role 할당/제거 응답
 */
export interface AssignRoleResponse {
    user: UserWithRoleResponse;
}

/**
 * 역할별 유저 목록 조회 응답
 */
export interface GetUsersByRoleResponse {
    role: RoleResponse;
    users: UserWithRoleResponse[];
}
