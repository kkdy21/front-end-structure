export interface UserDTO {
    id: string;
    email: string;
    name: string;
    profileImage?: string;
    createdAt?: string;
    updatedAt?: string;
}

// authStore에서 사용하는 간소화된 User 타입
export interface User {
    id: string;
    email: string;
    name: string;
}
