import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function LayoutAdmin() {
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    if (!alertShown) {
      MySwal.fire({
        title: "Notificación",
        text: "Tienes 5 peticiones que revisar.",
        icon: "info",
        confirmButtonText: "Entendido",
      });
      setAlertShown(true);
    }
  }, [alertShown]);

  return (
    <>
      <Header />
      <main className="mx-5 mt-4">
        <Outlet />
      </main>
    </>
  );
}

export default LayoutAdmin;
