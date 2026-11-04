import { ReviewModel } from "../models/review.model.js";

// Crear una reseña (Lo hace el alumno)
export const createReview = async (req, res) => {
    try {
        const student_id = req.user.id; // ID del alumno autenticado 
        const { coach_id, rating, comment } = req.body;

        // Verificar si el alumno ya calificó a este profesor previamente
        const existingReview = await ReviewModel.findByStudentAndCoach(student_id, coach_id);
        if (existingReview) {
            return res.status(400).json({
                ok: false,
                message: "Ya has calificado a este profesor anteriormente."
            });
        }

        const newReview = await ReviewModel.create({
            coach_id,
            student_id,
            rating,
            comment
        });

        return res.status(201).json({
            ok: true,
            message: "Reseña creada con éxito",
            review: newReview
        });
    } catch (error) {
        console.error("Error al crear la reseña:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};

// Obtener todas las reseñas de un profesor específico (Pública o protegida)
export const getReviewsByCoach = async (req, res) => {
    try {
        const { coach_id } = req.params;

        const reviews = await ReviewModel.findByCoachId(coach_id);

        return res.status(200).json({
            ok: true,
            reviews
        });
    } catch (error) {
        console.error("Error al obtener las reseñas:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};

// Eliminar una reseña
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        // El coach_id asociado debe pasarse por query params o extraerse según quién lo borre
        const { coach_id } = req.body; 

        if (!coach_id) {
            return res.status(400).json({
                ok: false,
                message: "Se requiere el ID del profesor para actualizar las métricas"
            });
        }

        const deleted = await ReviewModel.delete(id, coach_id);

        if (!deleted) {
            return res.status(400).json({
                ok: false,
                message: "No se encontró la reseña o no pudo ser eliminada"
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Reseña eliminada correctamente"
        });
    } catch (error) {
        console.error("Error al eliminar la reseña:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};