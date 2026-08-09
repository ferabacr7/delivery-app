import { supabase } from "../lib/supabase";

const DEFAULT_PROFILE_NAME = "Usuario Delivery";

export async function signUp(
  email: string,
  password: string,
  fullName: string = DEFAULT_PROFILE_NAME,
  phone: string = "",
) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedFullName = fullName.trim() || DEFAULT_PROFILE_NAME;
  const normalizedPhone = phone.trim();

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: {
        full_name: normalizedFullName,
        phone: normalizedPhone,
      },
    },
  });

  if (error || !data.user) {
    return {
      data,
      error,
    };
  }

  const { error: profileError } = await supabase
  .from("profiles")
  .insert({
    id: data.user.id,
    full_name: normalizedFullName,
    phone: normalizedPhone || null,
  });

  if (profileError) {
    return {
      data,
      error: profileError,
    };
  }

  return {
    data,
    error: null,
  };
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

export async function updateMyProfile(
  fullName: string,
  phone: string,
) {
  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError || !userData.user) {
    return {
      data: null,
      error:
        userError ??
        new Error("No authenticated user found"),
    };
  }

  const normalizedFullName = fullName.trim();
  const normalizedPhone = phone.trim();

  if (!normalizedFullName) {
    return {
      data: null,
      error: new Error("El nombre es obligatorio."),
    };
  }

  return await supabase
    .from("profiles")
    .update({
      full_name: normalizedFullName,
      phone: normalizedPhone || null,
    })
    .eq("id", userData.user.id)
    .select()
    .single();
}

export async function updateMyEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return {
      data: null,
      error: new Error("El correo es obligatorio."),
    };
  }

  const result = await supabase.auth.updateUser(
    {
      email: normalizedEmail,
    },
    {
      emailRedirectTo: "deliveryapp://profile",
    },
  );

  console.log("UPDATE EMAIL DEBUG:", {
    requestedEmail: normalizedEmail,
    userEmail: result.data.user?.email,
    newEmail: result.data.user?.new_email,
    error: result.error
      ? {
          message: result.error.message,
          status: result.error.status,
          code: result.error.code,
          name: result.error.name,
        }
      : null,
  });

  return result;
}

export async function updateMyPassword(password: string) {
  if (password.length < 6) {
    return {
      data: null,
      error: new Error(
        "La contraseña debe tener al menos 6 caracteres.",
      ),
    };
  }

  return await supabase.auth.updateUser({
    password,
  });
}

export async function verifyCurrentPassword(password: string) {
  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError || !userData.user?.email) {
    return {
      data: null,
      error:
        userError ??
        new Error("No authenticated user found"),
    };
  }

  return await supabase.auth.signInWithPassword({
    email: userData.user.email,
    password,
  });
}