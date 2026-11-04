import { CoachModel } from "../models/coach.model.js";

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
        const coaches = await CoachModel.findAllAvailable();

        return res.status(200).json({
            ok: true,
            coaches,
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
        const coach_id = req.user.id;
        
        // Aquí llamas al modelo que trae los alumnos del profesor
        const students = await CoachModel.getStudentsByCoach(coach_id);

        return res.status(200).json({
            ok: true,
            students
        });
    } catch (error) {
        console.error("Error al obtener los alumnos del coach:", error);
        return res.status(500).json({ ok: false, message: "Error interno" });
    }
};