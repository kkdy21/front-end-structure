
const BOOKMARK_TYPE_OPTIONS = [
  { id: "ADMIN", value: "1", label: "관리자" },
  { id: "WORKSPACE", value: "2", label: "워크스페이스" },
  { id: "USER", value: "3", label: "사용자" },
] as const;

const BOOKMARK_TYPE_ALL_OPTION = {
  id: "ALL",
  value: "0",
  label: "북마크 타입 전체",
} as const;

export const bookmarkTypeOptionsManager = createConstOptionsManager(
  BOOKMARK_TYPE_OPTIONS,
  BOOKMARK_TYPE_ALL_OPTION
);
