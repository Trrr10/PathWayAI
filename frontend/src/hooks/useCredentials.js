import { supabase } from "../lib/supabase";

export function useCredentials() {
  const loadCredentials = async (userId) => {
    const { data } = await supabase.from("credentials").select("*").eq("user_id", userId);
    return data || [];
  };
  const awardCredential = async (userId, badgeType) => {
    await supabase.from("credentials").insert({ user_id: userId, badge_type: badgeType });
  };
  return { loadCredentials, awardCredential };
}