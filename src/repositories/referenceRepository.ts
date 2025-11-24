import { bookmarkRepository } from "./bookmarkRepository/api/bookmarkRepository";
import { studentRepository } from "./studentRepository/api/studentRepository";
import { userRepository } from "./userRepository/api/userRepository";
import { roleRepository } from "./roleRepository/api/roleRepository";
import { authRepository } from "./authRepository/api/authRepository";
// 한개의 referenceRepository를 만들어서 모든 repository들을 여기에 import 후 사용.
// 추후 다른 repository들이 추가될 때마다 여기에 import

export interface Repositories {
    bookmarkRepository: typeof bookmarkRepository;
    studentRepository: typeof studentRepository;
    userRepository: typeof userRepository;
    roleRepository: typeof roleRepository;
    authRepository: typeof authRepository;
}

export const referenceRepository: Repositories = {
    bookmarkRepository: bookmarkRepository,
    studentRepository: studentRepository,
    userRepository: userRepository,
    roleRepository: roleRepository,
    authRepository: authRepository,
};
