import type { StudentDTO, StudentStatus } from "../schema/dto/studentDTO";
import { studentStatusOptions, studentGradeOptions } from "../constants";
import type { StudentStatusId, StudentGradeId } from "../types";

export class StudentEntity {
  constructor(private _dto: StudentDTO, public readonly index: number) {}

  get id(): string {
    return this._dto.id;
  }

  get name(): string {
    return this._dto.name;
  }

  get email(): string {
    return this._dto.email;
  }

  get grade(): string {
    return this._dto.grade;
  }

  get gradeId(): StudentGradeId {
    if (studentGradeOptions.isValidOptionValue(this._dto.grade)) {
      return studentGradeOptions.getOptionByValue(this._dto.grade).id;
    }
    return studentGradeOptions.ID.MIDDLE_1;
  }

  get school(): string | undefined {
    return this._dto.school;
  }

  get phone(): string | undefined {
    return this._dto.phone;
  }

  get status(): StudentStatus {
    return this._dto.status;
  }

  get statusId(): StudentStatusId {
    if (studentStatusOptions.isValidOptionValue(this._dto.status)) {
      return studentStatusOptions.getOptionByValue(this._dto.status).id;
    }
    return studentStatusOptions.ID.ACTIVE;
  }

  get isActive(): boolean {
    return this._dto.isActive;
  }

  get createdAt(): Date {
    return new Date(this._dto.createdAt);
  }

  get updatedAt(): Date {
    return new Date(this._dto.updatedAt);
  }

  get dto(): StudentDTO {
    return this._dto;
  }
}
