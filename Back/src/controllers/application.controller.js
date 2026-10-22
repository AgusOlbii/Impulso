// src/controllers/application.controller.js
import { ApplicationModel } from "../models/application.model.js";
import { CoachModel } from "../models/coach.model.js"; // <--- Importamos el modelo de coaches
import pool from "../config/db.js";

// El alumno envía su postulación
export const createApplication = async (req, res) => {
  try {
    const userId = req.user.id; // Asumiendo que tenés un middleware de autenticación que inyecta req.user
    const newApp = await ApplicationModel.create(userId, req.body);
    res.status(201).json({ message: "Solicitud enviada con éxito", newApp });
  } catch (error) {
    res.status(500).json({ message: "Error al enviar la solicitud", error: error.message });
  }
};

// El admin ve las solicitudes pendientes
export const getPendingApplications = async (req, res) => {
  try {
    const apps = await ApplicationModel.findPending();
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las solicitudes", error: error.message });
  }
};

// El admin acepta o rechaza
export const handleApplicationAction = async (req, res) => {
  const { id } = req.params; // ID de la solicitud
  const { action } = req.body; // 'approved' o 'rejected'

  try {
    const application = await ApplicationModel.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    if (action === 'approved') {
      // 1. Actualizar estado de la solicitud
      await ApplicationModel.updateStatus(id, 'approved');

      // 2. Cambiar el rol del usuario a 'profesor' en la tabla users
      await pool.query(`UPDATE users SET rol = 'profesor' WHERE id = ?`, [application.user_id]);

      // 3. Obtener el nombre del usuario para pasárselo al modelo
      const [userRows] = await pool.query(`SELECT name FROM users WHERE id = ?`, [application.user_id]);
      const userName = userRows[0].name;

      // 4. Crear el registro en la tabla coaches usando el CoachModel
      await CoachModel.create({
        name: userName,
        specialty: application.specialty,
        experience: application.experience,
        price: application.price,
        description: application.description,
        image: 'default-image.jpg', 
        rating: 5.0,
        reviews: 0,
        position: 'center',
        available: true
      });

      res.json({ message: "Solicitud aceptada. El usuario ahora es profesor." });
    } else {
      // Si es rechazada
      await ApplicationModel.updateStatus(id, 'rejected');
      res.json({ message: "Solicitud rechazada." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al procesar la solicitud", error: error.message });
  }
};