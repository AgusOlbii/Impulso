import { CoachApplicationModel } from "../models/coachApplication.model.js";
import pool from "../config/db.js";

export const adminController = {
  async getPendingApplications(req, res) {
    try {
      const applications = await CoachApplicationModel.findPending('pending');
      return res.json(applications);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

 async approveApplication(req, res) {
  const connection = await pool.getConnection(); 
  try {
    await connection.beginTransaction(); // Iniciamos la transacción

    const { id } = req.params;

    // 1. Obtener la solicitud
    const [apps] = await connection.query("SELECT * FROM coach_applications WHERE id = ?", [id]);
    const application = apps[0];

    if (!application || application.status !== 'pending') {
      await connection.release();
      return res.status(404).json({ message: "Solicitud no encontrada o ya procesada" });
    }

    console.log("🔎 Datos recuperados de la aplicación:", application); 

    // Actualizar estado de la solicitud
    await connection.query("UPDATE coach_applications SET status = 'approved' WHERE id = ?", [id]);

    // Crear el registro en la tabla 'coaches'
    await connection.query(
      "INSERT INTO coaches (user_id, specialty, experience, description, price) VALUES (?, ?, ?, ?, ?)",
      [application.user_id, application.specialty, application.experience, application.description, 0]
    );
    // Lo eliminamos de la tabla students
    await connection.query("DELETE FROM students WHERE user_id = ?", [application.user_id]);
    // Cambiar el rol en la tabla 'users'
    await connection.query("UPDATE users SET rol = 'coach' WHERE id = ?", [application.user_id]);

    await connection.commit(); // Si todo salió bien, guardamos los cambios definitivamente
    connection.release();

    return res.json({ message: "Solicitud aprobada con éxito, usuario ascendido a coach." });
  } catch (error) {
    await connection.rollback(); //Si algo falla, se des hacen todos los cambios (la solicitud vuelve a estar pendiente)
    connection.release();
    console.error("🔥 Error al aprobar la solicitud:", error);
    return res.status(500).json({ error: error.message });
  }
},

async rejectApplication(req, res) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const { id } = req.params;

      // 1. Verificar si la solicitud existe y está pendiente
      const [apps] = await connection.query("SELECT * FROM coach_applications WHERE id = ?", [id]);
      const application = apps[0];

      if (!application || application.status !== 'pending') {
        connection.release();
        return res.status(404).json({ message: "Solicitud no encontrada o ya procesada" });
      }

      // 2. Actualizar el estado de la solicitud a 'rejected'
      await connection.query("UPDATE coach_applications SET status = 'rejected' WHERE id = ?", [id]);

      await connection.commit();
      connection.release();

      return res.json({ message: "Solicitud rechazada con éxito." });
    } catch (error) {
      await connection.rollback();
      connection.release();
      console.error("🔥 Error al rechazar la solicitud:", error);
      return res.status(500).json({ error: error.message });
    }
  }
};