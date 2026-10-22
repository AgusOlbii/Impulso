// src/models/coach.model.js
import pool from "../config/db.js";

export class CoachModel {
  // Obtener todos los profesores de la base de datos
  static async findAll() {
    const [rows] = await pool.query("SELECT * FROM coaches");
    return rows;
  }

  // Buscar un profesor por su ID
  static async findById(id) {
    const [rows] = await pool.query("SELECT * FROM coaches WHERE id = ?", [id]);
    return rows[0]; // Retorna el profesor o undefined si no existe
  }
    // Buscar un profesor por su Nombre y Apellido
  static async findByFullName(name, lastname) {
    const [rows] = await pool.query("SELECT * FROM coaches WHERE name = ? and lastname = ?", [name, lastname]);
    return rows[0]; // Retorna el profesor o undefined si no existe
  }

  // Crear un nuevo profesor
  static async create({ name, specialty, experience, rating, reviews, price, description, image, position, available }) {
    const [result] = await pool.query(
      `INSERT INTO coaches (name, specialty, experience, rating, reviews, price, description, image, position, available) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, 
        specialty, 
        experience, 
        rating || 5.0, 
        reviews || 0, 
        price, 
        description, 
        image, 
        position || 'center', 
        available !== undefined ? available : true
      ]
    );

    return {
      id: result.insertId,
      name,
      specialty,
      price
    };
  }
}