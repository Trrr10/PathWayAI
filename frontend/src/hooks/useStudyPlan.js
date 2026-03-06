import { supabase } from "../lib/supabase";

export function useStudyPlan() {
  const loadPlans = async (userId) => {
    const { data } = await supabase.from("study_plans").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    return data || [];
  };
  const savePlan = async (userId, plan) => {
    const { data, error } = await supabase.from("study_plans").insert({ user_id: userId, ...plan }).select().single();
    if (error) throw error;
    return data;
  };
  const deletePlan = async (id) => {
    await supabase.from("study_plans").delete().eq("id", id);
  };
  return { loadPlans, savePlan, deletePlan };
}