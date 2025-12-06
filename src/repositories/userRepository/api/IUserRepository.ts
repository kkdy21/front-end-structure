import type { UserDTO, UserDataStatsDTO, UserDataBackupDTO } from "../schema/dto/userDTO";
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

export interface IUserRepository {
    // 조회
    getUsers(params?: UserGetListParameters): Promise<UserDTO[]>;
    getUser(params: UserGetParameters): Promise<UserDTO | null>;

    // CRUD
    createUser(params: UserCreateParameters): Promise<UserDTO>;
    updateUser(params: UserUpdateParameters): Promise<UserDTO>;
    deleteUser(userId: string): Promise<void>;

    // 프로필 관리 (Cloud Functions 사용)
    deactivateUserProfile(params: UserDeactivateParameters): Promise<void>;
    restoreUserProfile(params: UserRestoreParameters): Promise<void>;
    deleteUserProfilePermanently(params: UserDeleteParameters): Promise<void>;

    // 데이터 관리 (Cloud Functions 사용)
    getUserDataStats(params: UserGetDataStatsParameters): Promise<UserDataStatsDTO>;
    createUserDataBackup(params: UserCreateBackupParameters): Promise<UserDataBackupDTO>;
}
