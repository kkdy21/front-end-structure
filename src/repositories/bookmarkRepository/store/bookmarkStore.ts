import { create } from "zustand";
import { BookmarkEntity } from "@/repositories/bookmarkRepository/entity/bookmarkEntity";
import type { BookmarkGetListParameters } from "@/repositories/bookmarkRepository/schema/api-verbs/get";
import type { BookmarkCreateParameters } from "@/repositories/bookmarkRepository/schema/api-verbs/create";
import type { BookmarkUpdateParameters } from "@/repositories/bookmarkRepository/schema/api-verbs/update";
import type { BaseState, BaseActions } from "@/repositories/baseStore";
import { baseInitialState } from "@/repositories/baseStore";
import type { BookmarkDTO } from "@/repositories/bookmarkRepository/schema/dto/bookmarkDTO";
import { useRepository } from "@/repositories/referenceRepository";

interface BookmarkState extends BaseState, BaseActions {
    // State
    bookmarks: BookmarkEntity[];
    currentBookmark: BookmarkEntity | null;

    // Actions
    fetchBookmarks: (params?: BookmarkGetListParameters) => Promise<void>;
    fetchBookmark: (id: string) => Promise<void>;
    createBookmark: (params: BookmarkCreateParameters) => Promise<void>;
    updateBookmark: (params: BookmarkUpdateParameters) => Promise<void>;
    deleteBookmark: (id: string) => Promise<void>;
}

export const useBookmarkStore = create<BookmarkState>((set) => {
    const { bookmark } = useRepository();

    return {
        // Initial State
        ...baseInitialState,
        bookmarks: [],
        currentBookmark: null,

        // Actions
        fetchBookmarks: async (params) => {
            set({ isLoading: true, error: null });
            try {
                const res = await bookmark.getBookmarks(params);
                const entities = res.data.map(
                    (dto: BookmarkDTO, index: number) => new BookmarkEntity(dto, index)
                );
                set({ bookmarks: entities, isLoading: false });
            } catch (err) {
                set({ error: err as Error, isLoading: false });
            }
        },

        fetchBookmark: async (id) => {
            set({ isLoading: true, error: null });
            try {
                const res = await bookmark.getBookmark({ bookMark_id: id });
                set({
                    currentBookmark: new BookmarkEntity(res.data, 0),
                    isLoading: false,
                });
            } catch (err) {
                set({ error: err as Error, isLoading: false });
            }
        },

        createBookmark: async (params) => {
            set({ isLoading: true, error: null });
            try {
                const res = await bookmark.createBookmark(params);
                const newEntity = new BookmarkEntity(res.data, 0);
                set((state) => ({
                    bookmarks: [...state.bookmarks, newEntity],
                    isLoading: false,
                }));
            } catch (err) {
                set({ error: err as Error, isLoading: false });
            }
        },

        updateBookmark: async (params) => {
            set({ isLoading: true, error: null });
            try {
                const res = await bookmark.updateBookmark(params);
                const updatedEntity = new BookmarkEntity(res.data, 0);
                set((state) => ({
                    bookmarks: state.bookmarks.map((b) =>
                        b.id === updatedEntity.id ? updatedEntity : b
                    ),
                    currentBookmark:
                        state.currentBookmark?.id === updatedEntity.id
                            ? updatedEntity
                            : state.currentBookmark,
                    isLoading: false,
                }));
            } catch (err) {
                set({ error: err as Error, isLoading: false });
            }
        },

        deleteBookmark: async (id) => {
            set({ isLoading: true, error: null });
            try {
                await bookmark.deleteBookmark(id);
                set((state) => ({
                    bookmarks: state.bookmarks.filter((b) => b.id !== id),
                    currentBookmark:
                        state.currentBookmark?.id === id ? null : state.currentBookmark,
                    isLoading: false,
                }));
            } catch (err) {
                set({ error: err as Error, isLoading: false });
            }
        },

        clearError: () => set({ error: null }),
    };
});
