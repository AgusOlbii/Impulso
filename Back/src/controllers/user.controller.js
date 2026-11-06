import { UserModel } from "../models/user.model.js";
import { CoachModel } from "../models/coach.model.js";

export const uploadMyPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, message: "Elegí una foto para subir" });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    await UserModel.update(req.user.id, { image_url: imageUrl });
    if (req.user.rol === "coach") {
      const coach = await CoachModel.findByUserId(req.user.id);
      if (coach) {
        await CoachModel.update(coach.id, { image: imageUrl });
      }
    }
    const user = await UserModel.findByIdWithRoleData(req.user.id);
    return res.json({ ok: true, image_url: imageUrl, user });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

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


export const updateMyProfile = async (req, res) => {
  try {
    const updated = await UserModel.update(req.user.id, req.body || {});
    if (!updated) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado para actualizar",
      });
    }
    const user = await UserModel.findByIdWithRoleData(req.user.id);
    return res.json({
      ok: true,
      message: "Perfil actualizado correctamente",
      user,
    });
  } catch (error) {
    console.error("Error al actualizar el perfil: ", error);
    return res.status(500).json({
      ok: false,
      message: error.message || "Error interno del servidor",
    });
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
        const user = await UserModel.findByIdWithRoleData(id);
        return res.status(200).json({
            ok: true,
            message: "Usuario actualizado correctamente",
            user,
        });
    } catch (error){
        console.error("Error al actualizar datos del usuario: ", error);
        return res.status(500).json({
            ok: false,
            message: error.message || "Error interno del servidor",
        });
    };
};