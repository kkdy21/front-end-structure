import type { UserDTO } from "../schema/dto/userDTO";
import type {
    UserGetParameters,
    UserGetListParameters,
} from "../schema/api-verbs/get";
import type { UserCreateParameters } from "../schema/api-verbs/create";
import type { UserUpdateParameters } from "../schema/api-verbs/update";

export interface IUserRepository {
    // 조회
    getUsers(params?: UserGetListParameters): Promise<UserDTO[]>;
    getUser(params: UserGetParameters): Promise<UserDTO | null>;

    // CRUD
    createUser(params: UserCreateParameters): Promise<UserDTO>;
    updateUser(params: UserUpdateParameters): Promise<UserDTO>;
    deleteUser(userId: string): Promise<void>;
}
