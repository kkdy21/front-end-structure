import { where, orderBy } from "firebase/firestore";
import BaseRepository, { type Unsubscribe } from "@/repositories/baseRepository";
import type {
  StudentGetListParameters,
  StudentGetParameters,
} from "../schema/api-verbs/get";
import type { StudentCreateParameters } from "../schema/api-verbs/create";
import type { StudentUpdateParameters } from "../schema/api-verbs/update";
import type { StudentDTO } from "../schema/dto/studentDTO";
import type { IStudentRepository } from "./IStudentRepository";

class StudentRepository extends BaseRepository implements IStudentRepository {
  /**
   * 사용자별 학생 컬렉션 경로 생성
   * Firestore 구조: users/{userId}/students
   */
  private getCollectionPath(): string {
    const uid = this.checkAuth();
    return `users/${uid}/students`;
  }

  async getStudents(params?: StudentGetListParameters): Promise<StudentDTO[]> {
    const constraints = [];

    if (params?.status) {
      constraints.push(where("status", "==", params.status));
    }
    if (params?.grade) {
      constraints.push(where("grade", "==", params.grade));
    }

    constraints.push(orderBy("createdAt", "desc"));

    const results = await this.getCollection<StudentDTO>(
      this.getCollectionPath(),
      constraints
    );

    // search 파라미터가 있으면 클라이언트에서 필터링
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      return results.filter(
        (student) =>
          student.name.toLowerCase().includes(searchLower) ||
          student.email.toLowerCase().includes(searchLower) ||
          student.school?.toLowerCase().includes(searchLower)
      );
    }

    return results;
  }

  async getStudent(params: StudentGetParameters): Promise<StudentDTO | null> {
    return this.getDocument<StudentDTO>(this.getCollectionPath(), params.studentId);
  }

  async createStudent(params: StudentCreateParameters): Promise<StudentDTO> {
    const uid = this.checkAuth();
    return this.create<StudentDTO, StudentCreateParameters & { userId: string }>(
      this.getCollectionPath(),
      { ...params, userId: uid }
    );
  }

  async updateStudent(params: StudentUpdateParameters): Promise<StudentDTO> {
    return this.update<StudentDTO, typeof params.student>(
      this.getCollectionPath(),
      params.studentId,
      params.student
    );
  }

  async deleteStudent(id: string): Promise<void> {
    return this.remove(this.getCollectionPath(), id);
  }

  /**
   * 학생 목록 실시간 구독
   */
  subscribeStudents(
    callback: (data: StudentDTO[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    return this.subscribeCollection<StudentDTO>(
      this.getCollectionPath(),
      callback,
      [orderBy("createdAt", "desc")],
      onError
    );
  }

  /**
   * 단일 학생 실시간 구독
   */
  subscribeStudent(
    id: string,
    callback: (data: StudentDTO | null) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    return this.subscribeDocument<StudentDTO>(
      this.getCollectionPath(),
      id,
      callback,
      onError
    );
  }
}

export const studentRepository = new StudentRepository();
