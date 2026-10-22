// src/controllers/coach.controller.js
import { CoachModel } from "../models/coach.model.js";

export const getCoaches = async (req, res) => {
  try {
    const coaches = await CoachModel.findAll();
    res.json(coaches);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los profesores", error: error.message });
  }
};

export const createCoach = async (req, res) => {
  try {
    const newCoach = await CoachModel.create(req.body);
    res.status(201).json(newCoach);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el profesor", error: error.message });
  }
};