import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { bookmarkRepository } from "./bookmarkRepository/api/bookmarkRepository";
import { menuRepository } from "./menuRepository/api/menuRepository";
//한개의 referenceRepository를 만들어서 모든 repository들을 여기에 import 후 사용.
// 추후 다른 repository들이 추가될 때마다 여기에 import


const repositoriesConetxt = createContext<Repositories | null>(null);

export const useRepository = () => {
  const repos = useContext(repositoriesConetxt);

  if (!repos) {
    throw new Error('상위에 RepositoryProvider가 필요합니다.');
  }

  return repos;
}

export interface Repositories {
  bookmark: typeof bookmarkRepository;
  menu: typeof menuRepository;
}

export const referenceRepository: Repositories = {
  bookmark: bookmarkRepository,
  menu: menuRepository,
  // 추후 다른 repository 인스턴스들도 여기에 추가
};

export const RepositoryProvider = ({ repositories, children }: { repositories?: Repositories; children: ReactNode }) => {
  return (
    <repositoriesConetxt.Provider value={repositories ?? referenceRepository}>
      {children}
    </repositoriesConetxt.Provider>
  );
};
