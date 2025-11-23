import "./App.css";
import TestPage from "./service/test/page/TestPage";

function App() {
  // 테스트 모드: TestPage 렌더링
  return <TestPage />;

  // 기존 코드 (테스트 완료 후 복원)
  // const { menus, fetchMenus } = useMenuStore();
  // useEffect(() => {
  //   fetchMenus();
  // }, []);
  // return <></>;
}

export default App;
