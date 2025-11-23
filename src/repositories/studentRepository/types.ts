import { studentStatusOptions, studentGradeOptions } from "./constants";

export type StudentStatusId = keyof typeof studentStatusOptions.ID;
export type StudentGradeId = keyof typeof studentGradeOptions.ID;
