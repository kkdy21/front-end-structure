import type { RoleDTO } from '../schema/dto/roleDTO';

export class RoleEntity {
  constructor(private _dto: RoleDTO) {}

  get id(): string {
    return this._dto.id;
  }

  get name(): string {
    return this._dto.name;
  }

  get displayName(): string {
    return this._dto.displayName ?? this._dto.name;
  }

  get description(): string | undefined {
    return this._dto.description;
  }

  get pageAccess(): string[] {
    return this._dto.pageAccess ?? [];
  }

  get isActive(): boolean {
    return this._dto.isActive;
  }

  get createdAt(): unknown {
    return this._dto.createdAt;
  }

  get updatedAt(): unknown {
    return this._dto.updatedAt;
  }

  get dto(): RoleDTO {
    return this._dto;
  }
}
