import { CoachModel } from "../models/coach.model.js";
import { StudentModel } from "../models/student.model.js";

function formatCoach(row) {
  const years = String(row.experience ?? "").trim();
  const numeric = /^\d+$/.test(years);
  const priceNum = Number(row.price);
  const ratingNum = Number(row.rating);
  return {
    id: row.id,
    user_id: row.user_id,
    name: `${row.name} ${row.lastname || ""}`.trim(),
    specialty: row.specialty,
    experience: numeric ? `${years} años de experiencia` : years || "Experiencia a definir",
    price: priceNum > 0 ? `$${priceNum.toLocaleString("es-AR")}` : "A definir",
    description:
      row.description &&
      row.description.trim() &&
      row.description.trim() !== String(row.application_description || "").trim()
        ? row.description
        : "",
    image: row.image || row.image_url ||
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900",
    position: row.position || "center 28%",
    rating: ratingNum > 0 ? String(ratingNum.toFixed(1)).replace(".", ",") : "—",
    reviews: Number(row.reviews) || 0,
    available: row.available,
    student_note: row.student_note || "",
    students: Number(row.student_count) || 0,
  };
}

export const getMyCoachProfile = async (req, res) => {
  try {
    await CoachModel.ensureStudentNoteColumn();
    const coach = await CoachModel.findByUserId(req.user.id);
    if (!coach) {
      return res.status(404).json({ ok: false, message: "No se encontró el perfil de profesor" });
    }
    return res.json({ ok: true, coach });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

export const updateMyCoachProfile = async (req, res) => {
  try {
    const coach = await CoachModel.findByUserId(req.user.id);
    if (!coach) {
      return res.status(404).json({ ok: false, message: "No se encontró el perfil de profesor" });
    }
    await CoachModel.ensureStudentNoteColumn();
    const fields = {};
    if (req.body.description !== undefined) fields.description = req.body.description;
    if (req.body.student_note !== undefined) fields.student_note = req.body.student_note;
    if (req.body.price !== undefined) fields.price = req.body.price;
    if (!Object.keys(fields).length) {
      return res.status(400).json({ ok: false, message: "Indicá la descripción, el precio o la nota" });
    }
    await CoachModel.update(coach.id, fields);
    const updated = await CoachModel.findByUserId(req.user.id);
    return res.json({ ok: true, coach: updated });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

export const updateCoach = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updated = await CoachModel.update(id, updateData);

        if (!updated) {
            return res.status(404).json({
                ok: false,
                message: "Profesor no encontrado para actualizar",
            });
        }
        
        return res.status(200).json({
            ok: true,
            message: "Profesor actualizado correctamente",
        });
    } catch (error) {
        console.error("Error al actualizar el profesor: ", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
        });
    }
};
// Controller para traer todos los coach
export const getAllCoaches = async (req, res) => {
    try {
        await CoachModel.ensureStudentNoteColumn();
        await StudentModel.ensureCoachColumn();
        const coaches = await CoachModel.findAllAvailable();

        return res.status(200).json({
            ok: true,
            coaches: coaches.map(formatCoach),
        });
    } catch (error) {
        console.error("Error al obtener los profesores: ", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
        });
    }
};

// Controller para traer un solo coach por ID
export const getCoachById = async (req, res) => {
    const { id } = req.params;

    try {
        const coach = await CoachModel.findByUserId(id);

        if (!coach) {
            return res.status(404).json({
                ok: false,
                message: "Profesor no encontrado",
            });
        }

        return res.status(200).json({
            ok: true,
            coach,
        });
    } catch (error) {
        console.error("Error al obtener el profesor: ", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
        });
    }
};
// Controller para traer todos los estudiantes de un profesor
export const getMyStudents = async (req, res) => {
    try {
        const coach = await CoachModel.findByUserId(req.user.id);
        if (!coach) {
            return res.status(404).json({
                ok: false,
                message: "No se encontró el perfil de profesor",
            });
        }
        await StudentModel.ensureCoachColumn();
        await StudentModel.ensureCoachNoteColumn();
        const students = await CoachModel.getStudentsByCoach(coach.id);

        return res.status(200).json({
            ok: true,
            students
        });
    } catch (error) {
        console.error("Error al obtener los alumnos del coach:", error);
        return res.status(500).json({ ok: false, message: "Error interno" });
    }
};