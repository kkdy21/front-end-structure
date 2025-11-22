import type { MenuDTO } from "@/repositories/menuRepository/schema/dto/menuDTO";

export class MenuEntity {
  constructor(private _dto: MenuDTO, public readonly index: number) {}

  get id(): string {
    return this._dto.id;
  }

  get title(): string {
    return this._dto.title;
  }

  get path(): string {
    return this._dto.path;
  }

  get icon(): string {
    return this._dto.icon;
  }

  get children(): MenuEntity[] {
    return this._dto.children.map(
      (child, index) => new MenuEntity(child, index)
    );
  }

  get role(): string {
    return this._dto.role;
  }

  get order(): number {
    return this._dto.order;
  }
  get dto(): MenuDTO {
    return this._dto;
  }
}
