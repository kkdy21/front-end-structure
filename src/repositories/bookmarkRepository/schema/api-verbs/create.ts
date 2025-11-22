import type { BookmarkDTO } from "@/repositories/bookmarkRepository/schema/dto/bookmarkDTO";

export type BookmarkCreateParameters = Omit<
  BookmarkDTO,
  "id" | "createdAt" | "updatedAt"
>;
