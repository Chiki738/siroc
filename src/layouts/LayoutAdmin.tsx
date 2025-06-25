import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function LayoutAdmin() {
  return (
    <>
      <Header />
      <main className="mx-5 mt-4">
        <Outlet /> {/* Aquí se renderizan las páginas hijas */}
      </main>
    </>
  );
}

export default LayoutAdmin;
