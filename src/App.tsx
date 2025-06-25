import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import LayoutAdmin from "./layouts/LayoutAdmin";
import Dashboard from "./pages/Dashboard";
import Ong from "./pages/DetalleOng";
import Historial from "./pages/Historial";
import Solicitudes from "./pages/Solicitudes";
import Validaciones from "./pages/Validaciones";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<Solicitudes />} />
          <Route path="ong" element={<Ong />} />
          <Route path="validaciones" element={<Validaciones />} />
          <Route path="historial" element={<Historial />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
