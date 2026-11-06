import { StudentModel } from "../models/student.model.js";
import pool from "../config/db.js";

//Obtener datos del Estudiante
export const getStudentById = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await StudentModel.findById(id);
        if (!student) {
            return res.status(404).json({
                ok: false,
                message: "Estudiante no encontrado",
            });
        }
        return res.status(200).json({
            ok: true,
            student,
        });
    } catch (error) {
        console.error("Error al obtener el estudiante: ", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
        });
    };
};
//Actualizar datos del estudiante
export const updateStudent = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updated = await StudentModel.update(id, updateData);

        if(!updated) {
            return res.status(404).json({
                ok: false,
                message: "Estudiante no encontrado para actualizar",
            });
        }
        return res.status(200).json({
            ok: true,
            message: "Estudiante actualizado correctamente",
        });
    } catch (error){
        console.error("Error al actualizar el estudiante: ", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
        });
    };
};

export const hireCoach = async (req, res) => {
  try {
    const coachId = req.body.coach_id ?? null;
    const [studentRows] = await pool.query(
      "SELECT id FROM students WHERE user_id = ?",
      [req.user.id]
    );
    if (!studentRows.length) {
      return res.status(404).json({ ok: false, message: "No se encontró el alumno" });
    }
    if (coachId) {
      const [coachRows] = await pool.query(
        "SELECT id FROM coaches WHERE id = ? AND available = TRUE",
        [coachId]
      );
      if (!coachRows.length) {
        return res.status(404).json({ ok: false, message: "Profesor no disponible" });
      }
    }
    await pool.query("UPDATE students SET coach_id = ? WHERE user_id = ?", [
      coachId,
      req.user.id,
    ]);
    return res.json({ ok: true, coach_id: coachId });
  } catch (error) {
    console.error("Error al contratar profesor:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};