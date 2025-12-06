import { where, orderBy } from "firebase/firestore";
import BaseRepository from "@/repositories/baseRepository";
import type { CloudFunctionResponse } from "@/repositories/types";
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
    GetRolesResponse,
    AssignRoleResponse,
    GetUsersByRoleResponse,
} from "../schema/api-verbs/admin";
import type { RoleDTO } from "../schema/dto/roleDTO";
import type { IRoleRepository } from "./IRoleRepository";
import { ROLE_COLLECTION_PATH, USER_ROLES_COLLECTION_PATH } from "../constants";

interface UserRoleDTO {
    userId: string;
    roleId: string;
}

class RoleRepository extends BaseRepository implements IRoleRepository {
    // ==================== Firestore 직접 조회 ====================

    async getRoles(params?: RoleGetListParameters): Promise<RoleDTO[]> {
        const constraints = [];

        if (params?.state) {
            constraints.push(where("state", "==", params.state));
        }
        if (params?.roleType) {
            constraints.push(where("role_type", "==", params.roleType));
        }

        constraints.push(orderBy("name", "asc"));

        return this.getCollection<RoleDTO>(ROLE_COLLECTION_PATH, constraints);
    }

    async getRole(params: RoleGetParameters): Promise<RoleDTO | null> {
        return this.getDocument<RoleDTO>(ROLE_COLLECTION_PATH, params.roleId);
    }

    async getRoleByUserId(params: RoleGetByUserIdParameters): Promise<RoleDTO | null> {
        // 1. userRoles 컬렉션에서 userId로 roleId 조회
        const userRoles = await this.getCollection<UserRoleDTO>(
            USER_ROLES_COLLECTION_PATH,
            [where("userId", "==", params.userId)]
        );

        if (userRoles.length === 0) {
            return null;
        }

        // 2. roleId로 실제 role 정보 조회
        const roleId = userRoles[0].roleId;
        return this.getDocument<RoleDTO>(ROLE_COLLECTION_PATH, roleId);
    }

    // ==================== Admin API (Cloud Functions) ====================

    /**
     * Role 목록 조회 (Admin only)
     */
    async adminGetRoles(params?: AdminGetRolesParameters): Promise<RoleResponse[]> {
        const response = await this.call<CloudFunctionResponse<GetRolesResponse>, AdminGetRolesParameters>(
            'roleGetAll',
            params ?? {}
        );
        return response.data.roles;
    }

    /**
     * 유저에게 Role 할당 (Admin only)
     */
    async adminAssignRole(params: AssignRoleParameters): Promise<UserWithRoleResponse> {
        const response = await this.call<CloudFunctionResponse<AssignRoleResponse>, AssignRoleParameters>(
            'roleAssignToUser',
            params
        );
        return response.data.user;
    }

    /**
     * 유저의 Role 제거 (Admin only)
     */
    async adminRemoveRole(params: RemoveRoleParameters): Promise<UserWithRoleResponse> {
        const response = await this.call<CloudFunctionResponse<AssignRoleResponse>, RemoveRoleParameters>(
            'roleRemoveFromUser',
            params
        );
        return response.data.user;
    }

    /**
     * 특정 Role의 유저 목록 조회 (Admin only)
     */
    async adminGetUsersByRole(params: GetUsersByRoleParameters): Promise<{ role: RoleResponse | null; users: UserWithRoleResponse[] }> {
        const response = await this.call<CloudFunctionResponse<GetUsersByRoleResponse>, GetUsersByRoleParameters>(
            'roleGetUsersByRole',
            params
        );
        return response?.data ?? { role: null, users: [] };
    }
}

export const roleRepository = new RoleRepository();
