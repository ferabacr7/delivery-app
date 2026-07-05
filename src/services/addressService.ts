import { supabase } from "../lib/supabase";

async function getAuthenticatedUser() {
  const { data: sessionData, error } = await supabase.auth.getSession();

  if (error) {
    return { user: null, error };
  }

  const user = sessionData.session?.user ?? null;

  if (!user) {
    return {
      user: null,
      error: new Error("No authenticated user found"),
    };
  }

  return { user, error: null };
}

type CreateAddressInput = {
  label: string;
  addressLine: string;
  reference?: string;
  isDefault?: boolean;
};

export async function getMyAddresses() {
  const { user, error: authError } = await getAuthenticatedUser();

  if (authError || !user) {
    return {
      data: [],
      error: authError,
    };
  }

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("profile_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function createAddress(input: CreateAddressInput) {
  const { user, error: authError } = await getAuthenticatedUser();

  if (authError || !user) {
    return {
      data: null,
      error: authError,
    };
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      profile_id: user.id,
      label: input.label,
      address_line: input.addressLine,
      reference: input.reference ?? null,
      is_default: input.isDefault ?? false,
    })
    .select()
    .single();

  return { data, error };
}

export async function getAddressById(addressId: string) {
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("id", addressId)
    .single();

  return { data, error };
}
