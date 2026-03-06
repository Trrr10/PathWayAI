import { supabase } from "../lib/supabase";

export function useForum() {
  const loadPosts = async () => {
    const { data } = await supabase.from("forum_posts").select("*, profiles(name, role)").order("created_at", { ascending: false });
    return data || [];
  };
  const loadReplies = async (postId) => {
    const { data } = await supabase.from("forum_replies").select("*, profiles(name, role)").eq("post_id", postId).order("created_at", { ascending: true });
    return data || [];
  };
  const createPost = async (userId, postData) => {
    const { data, error } = await supabase.from("forum_posts").insert({ user_id: userId, ...postData }).select().single();
    if (error) throw error;
    return data;
  };
  const createReply = async (userId, postId, body) => {
    const { data, error } = await supabase.from("forum_replies").insert({ user_id: userId, post_id: postId, body }).select().single();
    if (error) throw error;
    return data;
  };
  return { loadPosts, loadReplies, createPost, createReply };
}