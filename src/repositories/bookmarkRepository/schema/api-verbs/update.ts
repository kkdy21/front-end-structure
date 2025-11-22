import type { BookmarkDTO } from "@/repositories/bookmarkRepository/schema/dto/bookmarkDTO";

export interface BookmarkUpdateParameters {
  bookmarkId: string;
  bookmark: Partial<Omit<BookmarkDTO, "id" | "createdAt" | "updatedAt">>;
}
