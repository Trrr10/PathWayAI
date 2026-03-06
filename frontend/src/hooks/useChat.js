import { supabase } from "../lib/supabase";

export function useChat() {
  const loadHistory = async (userId) => {
    const { data, error } = await supabase
      .from("chat_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(40);
    if (error) console.error(error);
    return data || [];
  };

  const saveMessage = async (userId, role, content) => {
    const { error } = await supabase
      .from("chat_history")
      .insert({ user_id: userId, role, content });
    if (error) console.error(error);
  };

  const clearHistory = async (userId) => {
    const { error } = await supabase
      .from("chat_history")
      .delete()
      .eq("user_id", userId);
    if (error) console.error(error);
  };

  return { loadHistory, saveMessage, clearHistory };
}