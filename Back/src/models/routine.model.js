import pool from "../config/db.js";

export class RoutineModel {
    // 1. Crear una rutina completa con sus ejercicios usando una transacción SQL
    static async create({ coach_id, student_id, title, description, start_date, end_date, exercises }) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Insertar la cabecera de la rutina
            const [routineResult] = await connection.query(
                `INSERT INTO routines (coach_id, student_id, title, description, start_date, end_date)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [coach_id, student_id, title, description || null, start_date, end_date]
            );

            const routineId = routineResult.insertId;

            // Preparar e insertar los ejercicios asignados en routine_exercises
            const exerciseValues = exercises.map((item) => [
                routineId,
                item.exercise_id,
                item.day_of_week,
                item.target_sets,
                item.target_reps,
                item.target_weight || 0.00
            ]);

            await connection.query(
                `INSERT INTO routine_exercises 
                    (routine_id, exercise_id, day_of_week, target_sets, target_reps, target_weight)
                 VALUES ?`,
                [exerciseValues]
            );

            await connection.commit();
            return routineId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Traer una rutina completa por su ID (incluyendo la lista de ejercicios formateada)
    static async findById(id) {
        const [rows] = await pool.query(
            `SELECT 
                r.id AS routine_id,
                r.coach_id,
                r.student_id,
                r.title,
                r.description,
                r.start_date,
                r.end_date,
                r.created_at,
                re.id AS routine_exercise_id,
                re.day_of_week,
                re.target_sets,
                re.target_reps,
                re.target_weight,
                re.actual_sets,
                re.actual_reps,
                re.actual_weight,
                re.completed,
                e.id AS exercise_id,
                e.name AS exercise_name,
                e.muscle_group,
                e.video_url
            FROM routines r
            LEFT JOIN routine_exercises re ON r.id = re.routine_id
            LEFT JOIN exercises e ON re.exercise_id = e.id
            WHERE r.id = ?
            ORDER BY FIELD(re.day_of_week, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo')`,
            [id]
        );

        if (rows.length === 0) return null;

        // Estructuramos la respuesta para agrupar los ejercicios dentro del objeto de la rutina
        const routine = {
            id: rows[0].routine_id,
            coach_id: rows[0].coach_id,
            student_id: rows[0].student_id,
            title: rows[0].title,
            description: rows[0].description,
            start_date: rows[0].start_date,
            end_date: rows[0].end_date,
            created_at: rows[0].created_at,
            exercises: rows[0].routine_exercise_id ? rows.map(row => ({
                routine_exercise_id: row.routine_exercise_id,
                exercise_id: row.exercise_id,
                name: row.exercise_name,
                muscle_group: row.muscle_group,
                video_url: row.video_url,
                day_of_week: row.day_of_week,
                target_sets: row.target_sets,
                target_reps: row.target_reps,
                target_weight: row.target_weight,
                actual_sets: row.actual_sets,
                actual_reps: row.actual_reps,
                actual_weight: row.actual_weight,
                completed: row.completed
            })) : []
        };

        return routine;
    }

    static async findLatestByStudentId(studentId) {
        const [rows] = await pool.query(
            `SELECT id FROM routines WHERE student_id = ? ORDER BY id DESC LIMIT 1`,
            [studentId]
        );
        if (!rows.length) return null;
        return this.findById(rows[0].id);
    }

    static async findExerciseWithRoutine(routineExerciseId) {
        const [rows] = await pool.query(
            `SELECT re.*, r.student_id, r.coach_id
             FROM routine_exercises re
             JOIN routines r ON r.id = re.routine_id
             WHERE re.id = ?`,
            [routineExerciseId]
        );
        return rows[0];
    }

    // 3. Obtener todas las rutinas asignadas a un estudiante específico
    static async findByStudentId(studentId) {
        const [rows] = await pool.query(
            `SELECT r.*, COUNT(re.id) AS total_exercises
             FROM routines r
             LEFT JOIN routine_exercises re ON r.id = re.routine_id
             WHERE r.student_id = ?
             GROUP BY r.id
             ORDER BY r.start_date DESC`,
            [studentId]
        );
        return rows;
    }

    // 4. Registrar el progreso del alumno (actualizar valores reales)
    static async updateProgress(routineExerciseId, { actual_sets, actual_reps, actual_weight, completed }) {
        const [result] = await pool.query(
            `UPDATE routine_exercises
             SET 
                actual_sets = COALESCE(?, actual_sets),
                actual_reps = COALESCE(?, actual_reps),
                actual_weight = COALESCE(?, actual_weight),
                completed = COALESCE(?, completed)
             WHERE id = ?`,
            [actual_sets, actual_reps, actual_weight, completed, routineExerciseId]
        );
        return result.affectedRows > 0;
    }

    static async replace(id, { title, description, start_date, end_date, exercises }) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sets = [];
            const values = [];
            if (title !== undefined) {
                sets.push("title = ?");
                values.push(title);
            }
            if (description !== undefined) {
                sets.push("description = ?");
                values.push(description || null);
            }
            if (start_date !== undefined) {
                sets.push("start_date = ?");
                values.push(start_date);
            }
            if (end_date !== undefined) {
                sets.push("end_date = ?");
                values.push(end_date);
            }
            if (sets.length) {
                await connection.query(
                    `UPDATE routines SET ${sets.join(", ")} WHERE id = ?`,
                    [...values, id]
                );
            }

            await connection.query(`DELETE FROM routine_exercises WHERE routine_id = ?`, [id]);
            const exerciseValues = exercises.map((item) => [
                id,
                item.exercise_id,
                item.day_of_week,
                item.target_sets,
                item.target_reps,
                item.target_weight || 0.00,
            ]);
            await connection.query(
                `INSERT INTO routine_exercises
                    (routine_id, exercise_id, day_of_week, target_sets, target_reps, target_weight)
                 VALUES ?`,
                [exerciseValues]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // 5. Eliminar una rutina (ON DELETE CASCADE limpia automaticamente routine_exercises)
    static async delete(id) {
        const [result] = await pool.query(`DELETE FROM routines WHERE id = ?`, [id]);
        return result.affectedRows > 0;
    }
}