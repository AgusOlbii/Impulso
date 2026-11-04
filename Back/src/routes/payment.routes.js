import { Router } from "express";
import { createPayment, getPendingRequests, completePayment, refundPayment, getCoachEarnings, getAdminFinancials } from "../controllers/payment.controller.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { createPaymentSchema } from "../schemas/payment.schema.js";

const router = Router();

// Todas las rutas de pagos exigen autenticación
router.use(authenticateToken);

// Registrar un nuevo pago en escrow (Lo hace el alumno)
router.post("/", validateSchema(createPaymentSchema), createPayment);

// Obtener las solicitudes de alumnos pendientes de aprobación
router.get("/coach/pending-requests", authorizeRoles("coach", "admin"), getPendingRequests);

// El coach acepta el pago y lo pasa a 'completed' se le pasa id del payment
router.patch("/:id/complete", authorizeRoles("coach", "admin"), completePayment);

// El coach rechaza/reembolsa el pago en escrow se le pasa id del payment
router.patch("/:id/refund", authorizeRoles("coach", "admin"), refundPayment);

// Ver métricas de ganancias del profesor autenticado (o administrador consultando)
router.get("/coach/earnings", authorizeRoles("coach", "admin"), getCoachEarnings);

// Ver panel financiero global de la plataforma (Solo Administrador)
router.get("/admin/overview", authorizeRoles("admin"), getAdminFinancials);

export default router;