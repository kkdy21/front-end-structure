export interface LoginParameters {
    email: string;
    password: string;
}

export interface SignupParameters {
    email: string;
    password: string;
    displayName: string;
    roleId?: string;
    metadata?: Record<string, unknown>;
}

export interface ResetPasswordParameters {
    email: string;
}
