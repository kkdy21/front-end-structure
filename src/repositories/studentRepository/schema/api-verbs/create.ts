import type { StudentDTO } from "../dto/studentDTO";

export type StudentCreateParameters = Omit<
  StudentDTO,
  "id" | "createdAt" | "updatedAt" | "userId"
>;
