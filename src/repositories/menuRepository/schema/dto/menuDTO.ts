export type MenuDTO = {
    id: string;
    title: string;
    path: string;
    icon: string;
    children: MenuDTO[];
    role: string;
    order: number;
  };
  