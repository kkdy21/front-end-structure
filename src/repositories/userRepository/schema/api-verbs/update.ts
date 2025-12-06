export type UserUpdateParameters = {
    userId: string;
    user: Partial<{
        name: string;
        profileImage: string;
    }>;
};

/**
 * 사용자 프로필 비활성화 파라미터
 */
export interface UserDeactivateParameters {
    userId: string;
}

/**
 * 사용자 프로필 삭제 파라미터
 */
export interface UserDeleteParameters {
    userId: string;
    confirmDeletion: boolean;
}

/**
 * 사용자 프로필 복구 파라미터
 */
export interface UserRestoreParameters {
    userId: string;
}

/**
 * 사용자 데이터 통계 조회 파라미터
 */
export interface UserGetDataStatsParameters {
    userId: string;
}

/**
 * 사용자 데이터 백업 생성 파라미터
 */
export interface UserCreateBackupParameters {
    userId: string;
}
