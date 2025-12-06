import { useEffect, useState, type ReactNode } from 'react';
import { useAuthStore } from '@/repositories/authRepository/store/authStore';
import { useRoleStore } from '@/repositories/roleRepository/store/roleStore';
import { useUserStore } from '@/repositories/userRepository/store/userStore';
import { referenceRepository } from '@/repositories/referenceRepository';
import { RoleEntity } from '@/repositories/roleRepository/entity/roleEntity';
import { Spinner, SpinnerContainer, SpinnerFullPage, SpinnerText } from '@/components/feedback';

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * 앱 초기화 시 Firebase Auth 상태를 감지하고 관련 store들을 복원하는 Provider
 * App.tsx에서 최상위에 감싸서 사용
 *
 * 컨벤션:
 * - AuthProvider는 여러 store를 조합하는 역할만 담당
 * - 각 store는 독립적으로 자신의 상태만 관리
 *
 * 초기화 순서:
 * 1. Firebase Auth 세션 복원 (authStateReady)
 * 2. User 정보 조회 (Firestore)
 * 3. Role 정보 조회 (Firestore)
 * 4. isAppReady: true → children 렌더링
 */
export function AuthProvider({ children }: AuthProviderProps) {
    // 앱 전체 초기화 완료 상태 (Auth + User + Role 모두 로딩 완료)
    const [isAppReady, setIsAppReady] = useState(false);

    const { isInitializing, subscribeAuthState } = useAuthStore();
    const { setCurrentRole, setDefaultRole, clearCurrentRole } = useRoleStore();
    const { getUserById, clearCurrentUser } = useUserStore();

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        /**
         * 유저의 roleId로 Role 정보 조회 후 설정
         */
        const fetchAndSetRole = async (roleId: string) => {
            const { roleRepository } = referenceRepository;
            console.log('[AuthProvider] Fetching role with roleId:', roleId);
            const roleData = await roleRepository.getRole({ roleId });
            console.log('[AuthProvider] Role data from Firestore:', roleData);

            if (roleData) {
                console.log('[AuthProvider] roleData.pageAccess:', roleData.pageAccess);
                console.log('[AuthProvider] typeof roleData.pageAccess:', typeof roleData.pageAccess);
                console.log('[AuthProvider] Array.isArray(roleData.pageAccess):', Array.isArray(roleData.pageAccess));
                const roleEntity = new RoleEntity(roleData);
                console.log('[AuthProvider] RoleEntity pageAccess:', roleEntity.pageAccess);
                setCurrentRole(roleEntity);
            } else {
                console.log('[AuthProvider] No role found, setting default role');
                setDefaultRole();
            }
        };

        /**
         * 앱 초기화 로직 - Auth 상태 확인 후 User/Role 로딩
         * 모든 로딩이 완료되어야 isAppReady: true
         */
        const initializeApp = async () => {
            const { firebaseUser, isAuthenticated } = useAuthStore.getState();
            console.log('[AuthProvider] initializeApp - firebaseUser:', firebaseUser?.uid, 'isAuthenticated:', isAuthenticated);

            if (firebaseUser) {
                try {
                    // 1. User 정보 조회
                    console.log('[AuthProvider] Fetching user with uid:', firebaseUser.uid);
                    await getUserById(firebaseUser.uid);

                    // 2. User의 roleId로 Role 조회
                    const { currentUser } = useUserStore.getState();
                    console.log('[AuthProvider] Current user:', currentUser);
                    console.log('[AuthProvider] User roleId:', currentUser?.roleId);

                    if (currentUser?.roleId) {
                        await fetchAndSetRole(currentUser.roleId);
                    } else {
                        // roleId가 없으면 기본 role 설정
                        console.log('[AuthProvider] No roleId found, setting default role');
                        setDefaultRole();
                    }
                } catch (err) {
                    console.warn('[AuthProvider] User/Role 조회 실패, 기본 role 설정:', err);
                    setDefaultRole();
                }
            } else if (!isAuthenticated) {
                // 진짜 로그아웃 상태일 때만 초기화
                clearCurrentUser();
                clearCurrentRole();
            }

            // 모든 초기화 완료
            console.log('[AuthProvider] App initialization complete');
            setIsAppReady(true);
        };

        try {
            unsubscribe = subscribeAuthState(initializeApp);
        } catch (err) {
            // Firebase 초기화 실패 시 (env 설정 오류 등)
            console.warn('Firebase Auth 초기화 실패:', err);
            useAuthStore.setState({ isInitializing: false });
            setIsAppReady(true); // 에러 시에도 앱 진행
        }

        return () => unsubscribe?.();
    }, [subscribeAuthState, getUserById, setCurrentRole, setDefaultRole, clearCurrentUser, clearCurrentRole]);

    // Firebase Auth 초기화 중이거나 User/Role 로딩 중이면 로딩 화면
    if (isInitializing || !isAppReady) {
        return (
            <SpinnerFullPage>
                <SpinnerContainer>
                    <Spinner size="lg" />
                    <SpinnerText>로딩 중...</SpinnerText>
                </SpinnerContainer>
            </SpinnerFullPage>
        );
    }

    return <>{children}</>;
}
