import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/libs/firebase";
import BaseRepository from "@/repositories/baseRepository";
import type {
    UserGetParameters,
    UserGetListParameters,
} from "../schema/api-verbs/get";
import type { UserCreateParameters } from "../schema/api-verbs/create";
import type { UserUpdateParameters } from "../schema/api-verbs/update";
import type { UserDTO } from "../schema/dto/userDTO";
import type { IUserRepository } from "./IUserRepository";
import { USER_COLLECTION_PATH } from "../constants";

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
}

export const userRepository = new UserRepository();
