import { supabase } from "../lib/supabase";

export function useAssessments() {
  const loadAssessments = async (teacherId) => {
    const { data } = await supabase.from("assessments").select("*").eq("teacher_id", teacherId).order("created_at", { ascending: false });
    return data || [];
  };
  const saveAssessment = async (teacherId, { title, subject, difficulty, questions }) => {
    const { data, error } = await supabase.from("assessments").insert({ teacher_id: teacherId, title, subject, difficulty, questions }).select().single();
    if (error) throw error;
    return data;
  };
  return { loadAssessments, saveAssessment };
}