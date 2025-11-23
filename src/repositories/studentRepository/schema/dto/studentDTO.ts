export type StudentStatus = "active" | "withdrawn";

export type StudentDTO = {
  id: string;
  name: string;
  email: string;
  grade: string;
  school?: string;
  phone?: string;
  status: StudentStatus;
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
};
