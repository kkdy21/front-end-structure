export type RoleGetParameters = {
    roleId: string;
};

export type RoleGetByUserIdParameters = {
    userId: string;
};

export type RoleGetListParameters = {
    state?: 'ENABLED' | 'DISABLED';
    roleType?: string;
};
