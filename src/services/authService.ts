import { supabase } from "../lib/supabase";

const DEFAULT_PROFILE_NAME = "Usuario Delivery";

export async function signUp(
  email: string,
  password: string,
  fullName: string = DEFAULT_PROFILE_NAME,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data.user) {
    return { data, error };
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    full_name: fullName,
  });

  if (profileError) {
    return { data, error: profileError };
  }

  return { data, error: null };
}

export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  return await supabase.auth.getUser();
}

export async function getSession() {
  return await supabase.auth.getSession();
}

export async function getMyProfile() {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return {
      data: null,
      error: userError ?? new Error("No authenticated user found"),
    };
  }

  return await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .single();
}