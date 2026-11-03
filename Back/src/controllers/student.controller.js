import { StudentModel } from "../models/student.model.js";

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