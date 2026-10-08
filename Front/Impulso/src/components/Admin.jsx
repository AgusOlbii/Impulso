import { useState } from "react";
import applicants from "../data/applicants";
import Header from "../components/Header";
function Admin() {
  const [status, setStatus] = useState("PENDIENTE");

  const filteredApplicants =
    status === "TODOS"
      ? applicants
      : applicants.filter((item) => item.status === status);

  const approveProfessor = (id) => {
    console.log("Aprobando profesor", id);
  };

  return (
    <>
      <Header eyebrow="GESTIÓN" title="Administración" />

      <section className="admin-stats">
        <div className="admin-stat">
          <span>PROFESORES ACTIVOS</span>
          <strong>18</strong>
        </div>

        <div className="admin-stat">
          <span>SOLICITUDES PENDIENTES</span>
          <strong>2</strong>
        </div>

        <div className="admin-stat">
          <span>CLASES ESTA SEMANA</span>
          <strong>42</strong>
        </div>

        <div className="admin-stat">
          <span>INGRESOS DEL MES</span>
          <strong>$482.500</strong>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">PROFESORES</div>
            <h2>Solicitudes</h2>
          </div>

          <div className="filter-tabs">
            {["PENDIENTE", "APROBADO", "TODOS"].map((item) => (
              <button
                key={item}
                className={status === item ? "active" : ""}
                onClick={() => setStatus(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>PROFESOR</th>
                <th>ESPECIALIDAD</th>
                <th>ESTADO</th>
                <th>ACCIÓN</th>
              </tr>
            </thead>

            <tbody>
              {filteredApplicants.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="table-user">
                      <div className="avatar small">
                        {item.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")}
                      </div>

                      <div>
                        <strong>{item.name}</strong>
                        <small>{item.email}</small>
                      </div>
                    </div>
                  </td>

                  <td>{item.specialty}</td>

                  <td>
                    <span
                      className={`status-pill ${
                        item.status === "APROBADO" ? "success" : "warning"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>
                    {item.status === "PENDIENTE" ? (
                      <button
                        className="approve-button"
                        onClick={() => approveProfessor(item.id)}
                      >
                        Aprobar
                      </button>
                    ) : (
                      <button className="more-button">•••</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
export default Admin;
