import { Routes, Route, BrowserRouter } from "react-router-dom";

import Login from "../components/Login";
import Listar from "../components/Listar";
const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Listar" element={<Listar />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
