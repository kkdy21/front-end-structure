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
import type { LoginParameters, SignupParameters } from '../schema/api-verbs/login';
import type { IAuthRepository } from './IAuthRepository';

/**
 * AuthRepository - Firebase Auth만 담당
 * User/Role 조회는 각 repository에서 독립적으로 수행
 */
class AuthRepository implements IAuthRepository {
    /**
     * Firebase Auth 로그인
     * @returns Firebase User (uid 포함)
     */
    async login(params: LoginParameters): Promise<FirebaseUser> {
        const credential = await signInWithEmailAndPassword(auth, params.email, params.password);
        return credential.user;
    }

    /**
     * Firebase Auth 회원가입
     * @returns Firebase User (uid 포함)
     */
    async signup(params: SignupParameters): Promise<FirebaseUser> {
        const credential = await createUserWithEmailAndPassword(auth, params.email, params.password);
        return credential.user;
    }

    /**
     * Firebase Auth 로그아웃
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
     * 현재 로그인된 Firebase User 조회
     */
    getCurrentUser(): FirebaseUser | null {
        return auth.currentUser;
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
