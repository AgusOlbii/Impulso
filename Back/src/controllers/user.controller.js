import { UserModel } from "../models/user.model.js";

//Obtener usuario por ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado",
      });
    }

    res.json({
      ok: true,
      user,
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
    });
  }
};
// Obtener datos del usuario completos (Datos de tabla user y tabla del rol student o coach)
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id; 

    const userData = await UserModel.findByIdWithRoleData(userId);

    if (!userData) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el perfil" });
  }
};


//Actualizar datos del usuario
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updated = await UserModel.update(id, updateData);

        if(!updated) {
            return res.status(404).json({
                ok: false,
                message: "Usuario no encontrado para actualizar",
            });
        }
        return res.status(200).json({
            ok: true,
            message: "Usuario actualizado correctamente",
        });
    } catch (error){
        console.error("Error al actualizar datos del usuario: ", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
        });
    };
};