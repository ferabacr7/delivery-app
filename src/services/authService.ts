import { supabase } from "../lib/supabase";

export async function signUp(
  email: string,
  password: string,
  fullName: string = "Usuario Delivery",
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
  const result = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return result;
}

export async function signOut() {
  const result = await supabase.auth.signOut();

  return result;
}

export async function getCurrentUser() {
  const result = await supabase.auth.getUser();

  return result;
}

export async function getSession() {
  const result = await supabase.auth.getSession();

  return result;
}

export async function getMyProfile() {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return {
      data: null,
      error: userError ?? new Error("No authenticated user found"),
    };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .single();

  return { data, error };
}
