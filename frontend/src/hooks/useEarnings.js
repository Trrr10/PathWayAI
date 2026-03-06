import { supabase } from "../lib/supabase";

export function useEarnings() {
  const loadEarnings = async (mentorId) => {
    const { data } = await supabase.from("earnings").select("*").eq("mentor_id", mentorId).order("paid_at", { ascending: false });
    return data || [];
  };
  const totalEarnings = async (mentorId) => {
    const { data } = await supabase.from("earnings").select("amount").eq("mentor_id", mentorId);
    return (data || []).reduce((sum, r) => sum + Number(r.amount), 0);
  };
  return { loadEarnings, totalEarnings };
}