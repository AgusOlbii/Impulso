import { PaymentModel } from "../models/payment.model.js";

// Crear un pago / contratación en modalidad Escrow (Lo inicia el Alumno)
export const createPayment = async (req, res) => {
    try {
        const { student_id, coach_id, amount, platform_fee_percentage } = req.body;

        const newPayment = await PaymentModel.create({
            student_id,
            coach_id,
            amount,
            platform_fee_percentage
        });

        return res.status(201).json({
            ok: true,
            message: "Pago registrado en garantía (escrow) exitosamente",
            payment: newPayment
        });
    } catch (error) {
        console.error("Error al crear el pago:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};


// Obtener solicitudes de contratación pendientes para el coach autenticado
export const getPendingRequests = async (req, res) => {
    try {
        const coach_id = req.user.id; // Obtenido del token JWT

        const requests = await PaymentModel.getPendingRequestsByCoach(coach_id);

        return res.status(200).json({
            ok: true,
            pending_requests: requests
        });
    } catch (error) {
        console.error("Error al obtener solicitudes pendientes:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};

// Completar / Aceptar pago (Lo hace el Coach cuando acepta la solicitud)
export const completePayment = async (req, res) => {
    try {
        const { id } = req.params; // ID del pago

        const updated = await PaymentModel.completePayment(id);

        if (!updated) {
            return res.status(400).json({
                ok: false,
                message: "No se pudo completar el pago. Puede que ya haya sido procesado o haya expirado."
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Pago completado y liberado con éxito"
        });
    } catch (error) {
        console.error("Error al completar el pago:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};

// Reembolsar pago (Lo hace el Coach si rechaza la solicitud)
export const refundPayment = async (req, res) => {
    try {
        const { id } = req.params;

        const refunded = await PaymentModel.refundPayment(id);

        if (!refunded) {
            return res.status(400).json({
                ok: false,
                message: "No se pudo reembolsar el pago. Comprueba que su estado sea 'escrow'."
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Pago reembolsado correctamente"
        });
    } catch (error) {
        console.error("Error al reembolsar el pago:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};

// Obtener métricas de ganancias para un Profesor (Coach)
export const getCoachEarnings = async (req, res) => {
    try {
        // Si es coach, puede ver sus propias métricas. Si es admin, puede pasar el coach_id por query params.
        const coach_id = req.user.rol === "coach" ? req.user.id : req.query.coach_id;

        if (!coach_id) {
            return res.status(400).json({
                ok: false,
                message: "Se requiere un ID de profesor válido"
            });
        }

        const metrics = await PaymentModel.getCoachEarningsMetrics(coach_id);

        return res.status(200).json({
            ok: true,
            earnings: metrics
        });
    } catch (error) {
        console.error("Error al obtener métricas de ganancias:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};

// Obtener resumen financiero general de la plataforma (Solo Administradores)
export const getAdminFinancials = async (req, res) => {
    try {
        const overview = await PaymentModel.getAdminFinancialOverview();

        return res.status(200).json({
            ok: true,
            overview
        });
    } catch (error) {
        console.error("Error al obtener resumen financiero global:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};