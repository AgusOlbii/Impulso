import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Admin from "./components/Admin";
import Profesores from "./components/Profesores";
import Home from "./components/Home";
import Professor from "./components/Professor";
import Profile from "./components/Profile";
import Routine from "./components/Routine";

export default function App() {
  const [page, setPage] = useState("inicio");

  const renderPage = () => {
    switch (page) {
      case "inicio":
        return <Home setPage={setPage} />;

      case "profesores":
        return <Profesores />;

      case "rutina":
        return <Routine />;

      case "profesor":
        return <Professor />;

      case "admin":
        return <Admin />;

      case "perfil":
        return <Profile />;

      default:
        return <Home setPage={setPage} />;
    }
  };

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} />

      <main className="main-content">
        <div className="content-container">{renderPage()}</div>
      </main>
    </div>
  );
}
