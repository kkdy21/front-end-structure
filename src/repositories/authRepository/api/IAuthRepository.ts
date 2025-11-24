import type { User as FirebaseUser, Unsubscribe } from 'firebase/auth';
import type { LoginParameters, SignupParameters } from '../schema/api-verbs/login';
import type { LoginResponseDTO } from '../schema/dto/authDTO';

export interface IAuthRepository {
    // 인증
    login(params: LoginParameters): Promise<LoginResponseDTO>;
    signup(params: SignupParameters): Promise<void>;
    logout(): Promise<void>;
    resetPassword(email: string): Promise<void>;

    // 상태 복원
    restoreAuthState(firebaseUser: FirebaseUser): Promise<LoginResponseDTO | null>;

    // 상태 구독
    subscribeAuthState(
        onAuthenticated: (user: FirebaseUser) => void,
        onUnauthenticated: () => void
    ): Unsubscribe;
}
