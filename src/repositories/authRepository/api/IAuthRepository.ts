import type { User as FirebaseUser, Unsubscribe } from 'firebase/auth';
import type { LoginParameters, SignupParameters } from '../schema/api-verbs/login';
import type { SignupResultDTO } from '../schema/dto/authDTO';

export interface IAuthRepository {
    // 인증
    login(params: LoginParameters): Promise<FirebaseUser>;
    loginWithGoogle(): Promise<FirebaseUser>;
    signup(params: SignupParameters): Promise<SignupResultDTO>;
    logout(): Promise<void>;
    resetPassword(email: string): Promise<void>;

    // 현재 사용자
    getCurrentUser(): FirebaseUser | null;

    // 상태 구독
    subscribeAuthState(
        onAuthenticated: (user: FirebaseUser) => void,
        onUnauthenticated: () => void
    ): Unsubscribe;
}
