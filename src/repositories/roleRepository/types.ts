// User 타입은 userRepository/types.ts에서 가져오기
export type { User } from '@/repositories/userRepository/schema/dto/userDTO';

export interface Permissions {
    [key: string]: boolean;  // 기능 권한 매핑 (예: "project.create": true)
}
