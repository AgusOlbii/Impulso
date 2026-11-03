import pool from "../config/db.js";

export class PaymentModel {
  // 1. Registrar una nueva contratación / pago en garantía (Escrow)
  static async create({ student_id, coach_id, amount, platform_fee_percentage = 10 }) {
    const platform_fee = (amount * platform_fee_percentage) / 100;
    const coach_earnings = amount - platform_fee;

    // expires_at se calcula a 24hs a partir de la fecha de creación
    const [result] = await pool.query(
      `INSERT INTO payments 
        (student_id, coach_id, amount, platform_fee, coach_earnings, status, expires_at)
       VALUES (?, ?, ?, ?, ?, 'escrow', NOW() + INTERVAL 24 HOUR)`,
      [student_id, coach_id, amount, platform_fee, coach_earnings]
    );

    return {
      id: result.insertId,
      student_id,
      coach_id,
      amount,
      platform_fee,
      coach_earnings,
      status: "escrow",
    };
  }

  // 2. Aceptar/Completar pago (Cuando el profesor acepta la solicitud dentro de las 24hs)
  static async completePayment(payment_id) {
    const [result] = await pool.query(
      `UPDATE payments 
       SET status = 'completed' 
       WHERE id = ? AND status = 'escrow'`,
      [payment_id]
    );
    return result.affectedRows > 0;
  }

  // 3. Reembolsar pago (Si el profesor rechaza o expiran las 24hs)
  static async refundPayment(payment_id) {
    const [result] = await pool.query(
      `UPDATE payments 
       SET status = 'refunded' 
       WHERE id = ? AND status = 'escrow'`,
      [payment_id]
    );
    return result.affectedRows > 0;
  }

  // 4. Proceso automático / Cron: Liberar y reembolsar automáticamente los pagos expirados (>24hs)
  static async processExpiredEscrows() {
    const [rows] = await pool.query(
      `SELECT * FROM payments 
       WHERE status = 'escrow' AND expires_at <= NOW()`
    );

    if (rows.length === 0) return [];

    const expiredIds = rows.map((p) => p.id);
    await pool.query(
      `UPDATE payments 
       SET status = 'refunded' 
       WHERE id IN (?)`,
      [expiredIds]
    );

    return rows; // Retorna los pagos reembolsados para notificar a los alumnos
  }

  // 5. Métrica para Profesor: Ganancias desglosadas por Año, Mes y Semana
  static async getCoachEarningsMetrics(coach_id) {
    // Total histórico completado
    const [total] = await pool.query(
      `SELECT COALESCE(SUM(coach_earnings), 0) AS total_historical
       FROM payments 
       WHERE coach_id = ? AND status = 'completed'`,
      [coach_id]
    );

    // Ganancias del mes actual
    const [monthly] = await pool.query(
      `SELECT COALESCE(SUM(coach_earnings), 0) AS total_month
       FROM payments 
       WHERE coach_id = ? AND status = 'completed'
         AND YEAR(created_at) = YEAR(CURRENT_DATE())
         AND MONTH(created_at) = MONTH(CURRENT_DATE())`,
      [coach_id]
    );

    // Ganancias de los últimos 7 días
    const [weekly] = await pool.query(
      `SELECT COALESCE(SUM(coach_earnings), 0) AS total_week
       FROM payments 
       WHERE coach_id = ? AND status = 'completed'
         AND created_at >= NOW() - INTERVAL 7 DAY`,
      [coach_id]
    );

    return {
      historical: total[0].total_historical,
      current_month: monthly[0].total_month,
      current_week: weekly[0].total_week,
    };
  }

  // 6. Métrica para Admin: Resumen global financiero y conteos de la plataforma
  static async getAdminFinancialOverview() {
    const [grossVolume] = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total_gross
       FROM payments 
       WHERE status = 'completed'`
    );

    const [platformProfit] = await pool.query(
      `SELECT COALESCE(SUM(platform_fee), 0) AS total_profit
       FROM payments 
       WHERE status = 'completed'`
    );

    const [inEscrow] = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total_escrow
       FROM payments 
       WHERE status = 'escrow'`
    );

    const [userMetrics] = await pool.query(
      `SELECT 
         COUNT(*) AS total_users,
         SUM(CASE WHEN is_active = FALSE THEN 1 ELSE 0 END) AS inactive_users,
         (SELECT COUNT(DISTINCT student_id) FROM payments WHERE status = 'completed') AS active_paying_students
       FROM users`
    );

    return {
      financials: {
        total_gross_volume: grossVolume[0].total_gross,
        platform_net_profit: platformProfit[0].total_profit,
        escrow_holding: inEscrow[0].total_escrow,
      },
      users_overview: userMetrics[0],
    };
  }
}