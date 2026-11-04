import { NotificationModel } from "../models/notification.model.js";

// Obtener todas las notificaciones del usuario autenticado (con filtro opcional de solo no leídas)
export const getMyNotifications = async (req, res) => {
    try {
        const user_id = req.user.id; // Obtenido del token JWT gracias a authenticateToken
        const { unread } = req.query; // Query param opcional: ?unread=true

        let result;
        if (unread === "true") {
            result = await NotificationModel.findUnreadByUserId(user_id);
        } else {
            const notifications = await NotificationModel.findByUserId(user_id);
            result = {
                unread_count: notifications.filter(n => !n.is_read).length,
                notifications
            };
        }

        return res.status(200).json({
            ok: true,
            ...result
        });
    } catch (error) {
        console.error("Error al obtener notificaciones:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};

// Marcar una notificación específica como leída
export const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const updated = await NotificationModel.markAsRead(id, user_id);

        if (!updated) {
            return res.status(404).json({
                ok: false,
                message: "Notificación no encontrada o no autorizada"
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Notificación marcada como leída"
        });
    } catch (error) {
        console.error("Error al marcar notificación:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};

// Marcar todas las notificaciones del usuario como leídas
export const markAllNotificationsAsRead = async (req, res) => {
    try {
        const user_id = req.user.id;

        await NotificationModel.markAllAsRead(user_id);

        return res.status(200).json({
            ok: true,
            message: "Todas las notificaciones fueron marcadas como leídas"
        });
    } catch (error) {
        console.error("Error al marcar todas las notificaciones:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};

// Eliminar una notificación
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const deleted = await NotificationModel.delete(id, user_id);

        if (!deleted) {
            return res.status(404).json({
                ok: false,
                message: "Notificación no encontrada o no autorizada"
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Notificación eliminada correctamente"
        });
    } catch (error) {
        console.error("Error al eliminar notificación:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};