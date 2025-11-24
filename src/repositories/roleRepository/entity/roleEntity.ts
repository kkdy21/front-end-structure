import type { RoleDTO } from '../schema/dto/roleDTO';

export class RoleEntity {
  constructor(private _dto: RoleDTO) {}

  get roleId(): string {
    return this._dto.role_id;
  }

  get name(): string {
    return this._dto.name;
  }

  get roleType(): string {
    return this._dto.role_type;
  }

  get pageAccess(): string[] {
    return this._dto.page_access;
  }

  get state(): 'ENABLED' | 'DISABLED' {
    return this._dto.state;
  }

  get isEnabled(): boolean {
    return this._dto.state === 'ENABLED';
  }

  get createdAt(): string | undefined {
    return this._dto.created_at;
  }

  get updatedAt(): string | undefined {
    return this._dto.updated_at;
  }

  get dto(): RoleDTO {
    return this._dto;
  }
}
