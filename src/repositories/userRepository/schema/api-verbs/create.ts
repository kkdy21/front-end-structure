export type UserCreateParameters = {
    id: string;  // Firebase Auth UID
    email: string;
    name: string;
    profileImage?: string;
};
