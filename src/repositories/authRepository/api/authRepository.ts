import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
    type User as FirebaseUser,
    type Unsubscribe,
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, functions } from '@/libs/firebase';
import type { LoginParameters, SignupParameters } from '../schema/api-verbs/login';
import type { SignupResultDTO } from '../schema/dto/authDTO';
import type { IAuthRepository } from './IAuthRepository';
import type { CloudFunctionResponse } from '@/repositories/types';

/**
 * AuthRepository - Firebase Auth만 담당
 * User/Role 조회는 각 repository에서 독립적으로 수행
 */
class AuthRepository implements IAuthRepository {
    /**
     * Firebase Auth 로그인 (이메일/비밀번호)
     * @returns Firebase User (uid 포함)
     */
    async login(params: LoginParameters): Promise<FirebaseUser> {
        const credential = await signInWithEmailAndPassword(auth, params.email, params.password);
        return credential.user;
    }

    /**
     * Firebase Auth Google 로그인
     * @returns Firebase User (uid 포함)
     */
    async loginWithGoogle(): Promise<FirebaseUser> {
        const provider = new GoogleAuthProvider();
        const credential = await signInWithPopup(auth, provider);
        return credential.user;
    }

    /**
     * 회원가입 - Cloud Function 호출
     * 백엔드에서 Firebase Auth 사용자 생성 + Firestore에 사용자 정보 저장
     */
    async signup(params: SignupParameters): Promise<SignupResultDTO> {
        const createUser = httpsCallable<SignupParameters, CloudFunctionResponse<SignupResultDTO>>(
            functions,
            'userCreate'
        );
        const result = await createUser(params);

        if (!result.data.success) {
            throw new Error(result.data.message || '회원가입에 실패했습니다.');
        }

        return result.data.data;
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
     * authStateReady()로 세션 복원 완료 후 즉시 현재 상태 콜백 + 이후 변경 감지
     */
    subscribeAuthState(
        onAuthenticated: (user: FirebaseUser) => void,
        onUnauthenticated: () => void
    ): Unsubscribe {
        let unsubscribe: Unsubscribe = () => {};

        auth.authStateReady().then(() => {
            // 1. 세션 복원 완료 후 즉시 현재 상태로 콜백 호출
            const currentUser = auth.currentUser;
            if (currentUser) {
                onAuthenticated(currentUser);
            } else {
                onUnauthenticated();
            }

            // 2. 이후 상태 변경 감지용 리스너 등록
            unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    onAuthenticated(user);
                } else {
                    onUnauthenticated();
                }
            });
        });

        return () => unsubscribe();
    }
}

export const authRepository = new AuthRepository();
