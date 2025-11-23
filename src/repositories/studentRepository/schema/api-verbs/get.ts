import type { StudentStatus } from "../dto/studentDTO";

export type StudentGetParameters = {
  studentId: string;
};

export type StudentGetListParameters = {
  status?: StudentStatus;
  grade?: string;
  search?: string;
};
