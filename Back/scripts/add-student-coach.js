import pool from "../src/config/db.js";

const [cols] = await pool.query("SHOW COLUMNS FROM students LIKE 'coach_id'");
if (cols.length === 0) {
  await pool.query(`
    ALTER TABLE students
    ADD COLUMN coach_id INT NULL,
    ADD CONSTRAINT fk_student_coach
      FOREIGN KEY (coach_id) REFERENCES coaches(id) ON DELETE SET NULL
  `);
  console.log("students.coach_id creado");
} else {
  console.log("students.coach_id ya existía");
}
await pool.end();
