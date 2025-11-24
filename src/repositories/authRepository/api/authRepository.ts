import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
    type User as FirebaseUser,
    type Unsubscribe,
} from 'firebase/auth';
import { auth } from '@/libs/firebase';
import { userRepository } from '@/repositories/userRepository/api/userRepository';
import { roleRepository } from '@/repositories/roleRepository/api/roleRepository';
import type { LoginParameters, SignupParameters } from '../schema/api-verbs/login';
import type { LoginResponseDTO } from '../schema/dto/authDTO';
import type { IAuthRepository } from './IAuthRepository';

class AuthRepository implements IAuthRepository {
    /**
     * 로그인
     * 1. Firebase Auth 로그인
     * 2. Firestore에서 유저 정보 조회
     * 3. Firestore에서 role 정보 조회
     */
    async login(params: LoginParameters): Promise<LoginResponseDTO> {
        const credential = await signInWithEmailAndPassword(auth, params.email, params.password);
        const firebaseUser = credential.user;

        const userDTO = await userRepository.getUser({ userId: firebaseUser.uid });
        if (!userDTO) {
            throw new Error('사용자 정보를 찾을 수 없습니다.');
        }

        const roleDTO = await roleRepository.getRoleByUserId({ userId: firebaseUser.uid });
        if (!roleDTO) {
            throw new Error('권한 정보를 찾을 수 없습니다.');
        }

        return {
            user: { id: userDTO.id, email: userDTO.email, name: userDTO.name },
            role: roleDTO,
        };
    }

    /**
     * 회원가입
     * 1. Firebase Auth 계정 생성
     * 2. Firestore에 유저 정보 저장
     */
    async signup(params: SignupParameters): Promise<void> {
        const credential = await createUserWithEmailAndPassword(auth, params.email, params.password);
        const firebaseUser = credential.user;

        await userRepository.createUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || params.email,
            name: params.name,
        });
    }

    /**
     * 로그아웃
     */
    async logout(): Promise<void> {
        await signOut(auth);
    }

    /**
     * 비밀번호 재설정 이메일 발송
     */
    async resetPassword(email: string): Promise<void> {
        await sendPasswordResetEmail(auth, email);
    }

    /**
     * 현재 로그인된 사용자 정보로 인증 상태 복원
     */
    async restoreAuthState(firebaseUser: FirebaseUser): Promise<LoginResponseDTO | null> {
        const userDTO = await userRepository.getUser({ userId: firebaseUser.uid });
        if (!userDTO) {
            return null;
        }

        const roleDTO = await roleRepository.getRoleByUserId({ userId: firebaseUser.uid });
        if (!roleDTO) {
            return null;
        }

        return {
            user: { id: userDTO.id, email: userDTO.email, name: userDTO.name },
            role: roleDTO,
        };
    }

    /**
     * Firebase Auth 상태 변경 리스너
     */
    subscribeAuthState(
        onAuthenticated: (user: FirebaseUser) => void,
        onUnauthenticated: () => void
    ): Unsubscribe {
        return onAuthStateChanged(auth, (user) => {
            if (user) {
                onAuthenticated(user);
            } else {
                onUnauthenticated();
            }
        });
    }
}

export const authRepository = new AuthRepository();
