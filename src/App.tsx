import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Login = lazy(() => import("./pages/Login"));
const LayoutAdmin = lazy(() => import("./layouts/LayoutAdmin"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DetalleOng = lazy(() => import("./pages/DetalleOng"));
const Solicitudes = lazy(() => import("./pages/Solicitudes"));
const Validaciones = lazy(() => import("./pages/Validaciones"));
const Registro = lazy(() => import("./pages/Registro"));

function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      Cargando vista...
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Registro" element={<Registro />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/admin" element={<LayoutAdmin />}>
            <Route index element={<Solicitudes />} />
            <Route path="validaciones" element={<Validaciones />} />
            <Route path="ong/:id" element={<DetalleOng />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
