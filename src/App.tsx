import { useEffect } from "react";
import "./App.css";
import { useMenuStore } from "./repositories/menuRepository/store/menuStore";

function App() {
  const { menus, fetchMenus } = useMenuStore();
  console.log(menus);

  useEffect(() => {
    // window.mswControl?.help();
    fetchMenus();
  }, []);

  return <></>;
}

export default App;
