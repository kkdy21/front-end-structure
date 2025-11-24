import { Outlet } from 'react-router';
import { Sidebar } from '@/components/Sidebar';

// Private routes의 실제 레이아웃 (사이드바, 헤더 등)
// 메뉴 fetch와 권한 체크는 RequireAuth에서 처리
export function PrivateLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
