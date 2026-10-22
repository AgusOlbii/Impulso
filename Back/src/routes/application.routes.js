import { Router } from "express";
import { 
  createApplication, 
  getPendingApplications, 
  handleApplicationAction 
} from "../controllers/application.controller.js";
import { auth } from "../middlewares/auth.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { createApplicationSchema } from "../schemas/application.schema.js";

const router = Router();

// El alumno se postula (requiere estar logueado y pasar la validación del esquema)
router.post("/applications", auth, validateSchema(createApplicationSchema), createApplication);

// El admin ve las solicitudes pendientes
router.get("/applications/pending", auth, getPendingApplications);

// El admin aprueba o rechaza una solicitud por su ID
router.put("/applications/:id", auth, handleApplicationAction);

export default router;