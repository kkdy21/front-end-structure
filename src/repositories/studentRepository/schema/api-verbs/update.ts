import type { StudentDTO } from "../dto/studentDTO";

export interface StudentUpdateParameters {
  studentId: string;
  student: Partial<Omit<StudentDTO, "id" | "createdAt" | "updatedAt" | "userId">>;
}
