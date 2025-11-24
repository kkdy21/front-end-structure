import { where, orderBy } from "firebase/firestore";
import BaseRepository from "@/repositories/baseRepository";
import type {
    RoleGetParameters,
    RoleGetByUserIdParameters,
    RoleGetListParameters,
} from "../schema/api-verbs/get";
import type { RoleDTO } from "../schema/dto/roleDTO";
import type { IRoleRepository } from "./IRoleRepository";
import { ROLE_COLLECTION_PATH, USER_ROLES_COLLECTION_PATH } from "../constants";

interface UserRoleDTO {
    userId: string;
    roleId: string;
}

class RoleRepository extends BaseRepository implements IRoleRepository {
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
}

export const roleRepository = new RoleRepository();
