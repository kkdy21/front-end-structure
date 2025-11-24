export interface LoginParameters {
    email: string;
    password: string;
}

export interface SignupParameters {
    email: string;
    password: string;
    name: string;
}

export interface ResetPasswordParameters {
    email: string;
}
