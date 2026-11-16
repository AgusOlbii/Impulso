import { StudentModel } from "../models/student.model.js";
import { CoachModel } from "../models/coach.model.js";
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
    await StudentModel.ensureCoachColumn();
    const raw = req.body.coach_id;
    const coachId = raw === null || raw === undefined || raw === "" ? null : Number(raw);
    if (coachId !== null && Number.isNaN(coachId)) {
      return res.status(400).json({ ok: false, message: "Profesor inválido" });
    }
    const [studentRows] = await pool.query(
      "SELECT id FROM students WHERE user_id = ?",
      [req.user.id]
    );
    if (!studentRows.length) {
      return res.status(404).json({ ok: false, message: "No se encontró el alumno" });
    }
    if (coachId) {
      const [coachRows] = await pool.query(
        "SELECT id FROM coaches WHERE id = ?",
        [coachId]
      );
      if (!coachRows.length) {
        return res.status(404).json({ ok: false, message: "Profesor no disponible" });
      }
    }
    await StudentModel.ensureCoachNoteColumn();
    await pool.query("UPDATE students SET coach_id = ?, coach_note = NULL WHERE user_id = ?", [
      coachId,
      req.user.id,
    ]);
    return res.json({ ok: true, coach_id: coachId });
  } catch (error) {
    console.error("Error al contratar profesor:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};

export const updateCoachNote = async (req, res) => {
  try {
    await StudentModel.ensureCoachColumn();
    await StudentModel.ensureCoachNoteColumn();
    const coach = await CoachModel.findByUserId(req.user.id);
    if (!coach) {
      return res.status(404).json({ ok: false, message: "No se encontró el perfil de profesor" });
    }
    const student = await StudentModel.findById(req.params.id);
    if (!student || Number(student.coach_id) !== Number(coach.id)) {
      return res.status(403).json({ ok: false, message: "Ese alumno no está a tu cargo" });
    }
    const note = String(req.body.coach_note ?? "").slice(0, 600);
    await pool.query("UPDATE students SET coach_note = ? WHERE id = ?", [note || null, student.id]);
    return res.json({ ok: true, coach_note: note });
  } catch (error) {
    console.error("Error al guardar la nota:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};