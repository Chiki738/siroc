import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function LayoutAdmin() {
  return (
    <>
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
}

export default LayoutAdmin;
