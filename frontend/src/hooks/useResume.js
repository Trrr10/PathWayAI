import { supabase } from "../lib/supabase";

export function useResume() {
  const loadResume = async (userId) => {
    const { data } = await supabase.from("resumes").select("*").eq("user_id", userId).single();
    return data?.resume_data || null;
  };
  const saveResume = async (userId, resumeData) => {
    await supabase.from("resumes").upsert({ user_id: userId, resume_data: resumeData, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  };
  return { loadResume, saveResume };
}