export type IconName =
  | 'LayoutDashboard'
  | 'Home'
  | 'BarChart'
  | 'Settings'
  | 'FileText'
  | 'FolderOpen'
  | 'List'
  | 'Plus'
  | 'Shield'
  | 'Users'
  | 'Key';

export interface MenuItem {
  readonly id: string;
  readonly title: string;
  readonly path: `/${string}`;  // 경로는 /로 시작
  readonly icon: IconName;
  readonly accessKey: string;   // 점(.) 구분 접근 키
  readonly children?: readonly MenuItem[];
}