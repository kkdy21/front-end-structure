export interface UserDTO {
    id: string;
    email: string;
    name: string;
    displayName?: string;       // 백엔드 호환
    profileImage?: string;
    photoURL?: string;          // 백엔드 호환
    googleId?: string;
    roleId?: string;            // Role 참조 ID
    pageAccess?: string[];      // 접근 가능한 페이지 패턴
    isActive?: boolean;         // 기본값: true (UserEntity에서 처리)
    createdAt?: string;
    updatedAt?: string;
    deactivatedAt?: string;
}

// authStore에서 사용하는 간소화된 User 타입
export interface User {
    id: string;
    email: string;
    name: string;
}

/**
 * 사용자 데이터 통계 DTO
 */
export interface UserDataStatsDTO {
    userId: string;
    totalDocuments: number;
    collectionStats: {
        [collectionName: string]: number;
    };
    userInfo: {
        name: string;
        email: string;
        isActive: boolean;
        createdAt?: string;
    };
}

/**
 * 사용자 데이터 백업 DTO
 */
export interface UserDataBackupDTO {
    userId: string;
    userProfile: UserDTO;
    collections: {
        [collectionName: string]: Array<{
            id: string;
            data: Record<string, unknown>;
        }>;
    };
    createdAt: string;
    backupType: 'full' | 'partial';
}
