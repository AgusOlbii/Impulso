import { CoachModel } from "../models/coach.model.js";
import pool from "../config/db.js";

function formatCoach(row) {
  const years = String(row.experience ?? "").trim();
  const numeric = /^\d+$/.test(years);
  return {
    id: row.id,
    user_id: row.user_id,
    name: `${row.name} ${row.lastname || ""}`.trim(),
    specialty: row.specialty,
    experience: numeric ? `${years} años de experiencia` : years || "Experiencia a definir",
    price: Number(row.price) > 0
      ? `$${Number(row.price).toLocaleString("es-AR")}`
      : "A definir",
    rawPrice: Number(row.price) || 0,
    description: row.description,
    image: row.image || row.image_url ||
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900",
    position: row.position || "center 28%",
    rating: row.avg_rating != null
      ? String(row.avg_rating).replace(".", ",")
      : "—",
    reviews: Number(row.review_count) || 0,
    available: row.available,
  };
}

export const listCoaches = async (req, res) => {
  try {
    const coaches = await CoachModel.findAllAvailable();
    return res.json({ ok: true, coaches: coaches.map(formatCoach) });
  } catch (error) {
    console.error("Error listando profesores:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
};

export const getMyCoachProfile = async (req, res) => {
  try {
    const coach = await CoachModel.findByUserId(req.user.id);
    if (!coach) {
      return res.status(404).json({ ok: false, message: "No se encontró el perfil de profesor" });
    }
    const [countRows] = await pool.query(
      "SELECT COUNT(*) AS total FROM students WHERE coach_id = ?",
      [coach.id]
    );
    const [ratingRows] = await pool.query(
      `SELECT ROUND(AVG(rating), 1) AS avg_rating, COUNT(*) AS review_count
       FROM reviews WHERE coach_id = ?`,
      [coach.id]
    );
    return res.json({
      ok: true,
      coach: {
        ...coach,
        student_count: countRows[0]?.total || 0,
        rating: ratingRows[0]?.avg_rating,
        reviews: ratingRows[0]?.review_count || 0,
      },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

export const updateMyCoachProfile = async (req, res) => {
  try {
    const coach = await CoachModel.findByUserId(req.user.id);
    if (!coach) {
      return res.status(404).json({ ok: false, message: "No se encontró el perfil de profesor" });
    }
    const allowed = {};
    if (req.body.price !== undefined) allowed.price = Number(req.body.price);
    if (req.body.description !== undefined) allowed.description = req.body.description;
    if (req.body.specialty !== undefined) allowed.specialty = req.body.specialty;
    await CoachModel.update(coach.id, allowed);
    const updated = await CoachModel.findByUserId(req.user.id);
    return res.json({ ok: true, coach: updated });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

export const getMyStudents = async (req, res) => {
  try {
    const coach = await CoachModel.findByUserId(req.user.id);
    if (!coach) {
      return res.status(404).json({ ok: false, message: "No se encontró el perfil de profesor" });
    }
    const [rows] = await pool.query(
      `SELECT s.id, s.user_id, s.weight, s.height, s.goal, s.medical_notes,
              u.name, u.lastname, u.email,
              COALESCE(adj.adjusted_count, 0) AS adjusted_count
       FROM students s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN (
         SELECT r.student_id, COUNT(*) AS adjusted_count
         FROM routines r
         JOIN routine_exercises re ON re.routine_id = r.id
         WHERE (re.actual_weight IS NOT NULL AND re.actual_weight <> re.target_weight)
            OR (re.actual_sets IS NOT NULL AND re.actual_sets <> re.target_sets)
            OR (re.actual_reps IS NOT NULL AND re.actual_reps <> re.target_reps)
         GROUP BY r.student_id
       ) adj ON adj.student_id = s.id
       WHERE s.coach_id = ?
       ORDER BY u.name ASC`,
      [coach.id]
    );
    return res.json({ ok: true, students: rows });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};
