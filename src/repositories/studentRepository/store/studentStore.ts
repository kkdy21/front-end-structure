import { create } from "zustand";
import { StudentEntity } from "../entity/studentEntity";
import type { StudentGetListParameters } from "../schema/api-verbs/get";
import type { StudentCreateParameters } from "../schema/api-verbs/create";
import type { StudentUpdateParameters } from "../schema/api-verbs/update";
import type { BaseState, BaseActions } from "@/repositories/baseStore";
import { baseInitialState } from "@/repositories/baseStore";
import type { StudentDTO } from "../schema/dto/studentDTO";
import type { Unsubscribe } from "@/repositories/baseRepository";
import { referenceRepository } from "@/repositories/referenceRepository";

interface StudentState extends BaseState, BaseActions {
  // State
  students: StudentEntity[];
  currentStudent: StudentEntity | null;

  // Actions - 일반 조회
  getStudents: (params?: StudentGetListParameters) => Promise<void>;
  getStudent: (id: string) => Promise<void>;

  // Actions - CRUD
  createStudent: (params: StudentCreateParameters) => Promise<void>;
  updateStudent: (params: StudentUpdateParameters) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;

  // Actions - 실시간 구독
  subscribeStudents: () => Unsubscribe;
  subscribeStudent: (id: string) => Unsubscribe;
}

export const useStudentStore = create<StudentState>((set) => {
  const { studentRepository: student } = referenceRepository;

  return {
    // Initial State
    ...baseInitialState,
    students: [],
    currentStudent: null,

    // Actions - 일반 조회
    getStudents: async (params) => {
      set({ isLoading: true, error: null });
      try {
        const data = await student.getStudents(params);
        const entities = data.map(
          (dto: StudentDTO, index: number) => new StudentEntity(dto, index)
        );
        set({ students: entities, isLoading: false });
      } catch (err) {
        set({ error: err as Error, isLoading: false });
      }
    },

    getStudent: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const data = await student.getStudent({ studentId: id });
        set({
          currentStudent: data ? new StudentEntity(data, 0) : null,
          isLoading: false,
        });
      } catch (err) {
        set({ error: err as Error, isLoading: false });
      }
    },

    // Actions - CRUD
    createStudent: async (params) => {
      set({ isLoading: true, error: null });
      try {
        const data = await student.createStudent(params);
        const newEntity = new StudentEntity(data, 0);
        set((state) => ({
          students: [newEntity, ...state.students],
          isLoading: false,
        }));
      } catch (err) {
        set({ error: err as Error, isLoading: false });
      }
    },

    updateStudent: async (params) => {
      set({ isLoading: true, error: null });
      try {
        const data = await student.updateStudent(params);
        const updatedEntity = new StudentEntity(data, 0);
        set((state) => ({
          students: state.students.map((s) =>
            s.id === updatedEntity.id ? updatedEntity : s
          ),
          currentStudent:
            state.currentStudent?.id === updatedEntity.id
              ? updatedEntity
              : state.currentStudent,
          isLoading: false,
        }));
      } catch (err) {
        set({ error: err as Error, isLoading: false });
      }
    },

    deleteStudent: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await student.deleteStudent(id);
        set((state) => ({
          students: state.students.filter((s) => s.id !== id),
          currentStudent:
            state.currentStudent?.id === id ? null : state.currentStudent,
          isLoading: false,
        }));
      } catch (err) {
        set({ error: err as Error, isLoading: false });
      }
    },

    // Actions - 실시간 구독
    subscribeStudents: () => {
      set({ isLoading: true, error: null });
      return student.subscribeStudents(
        (data) => {
          const entities = data.map(
            (dto: StudentDTO, index: number) => new StudentEntity(dto, index)
          );
          set({ students: entities, isLoading: false });
        },
        (error) => {
          set({ error, isLoading: false });
        }
      );
    },

    subscribeStudent: (id: string) => {
      set({ isLoading: true, error: null });
      return student.subscribeStudent(
        id,
        (data) => {
          set({
            currentStudent: data ? new StudentEntity(data, 0) : null,
            isLoading: false,
          });
        },
        (error) => {
          set({ error, isLoading: false });
        }
      );
    },

    clearError: () => set({ error: null }),
  };
});
