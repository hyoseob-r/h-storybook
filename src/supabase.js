import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://atwztuelyhwtohylbypv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0d3p0dWVseWh3dG9oeWxieXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzY2MTMsImV4cCI6MjA4ODg1MjYxM30.xkq6_HIadBh57v6W_puBKf8iP7gGd-1ifYtSfxHc4eY"
);

// ── Components API ────────────────────────────────────────────────────────────

export async function fetchComponents() {
  const { data, error } = await supabase
    .from("components")
    .select("*")
    .eq("app", "storybook")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function saveComponent({ name, svgData, w, h }) {
  const { data, error } = await supabase
    .from("components")
    .insert({ name, svg_data: svgData, w, h, app: "storybook", status: "draft" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteComponent(id) {
  const { error } = await supabase.from("components").delete().eq("id", id);
  if (error) throw error;
}

export async function renameComponent(id, name) {
  const { error } = await supabase.from("components").update({ name }).eq("id", id);
  if (error) throw error;
}
