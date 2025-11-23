import type { Unsubscribe } from "@/repositories/baseRepository";
import type { StudentDTO } from "../schema/dto/studentDTO";
import type { StudentCreateParameters } from "../schema/api-verbs/create";
import type {
  StudentGetListParameters,
  StudentGetParameters,
} from "../schema/api-verbs/get";
import type { StudentUpdateParameters } from "../schema/api-verbs/update";

export interface IStudentRepository {
  // 조회
  getStudents(params?: StudentGetListParameters): Promise<StudentDTO[]>;
  getStudent(params: StudentGetParameters): Promise<StudentDTO | null>;

  // CRUD
  createStudent(params: StudentCreateParameters): Promise<StudentDTO>;
  updateStudent(params: StudentUpdateParameters): Promise<StudentDTO>;
  deleteStudent(id: string): Promise<void>;

  // 실시간 구독
  subscribeStudents(
    callback: (data: StudentDTO[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe;
  subscribeStudent(
    id: string,
    callback: (data: StudentDTO | null) => void,
    onError?: (error: Error) => void
  ): Unsubscribe;
}
