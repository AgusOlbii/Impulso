import { CoachApplicationModel } from "../models/coachApplication.model.js";
import { StudentModel } from "../models/student.model.js";
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

    const [existingCoach] = await connection.query(
      "SELECT id FROM coaches WHERE user_id = ?",
      [application.user_id]
    );
    if (existingCoach.length) {
      const [availableCol] = await connection.query("SHOW COLUMNS FROM coaches LIKE 'available'");
      if (availableCol.length) {
        await connection.query(
          "UPDATE coaches SET specialty = ?, experience = ?, description = ?, available = TRUE WHERE user_id = ?",
          [application.specialty, application.experience, "", application.user_id]
        );
      } else {
        await connection.query(
          "UPDATE coaches SET specialty = ?, experience = ?, description = ? WHERE user_id = ?",
          [application.specialty, application.experience, "", application.user_id]
        );
      }
    } else {
      await connection.query(
        "INSERT INTO coaches (user_id, specialty, experience, description, price) VALUES (?, ?, ?, ?, ?)",
        [application.user_id, application.specialty, application.experience, "", 0]
      );
    }

    const [studentRows] = await connection.query(
      "SELECT id FROM students WHERE user_id = ?",
      [application.user_id]
    );
    const studentId = studentRows[0]?.id;
    if (studentId) {
      const [coachIdCol] = await connection.query("SHOW COLUMNS FROM students LIKE 'coach_id'");
      if (coachIdCol.length) {
        await connection.query("UPDATE students SET coach_id = NULL WHERE id = ?", [studentId]);
      }
      await connection.query("DELETE FROM payments WHERE student_id = ?", [studentId]);
      await connection.query("DELETE FROM reviews WHERE student_id = ?", [studentId]);
      await connection.query("DELETE FROM routines WHERE student_id = ?", [studentId]);
      await connection.query("DELETE FROM students WHERE id = ?", [studentId]);
    }

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
      console.error(" Error al rechazar la solicitud:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  async removeCoach(req, res) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const { id } = req.params;
      const typedName = String(req.body?.confirm_name || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

      const [rows] = await connection.query(
        `SELECT c.id, c.user_id, u.name, u.lastname
         FROM coaches c
         JOIN users u ON u.id = c.user_id
         WHERE c.id = ?`,
        [id]
      );
      const coach = rows[0];
      if (!coach) {
        await connection.rollback();
        connection.release();
        return res.status(404).json({ ok: false, message: "Profesor no encontrado" });
      }

      const expected = `${coach.name} ${coach.lastname || ""}`
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

      if (!typedName || typedName !== expected) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({
          ok: false,
          message: "El nombre no coincide. Escribí el nombre completo del profesor para confirmar.",
        });
      }

      await StudentModel.ensureCoachColumn();
      await connection.query("UPDATE students SET coach_id = NULL WHERE coach_id = ?", [coach.id]);

      const [availableCol] = await connection.query("SHOW COLUMNS FROM coaches LIKE 'available'");
      if (availableCol.length) {
        await connection.query("UPDATE coaches SET available = FALSE WHERE id = ?", [coach.id]);
      }

      await connection.query("UPDATE users SET rol = 'student' WHERE id = ?", [coach.user_id]);
      await connection.query(
        "UPDATE coach_applications SET status = 'rejected' WHERE user_id = ? AND status = 'approved'",
        [coach.user_id]
      );
      const [studentRows] = await connection.query(
        "SELECT id FROM students WHERE user_id = ?",
        [coach.user_id]
      );
      if (!studentRows.length) {
        await connection.query("INSERT INTO students (user_id) VALUES (?)", [coach.user_id]);
      }

      await connection.commit();
      connection.release();
      return res.json({ ok: true, message: "El profesor fue eliminado del equipo." });
    } catch (error) {
      await connection.rollback();
      connection.release();
      console.error("Error al eliminar profesor:", error);
      return res.status(500).json({ ok: false, message: error.message });
    }
  },
};