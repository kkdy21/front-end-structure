import type { BookmarkDTO } from "../schema/dto/bookmarkDTO";

import type { BookmarkCreateParameters } from "../schema/api-verbs/create";
import type {
  BookmarkGetListParameters,
  BookmarkGetParameters,
} from "../schema/api-verbs/get";
import type { BookmarkUpdateParameters } from "../schema/api-verbs/update";
import type { AxiosResponse } from "axios";

export interface IBookmarkRepository {
  path: string;
  getBookmarks(
    params: BookmarkGetListParameters
  ): Promise<AxiosResponse<BookmarkDTO[]>>;
  getBookmark(
    params: BookmarkGetParameters
  ): Promise<AxiosResponse<BookmarkDTO>>;
  createBookmark(
    params: BookmarkCreateParameters
  ): Promise<AxiosResponse<BookmarkDTO>>;
  updateBookmark(
    params: BookmarkUpdateParameters
  ): Promise<AxiosResponse<BookmarkDTO>>;
  deleteBookmark(id: string): Promise<AxiosResponse<void>>;
}
