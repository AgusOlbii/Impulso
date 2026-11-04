import { Router } from "express";
import { getMyNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from "../controllers/notification.controller.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = Router();

// Todas las rutas de notificaciones exigen que el usuario haya iniciado sesión
router.use(authenticateToken);

// Obtener mis notificaciones (se puede filtrar con ?unread=true)
router.get("/", getMyNotifications);

// Marcar todas como leídas
router.patch("/read-all", markAllNotificationsAsRead);

// Marcar una notificación individual como leída
router.patch("/:id/read", markNotificationAsRead);

// Eliminar una notificación
router.delete("/:id", deleteNotification);

export default router;