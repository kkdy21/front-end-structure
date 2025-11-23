import type { Unsubscribe } from "@/repositories/baseRepository";
import type { BookmarkDTO } from "../schema/dto/bookmarkDTO";
import type { BookmarkCreateParameters } from "../schema/api-verbs/create";
import type {
  BookmarkGetListParameters,
  BookmarkGetParameters,
} from "../schema/api-verbs/get";
import type { BookmarkUpdateParameters } from "../schema/api-verbs/update";

export interface IBookmarkRepository {
  collectionPath: string;

  // 조회
  getBookmarks(params?: BookmarkGetListParameters): Promise<BookmarkDTO[]>;
  getBookmark(params: BookmarkGetParameters): Promise<BookmarkDTO | null>;

  // CRUD
  createBookmark(params: BookmarkCreateParameters): Promise<BookmarkDTO>;
  updateBookmark(params: BookmarkUpdateParameters): Promise<BookmarkDTO>;
  deleteBookmark(id: string): Promise<void>;

  // 실시간 구독
  subscribeBookmarks(
    callback: (data: BookmarkDTO[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe;
  subscribeBookmark(
    id: string,
    callback: (data: BookmarkDTO | null) => void,
    onError?: (error: Error) => void
  ): Unsubscribe;
}
