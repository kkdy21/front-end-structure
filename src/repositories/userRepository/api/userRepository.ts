import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/libs/firebase";
import BaseRepository from "@/repositories/baseRepository";
import type {
    UserGetParameters,
    UserGetListParameters,
} from "../schema/api-verbs/get";
import type { UserCreateParameters } from "../schema/api-verbs/create";
import type {
    UserUpdateParameters,
    UserDeactivateParameters,
    UserDeleteParameters,
    UserRestoreParameters,
    UserGetDataStatsParameters,
    UserCreateBackupParameters,
} from "../schema/api-verbs/update";
import type { UserDTO, UserDataStatsDTO, UserDataBackupDTO } from "../schema/dto/userDTO";
import type { IUserRepository } from "./IUserRepository";
import { USER_COLLECTION_PATH } from "../constants";

interface CloudFunctionResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

class UserRepository extends BaseRepository implements IUserRepository {
    async getUsers(params?: UserGetListParameters): Promise<UserDTO[]> {
        const results = await this.getCollection<UserDTO>(USER_COLLECTION_PATH);

        if (params?.search) {
            const searchLower = params.search.toLowerCase();
            return results.filter(
                (user) =>
                    user.name.toLowerCase().includes(searchLower) ||
                    user.email.toLowerCase().includes(searchLower)
            );
        }

        return results;
    }

    async getUser(params: UserGetParameters): Promise<UserDTO | null> {
        // users 컬렉션은 문서 ID가 Firebase Auth UID
        const docSnap = await getDoc(doc(db, USER_COLLECTION_PATH, params.userId));
        return docSnap.exists()
            ? ({ id: docSnap.id, ...docSnap.data() } as UserDTO)
            : null;
    }

    async createUser(params: UserCreateParameters): Promise<UserDTO> {
        // Firebase Auth UID를 document ID로 사용
        const userRef = doc(db, USER_COLLECTION_PATH, params.id);
        const userData = {
            email: params.email,
            name: params.name,
            profileImage: params.profileImage || null,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await setDoc(userRef, userData);

        return {
            id: params.id,
            ...userData,
        } as UserDTO;
    }

    async updateUser(params: UserUpdateParameters): Promise<UserDTO> {
        const userRef = doc(db, USER_COLLECTION_PATH, params.userId);
        await updateDoc(userRef, {
            ...params.user,
            updatedAt: new Date().toISOString(),
        });

        const updated = await getDoc(userRef);
        return { id: updated.id, ...updated.data() } as UserDTO;
    }

    async deleteUser(userId: string): Promise<void> {
        await deleteDoc(doc(db, USER_COLLECTION_PATH, userId));
    }

    // ===== 프로필 관리 (Cloud Functions) =====

    /**
     * 사용자 프로필 비활성화
     * Cloud Function을 통해 처리 (연관 데이터 정리 등)
     */
    async deactivateUserProfile(params: UserDeactivateParameters): Promise<void> {
        const response = await this.call<CloudFunctionResponse<void>, UserDeactivateParameters>(
            'deactivateUserProfile',
            params
        );

        if (!response.success) {
            throw new Error(response.message || '프로필 비활성화에 실패했습니다.');
        }
    }

    /**
     * 사용자 프로필 복구
     */
    async restoreUserProfile(params: UserRestoreParameters): Promise<void> {
        const response = await this.call<CloudFunctionResponse<void>, UserRestoreParameters>(
            'restoreUserProfile',
            params
        );

        if (!response.success) {
            throw new Error(response.message || '프로필 복구에 실패했습니다.');
        }
    }

    /**
     * 사용자 프로필 영구 삭제
     * confirmDeletion이 true인 경우에만 실행
     */
    async deleteUserProfilePermanently(params: UserDeleteParameters): Promise<void> {
        if (!params.confirmDeletion) {
            throw new Error('삭제 확인이 필요합니다.');
        }

        const response = await this.call<CloudFunctionResponse<void>, UserDeleteParameters>(
            'deleteUserProfile',
            params
        );

        if (!response.success) {
            throw new Error(response.message || '프로필 삭제에 실패했습니다.');
        }
    }

    // ===== 데이터 관리 (Cloud Functions) =====

    /**
     * 사용자 데이터 통계 조회
     */
    async getUserDataStats(params: UserGetDataStatsParameters): Promise<UserDataStatsDTO> {
        const response = await this.call<CloudFunctionResponse<UserDataStatsDTO>, UserGetDataStatsParameters>(
            'getUserDataStats',
            params
        );

        if (!response.success || !response.data) {
            throw new Error(response.message || '데이터 통계 조회에 실패했습니다.');
        }

        return response.data;
    }

    /**
     * 사용자 데이터 백업 생성
     */
    async createUserDataBackup(params: UserCreateBackupParameters): Promise<UserDataBackupDTO> {
        const response = await this.call<CloudFunctionResponse<UserDataBackupDTO>, UserCreateBackupParameters>(
            'createUserDataBackup',
            params
        );

        if (!response.success || !response.data) {
            throw new Error(response.message || '데이터 백업 생성에 실패했습니다.');
        }

        return response.data;
    }
}

export const userRepository = new UserRepository();
