import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  QueryConstraint,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { httpsCallable } from "firebase/functions";
import { db, storage, functions, auth } from "@/libs/firebase";

// Unsubscribe 타입 re-export (Store에서 사용)
export type { Unsubscribe } from "firebase/firestore";

export default class BaseRepository {
  /**
   * 인증 체크 - 로그인 안 되어있으면 에러
   */
  protected checkAuth(): string {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      // TODO: 라우트 구현 후 주석 해제
      // window.location.href = "/login";
      throw new Error("인증이 필요합니다.");
    }
    return uid;
  }

  /**
   * Firestore - 컬렉션 목록 조회
   */
  protected async getCollection<T>(
    path: string,
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    this.checkAuth();
    const q = query(collection(db, path), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as T[];
  }

  /**
   * Firestore - 단일 문서 조회
   */
  protected async getDocument<T>(path: string, id: string): Promise<T | null> {
    this.checkAuth();
    const docSnap = await getDoc(doc(db, path, id));
    return docSnap.exists()
      ? ({ id: docSnap.id, ...docSnap.data() } as T)
      : null;
  }

  /**
   * Firestore - 문서 생성
   */
  protected async create<T, D extends object>(path: string, data: D): Promise<T> {
    this.checkAuth();
    const docRef = await addDoc(collection(db, path), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const created = await getDoc(docRef);
    return { id: created.id, ...created.data() } as T;
  }

  /**
   * Firestore - 문서 수정
   */
  protected async update<T, D extends object>(
    path: string,
    id: string,
    data: D
  ): Promise<T> {
    this.checkAuth();
    const docRef = doc(db, path, id);
    await updateDoc(docRef, { ...data, updatedAt: new Date() });
    const updated = await getDoc(docRef);
    return { id: updated.id, ...updated.data() } as T;
  }

  /**
   * Firestore - 문서 삭제
   */
  protected async remove(path: string, id: string): Promise<void> {
    this.checkAuth();
    await deleteDoc(doc(db, path, id));
  }

  /**
   * Storage - 파일 업로드
   */
  protected async uploadFile(path: string, file: File): Promise<string> {
    this.checkAuth();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  /**
   * Storage - 파일 URL 조회
   */
  protected async getFileUrl(path: string): Promise<string> {
    this.checkAuth();
    const storageRef = ref(storage, path);
    return getDownloadURL(storageRef);
  }

  /**
   * Functions - Cloud Functions 호출 (복잡한 비즈니스 로직용)
   */
  protected async call<T, D = unknown>(
    functionName: string,
    data?: D
  ): Promise<T> {
    this.checkAuth();
    const callable = httpsCallable<D, T>(functions, functionName);
    const result = await callable(data as D);
    return result.data;
  }

  /**
   * Firestore - 컬렉션 실시간 구독
   * @returns Unsubscribe 함수 (cleanup용)
   */
  protected subscribeCollection<T>(
    path: string,
    callback: (data: T[]) => void,
    constraints: QueryConstraint[] = [],
    onError?: (error: Error) => void
  ): Unsubscribe {
    this.checkAuth();
    const q = query(collection(db, path), ...constraints);

    return onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        callback(data);
      },
      (error) => {
        console.error(`Collection subscription error (${path}):`, error);
        onError?.(error);
      }
    );
  }

  /**
   * Firestore - 단일 문서 실시간 구독
   * @returns Unsubscribe 함수 (cleanup용)
   */
  protected subscribeDocument<T>(
    path: string,
    id: string,
    callback: (data: T | null) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    this.checkAuth();
    const docRef = doc(db, path, id);

    return onSnapshot(
      docRef,
      (snapshot) => {
        const data = snapshot.exists()
          ? ({ id: snapshot.id, ...snapshot.data() } as T)
          : null;
        callback(data);
      },
      (error) => {
        console.error(`Document subscription error (${path}/${id}):`, error);
        onError?.(error);
      }
    );
  }
}
