import { createConstOptionsManager } from "../../utils/constOptionsManager";

const ROLE_OPTIONS = [
  { id: "ADMIN", value: "1", label: "관리자" },
  { id: "USER", value: "2", label: "사용자" },
  { id: "GUEST", value: "3", label: "게스트" },
] as const;

const ROLE_ALL_OPTION = {
  id: "ALL",
  value: "0",
  label: "모든 권한",
} as const;

export const roleOptionsManager = createConstOptionsManager(
  ROLE_OPTIONS,
  ROLE_ALL_OPTION
);
