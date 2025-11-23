import { create } from "zustand";
import { BookmarkEntity } from "@/repositories/bookmarkRepository/entity/bookmarkEntity";
import type { BookmarkGetListParameters } from "@/repositories/bookmarkRepository/schema/api-verbs/get";
import type { BookmarkCreateParameters } from "@/repositories/bookmarkRepository/schema/api-verbs/create";
import type { BookmarkUpdateParameters } from "@/repositories/bookmarkRepository/schema/api-verbs/update";
import type { BaseState, BaseActions } from "@/repositories/baseStore";
import { baseInitialState } from "@/repositories/baseStore";
import type { BookmarkDTO } from "@/repositories/bookmarkRepository/schema/dto/bookmarkDTO";
import type { Unsubscribe } from "@/repositories/baseRepository";
import { referenceRepository } from "@/repositories/referenceRepository";

interface BookmarkState extends BaseState, BaseActions {
    // State
    bookmarks: BookmarkEntity[];
    currentBookmark: BookmarkEntity | null;

    // Actions - 일반 조회
    getBookmarks: (params?: BookmarkGetListParameters) => Promise<void>;
    getBookmark: (id: string) => Promise<void>;

    // Actions - CRUD
    createBookmark: (params: BookmarkCreateParameters) => Promise<void>;
    updateBookmark: (params: BookmarkUpdateParameters) => Promise<void>;
    deleteBookmark: (id: string) => Promise<void>;

    // Actions - 실시간 구독
    subscribeBookmarks: () => Unsubscribe;
    subscribeBookmark: (id: string) => Unsubscribe;
}

export const useBookmarkStore = create<BookmarkState>((set) => {
    const { bookmarkRepository: bookmark } = referenceRepository;

    return {
        // Initial State
        ...baseInitialState,
        bookmarks: [],
        currentBookmark: null,

        // Actions - 일반 조회
        getBookmarks: async (params) => {
            set({ isLoading: true, error: null });
            try {
                const data = await bookmark.getBookmarks(params);
                const entities = data.map(
                    (dto: BookmarkDTO, index: number) => new BookmarkEntity(dto, index)
                );
                set({ bookmarks: entities, isLoading: false });
            } catch (err) {
                set({ error: err as Error, isLoading: false });
            }
        },

        getBookmark: async (id) => {
            set({ isLoading: true, error: null });
            try {
                const data = await bookmark.getBookmark({ bookmarkId: id });
                set({
                    currentBookmark: data ? new BookmarkEntity(data, 0) : null,
                    isLoading: false,
                });
            } catch (err) {
                set({ error: err as Error, isLoading: false });
            }
        },

        // Actions - CRUD
        createBookmark: async (params) => {
            set({ isLoading: true, error: null });
            try {
                const data = await bookmark.createBookmark(params);
                const newEntity = new BookmarkEntity(data, 0);
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
                const data = await bookmark.updateBookmark(params);
                const updatedEntity = new BookmarkEntity(data, 0);
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

        // Actions - 실시간 구독
        subscribeBookmarks: () => {
            set({ isLoading: true, error: null });
            return bookmark.subscribeBookmarks(
                (data) => {
                    const entities = data.map(
                        (dto: BookmarkDTO, index: number) => new BookmarkEntity(dto, index)
                    );
                    set({ bookmarks: entities, isLoading: false });
                },
                (error) => {
                    set({ error, isLoading: false });
                }
            );
        },

        subscribeBookmark: (id: string) => {
            set({ isLoading: true, error: null });
            return bookmark.subscribeBookmark(
                id,
                (data) => {
                    set({
                        currentBookmark: data ? new BookmarkEntity(data, 0) : null,
                        isLoading: false,
                    });
                },
                (error) => {
                    set({ error, isLoading: false });
                }
            );
        },

        clearError: () => set({ error: null }),
    };
});
