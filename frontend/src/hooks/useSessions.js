import { supabase } from "../lib/supabase";

export function useSessions() {
  const loadSessions = async (userId, role) => {
    const col = role === "mentor" ? "mentor_id" : "student_id";
    const { data } = await supabase.from("sessions").select("*, profiles!sessions_mentor_id_fkey(name), profiles!sessions_student_id_fkey(name)").eq(col, userId).order("scheduled_at", { ascending: true });
    return data || [];
  };
  const bookSession = async (sessionData) => {
    const { data, error } = await supabase.from("sessions").insert(sessionData).select().single();
    if (error) throw error;
    return data;
  };
  const updateSession = async (id, status) => {
    await supabase.from("sessions").update({ status }).eq("id", id);
  };
  return { loadSessions, bookSession, updateSession };
}