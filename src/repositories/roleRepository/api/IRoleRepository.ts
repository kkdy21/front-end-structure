import type { RoleDTO } from "../schema/dto/roleDTO";
import type {
    RoleGetParameters,
    RoleGetByUserIdParameters,
    RoleGetListParameters,
} from "../schema/api-verbs/get";

export interface IRoleRepository {
    // 조회
    getRoles(params?: RoleGetListParameters): Promise<RoleDTO[]>;
    getRole(params: RoleGetParameters): Promise<RoleDTO | null>;
    getRoleByUserId(params: RoleGetByUserIdParameters): Promise<RoleDTO | null>;
}
