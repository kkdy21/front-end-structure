import { createOptions } from "@/utils/optionsFactory";

const STUDENT_STATUS_OPTIONS = [
  { id: "ACTIVE", value: "active", label: "재원" },
  { id: "WITHDRAWN", value: "withdrawn", label: "퇴원" },
] as const;

const STUDENT_STATUS_ALL_OPTION = {
  id: "ALL",
  value: "",
  label: "상태 전체",
} as const;

export const studentStatusOptions = createOptions(
  STUDENT_STATUS_OPTIONS,
  STUDENT_STATUS_ALL_OPTION
);

const STUDENT_GRADE_OPTIONS = [
  { id: "ELEMENTARY_1", value: "초1", label: "초1" },
  { id: "ELEMENTARY_2", value: "초2", label: "초2" },
  { id: "ELEMENTARY_3", value: "초3", label: "초3" },
  { id: "ELEMENTARY_4", value: "초4", label: "초4" },
  { id: "ELEMENTARY_5", value: "초5", label: "초5" },
  { id: "ELEMENTARY_6", value: "초6", label: "초6" },
  { id: "MIDDLE_1", value: "중1", label: "중1" },
  { id: "MIDDLE_2", value: "중2", label: "중2" },
  { id: "MIDDLE_3", value: "중3", label: "중3" },
  { id: "HIGH_1", value: "고1", label: "고1" },
  { id: "HIGH_2", value: "고2", label: "고2" },
  { id: "HIGH_3", value: "고3", label: "고3" },
] as const;

const STUDENT_GRADE_ALL_OPTION = {
  id: "ALL",
  value: "",
  label: "학년 전체",
} as const;

export const studentGradeOptions = createOptions(
  STUDENT_GRADE_OPTIONS,
  STUDENT_GRADE_ALL_OPTION
);
