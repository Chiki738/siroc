import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import LayoutAdmin from "./layouts/LayoutAdmin";
import Dashboard from "./pages/Dashboard";
import Ong from "./pages/DetalleOng";
import Solicitudes from "./pages/Solicitudes";
import Validaciones from "./pages/Validaciones";
import Registro from "./pages/Registro";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Registro" element={<Registro />} />
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<Solicitudes />} />
          <Route path="validaciones" element={<Validaciones />} />
          <Route path="ong/:id" element={<Ong />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
