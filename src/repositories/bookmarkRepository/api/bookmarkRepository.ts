import { where, orderBy } from "firebase/firestore";
import BaseRepository, { type Unsubscribe } from "@/repositories/baseRepository";
import type {
  BookmarkGetListParameters,
  BookmarkGetParameters,
} from "@/repositories/bookmarkRepository/schema/api-verbs/get";
import type { BookmarkCreateParameters } from "@/repositories/bookmarkRepository/schema/api-verbs/create";
import type { BookmarkUpdateParameters } from "@/repositories/bookmarkRepository/schema/api-verbs/update";
import type { BookmarkDTO } from "@/repositories/bookmarkRepository/schema/dto/bookmarkDTO";
import type { IBookmarkRepository } from "./IBookmarkRepository";

class BookmarkRepository extends BaseRepository implements IBookmarkRepository {
  readonly collectionPath = "bookmarks";

  async getBookmarks(params?: BookmarkGetListParameters): Promise<BookmarkDTO[]> {
    const constraints = [];

    if (params?.tag) {
      constraints.push(where("tag", "==", params.tag));
    }
    // search는 Firestore에서 직접 지원하지 않으므로 클라이언트에서 필터링
    constraints.push(orderBy("createdAt", "desc"));

    const results = await this.getCollection<BookmarkDTO>(
      this.collectionPath,
      constraints
    );

    // search 파라미터가 있으면 클라이언트에서 필터링
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      return results.filter(
        (bookmark) =>
          bookmark.title.toLowerCase().includes(searchLower) ||
          bookmark.description?.toLowerCase().includes(searchLower)
      );
    }

    return results;
  }

  async getBookmark(params: BookmarkGetParameters): Promise<BookmarkDTO | null> {
    return this.getDocument<BookmarkDTO>(this.collectionPath, params.bookmarkId);
  }

  async createBookmark(params: BookmarkCreateParameters): Promise<BookmarkDTO> {
    return this.create<BookmarkDTO, BookmarkCreateParameters>(
      this.collectionPath,
      params
    );
  }

  async updateBookmark(params: BookmarkUpdateParameters): Promise<BookmarkDTO> {
    return this.update<BookmarkDTO, typeof params.bookmark>(
      this.collectionPath,
      params.bookmarkId,
      params.bookmark
    );
  }

  async deleteBookmark(id: string): Promise<void> {
    return this.remove(this.collectionPath, id);
  }

  /**
   * 북마크 목록 실시간 구독
   */
  subscribeBookmarks(
    callback: (data: BookmarkDTO[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    return this.subscribeCollection<BookmarkDTO>(
      this.collectionPath,
      callback,
      [orderBy("createdAt", "desc")],
      onError
    );
  }

  /**
   * 단일 북마크 실시간 구독
   */
  subscribeBookmark(
    id: string,
    callback: (data: BookmarkDTO | null) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    return this.subscribeDocument<BookmarkDTO>(
      this.collectionPath,
      id,
      callback,
      onError
    );
  }
}

export const bookmarkRepository = new BookmarkRepository();
