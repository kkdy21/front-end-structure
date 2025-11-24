export type UserUpdateParameters = {
    userId: string;
    user: Partial<{
        name: string;
        profileImage: string;
    }>;
};
