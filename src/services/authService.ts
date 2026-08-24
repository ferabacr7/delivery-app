import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabase } from "../lib/supabase";

const DEFAULT_PROFILE_NAME = "Usuario Delivery";

export function isValidPassword(
  password: string,
) {
  const hasMinimumLength =
    password.length >= 8;

  const hasLetter =
    /[A-Za-z]/.test(password);

  const hasNumber =
    /[0-9]/.test(password);

  const hasSymbol =
    /[^A-Za-z0-9\s]/.test(password);

  return (
    hasMinimumLength &&
    hasLetter &&
    hasNumber &&
    hasSymbol
  );
}

export async function signUp(
  email: string,
  password: string,
  fullName: string = DEFAULT_PROFILE_NAME,
  phone: string = "",
) {
  const normalizedEmail =
    email.trim().toLowerCase();

  const normalizedFullName =
    fullName.trim() ||
    DEFAULT_PROFILE_NAME;

  const normalizedPhone =
    phone.trim();

  if (!isValidPassword(password)) {
    return {
      data: null,
      error: new Error(
        "La contraseña debe tener al menos 8 caracteres e incluir una letra, un número y un símbolo.",
      ),
    };
  }

  const { data, error } =
    await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo:
          "https://orbit-cr.com/auth/email-confirmed",
        data: {
          full_name:
            normalizedFullName,
          phone:
            normalizedPhone,
        },
      },
    });

  if (error || !data.user) {
    return {
      data,
      error,
    };
  }

  return {
    data,
    error: null,
  };
}

export async function signIn(
  email: string,
  password: string,
) {
  const normalizedEmail =
    email.trim().toLowerCase();

  return await supabase.auth
    .signInWithPassword({
      email: normalizedEmail,
      password,
    });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function clearLocalSession() {
  try {
    await supabase.auth.signOut({
      scope: "local",
    });
  } catch (error) {
    console.warn(
      "LOCAL SIGN OUT ERROR:",
      error,
    );
  }

  const keys =
    await AsyncStorage.getAllKeys();

  const supabaseAuthKeys =
    keys.filter(
      (key) =>
        key.startsWith("sb-") &&
        key.endsWith("-auth-token"),
    );

  if (supabaseAuthKeys.length > 0) {
    await AsyncStorage.multiRemove(
      supabaseAuthKeys,
    );
  }
}

export async function getCurrentUser() {
  return await supabase.auth.getUser();
}

export async function getSession() {
  return await supabase.auth.getSession();
}

export async function getMyProfile() {
  const {
    data: userData,
    error: userError,
  } =
    await supabase.auth.getUser();

  if (
    userError ||
    !userData.user
  ) {
    return {
      data: null,
      error:
        userError ??
        new Error(
          "No authenticated user found",
        ),
    };
  }

  return await supabase
    .from("profiles")
    .select("*")
    .eq(
      "id",
      userData.user.id,
    )
    .single();
}

export async function updateMyProfile(
  fullName: string,
  phone: string,
) {
  const {
    data: userData,
    error: userError,
  } =
    await supabase.auth.getUser();

  if (
    userError ||
    !userData.user
  ) {
    return {
      data: null,
      error:
        userError ??
        new Error(
          "No authenticated user found",
        ),
    };
  }

  const normalizedFullName =
    fullName.trim();

  const normalizedPhone =
    phone.trim();

  if (!normalizedFullName) {
    return {
      data: null,
      error: new Error(
        "El nombre es obligatorio.",
      ),
    };
  }

  return await supabase
    .from("profiles")
    .update({
      full_name:
        normalizedFullName,
      phone:
        normalizedPhone || null,
    })
    .eq(
      "id",
      userData.user.id,
    )
    .select()
    .single();
}

export async function updateMyEmail(
  email: string,
) {
  const normalizedEmail =
    email.trim().toLowerCase();

  if (!normalizedEmail) {
    return {
      data: null,
      error: new Error(
        "El correo es obligatorio.",
      ),
    };
  }

  const result =
    await supabase.auth.updateUser(
      {
        email:
          normalizedEmail,
      },
      {
        emailRedirectTo:
          "https://orbit-cr.com/auth/email-change-confirmed",
      },
    );

  console.log(
    "UPDATE EMAIL DEBUG:",
    {
      requestedEmail:
        normalizedEmail,

      userEmail:
        result.data.user?.email,

      newEmail:
        result.data.user
          ?.new_email,

      error: result.error
        ? {
            message:
              result.error
                .message,

            status:
              result.error
                .status,

            code:
              result.error.code,

            name:
              result.error.name,
          }
        : null,
    },
  );

  return result;
}

export async function requestPasswordReset(
  email: string,
) {
  const normalizedEmail =
    email.trim().toLowerCase();

  if (!normalizedEmail) {
    return {
      data: null,
      error: new Error(
        "El correo es obligatorio.",
      ),
    };
  }

  return await supabase.auth
    .resetPasswordForEmail(
      normalizedEmail,
      {
        redirectTo:
          "deliveryapp://reset-password",
      },
    );
}

export async function updateMyPassword(
  password: string,
) {
  if (!isValidPassword(password)) {
    return {
      data: null,
      error: new Error(
        "La contraseña debe tener al menos 8 caracteres e incluir una letra, un número y un símbolo.",
      ),
    };
  }

  return await supabase.auth
    .updateUser({
      password,
    });
}

export async function verifyCurrentPassword(
  password: string,
) {
  const {
    data: userData,
    error: userError,
  } =
    await supabase.auth.getUser();

  if (
    userError ||
    !userData.user?.email
  ) {
    return {
      data: null,
      error:
        userError ??
        new Error(
          "No authenticated user found",
        ),
    };
  }

  return await supabase.auth
    .signInWithPassword({
      email:
        userData.user.email,
      password,
    });
}

export async function deleteMyAccount() {
  const {
    data: sessionData,
    error: sessionError,
  } = await supabase.auth.getSession();

  if (
    sessionError ||
    !sessionData.session
  ) {
    return {
      data: null,
      error:
        sessionError ??
        new Error(
          "No authenticated session found",
        ),
    };
  }

  const {
    data,
    error,
  } =
    await supabase.functions.invoke(
      "delete-account",
      {
        method: "POST",
      },
    );

  if (error) {
    let responseData:
      | { error?: string }
      | null = null;

    try {
      const context =
        (
          error as {
            context?: Response;
          }
        ).context;

      if (context) {
        responseData =
          await context.json();
      }
    } catch (contextError) {
      console.error(
        "DELETE ACCOUNT ERROR RESPONSE:",
        contextError,
      );
    }

    return {
      data: responseData,
      error,
    };
  }

  if (!data?.success) {
    return {
      data,
      error: new Error(
        data?.error ??
          "Unable to delete account",
      ),
    };
  }

  await clearLocalSession();

  return {
    data,
    error: null,
  };
}