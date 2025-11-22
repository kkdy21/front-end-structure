import type { BookmarkDTO } from "../schema/dto/bookmarkDTO";
import { bookmarkTypeOptionsManager } from "../constants";
import { BookmarkTypeId } from "../types";

export class BookmarkEntity {
  constructor(private _dto: BookmarkDTO, public readonly index: number) { }

  get id(): string {
    return this._dto.id;
  }

  get name(): string {
    return this._dto.title;
  }

  get link(): string {
    return this._dto.url;
  }

  get createdAt(): Date {

    return new Date(this._dto.createdAt);
  }

  get updatedAt(): Date {
    return new Date(this._dto.updatedAt);
  }

  get description(): string {
    return this._dto.description;
  }

  get bookmarkType(): BookmarkTypeId {
    // 백엔드 오는 value를 프론트가 관리하는 id로변환
    if (bookmarkTypeOptionsManager.isValidOptionValue(this._dto.type)) {
      return bookmarkTypeOptionsManager.getOptionByValue(this._dto.type).id;
    }
    return bookmarkTypeOptionsManager.ID.USER;
  }
  get dto(): BookmarkDTO {
    return this._dto;
  }
}
