import type { User } from '@/repositories/userRepository/schema/dto/userDTO';
import type { RoleDTO } from '@/repositories/roleRepository/schema/dto/roleDTO';

export interface LoginResponseDTO {
    user: User;
    role: RoleDTO;
}
