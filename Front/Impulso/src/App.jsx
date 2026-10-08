import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Admin from "./components/Admin";
import Classes from "./components/Classes";
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

      case "clases":
        return <Classes />;

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
