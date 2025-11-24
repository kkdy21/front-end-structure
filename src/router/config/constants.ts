export const ROOT_ROUTES = {
  HOME: '/',
  NOT_FOUND: '*',
} as const;

export type RootRoutePath = (typeof ROOT_ROUTES)[keyof typeof ROOT_ROUTES];
