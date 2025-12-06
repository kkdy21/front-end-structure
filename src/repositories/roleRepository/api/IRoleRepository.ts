import type { RoleDTO } from "../schema/dto/roleDTO";
import type {
    RoleGetParameters,
    RoleGetByUserIdParameters,
    RoleGetListParameters,
} from "../schema/api-verbs/get";
import type {
    AdminGetRolesParameters,
    AssignRoleParameters,
    RemoveRoleParameters,
    GetUsersByRoleParameters,
    RoleResponse,
    UserWithRoleResponse,
} from "../schema/api-verbs/admin";

export interface IRoleRepository {
    // 조회 (Firestore 직접)
    getRoles(params?: RoleGetListParameters): Promise<RoleDTO[]>;
    getRole(params: RoleGetParameters): Promise<RoleDTO | null>;
    getRoleByUserId(params: RoleGetByUserIdParameters): Promise<RoleDTO | null>;

    // Admin API (Cloud Functions)
    adminGetRoles(params?: AdminGetRolesParameters): Promise<RoleResponse[]>;
    adminAssignRole(params: AssignRoleParameters): Promise<UserWithRoleResponse>;
    adminRemoveRole(params: RemoveRoleParameters): Promise<UserWithRoleResponse>;
    adminGetUsersByRole(params: GetUsersByRoleParameters): Promise<{ role: RoleResponse | null; users: UserWithRoleResponse[] }>;
}
