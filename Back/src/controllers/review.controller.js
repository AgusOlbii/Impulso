import { ReviewModel } from "../models/review.model.js";
import { StudentModel } from "../models/student.model.js";
import { createReviewSchema } from "../schemas/review.schema.js";

export const getMyReview = async (req, res) => {
  try {
    const student = await StudentModel.findByUserId(req.user.id);
    if (!student?.coach_id) {
      return res.json({ ok: true, review: null });
    }
    const review = await ReviewModel.findByStudentAndCoach(student.id, student.coach_id);
    return res.json({ ok: true, review: review || null, coach_id: student.coach_id });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

export const upsertMyReview = async (req, res) => {
  try {
    const parsed = createReviewSchema.parse(req.body);
    const student = await StudentModel.findByUserId(req.user.id);
    if (!student?.coach_id) {
      return res.status(400).json({ ok: false, message: "Primero contratá un profesor" });
    }
    const review = await ReviewModel.upsert({
      coach_id: student.coach_id,
      student_id: student.id,
      rating: parsed.rating,
      comment: parsed.comment,
    });
    return res.json({ ok: true, review });
  } catch (error) {
    if (error.issues?.length) {
      return res.status(400).json({ ok: false, message: error.issues[0].message });
    }
    return res.status(500).json({ ok: false, message: error.message });
  }
};
