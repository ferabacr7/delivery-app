import { supabase } from "../lib/supabase";

async function getAuthenticatedUser() {
  const { data: sessionData, error } =
    await supabase.auth.getSession();

  if (error) {
    return {
      user: null,
      error,
    };
  }

  const user = sessionData.session?.user ?? null;

  if (!user) {
    return {
      user: null,
      error: new Error("No authenticated user found"),
    };
  }

  return {
    user,
    error: null,
  };
}

type AddressInput = {
  label: string;
  addressLine: string;
  reference?: string;
  latitude: number;
  longitude: number;
  isDefault?: boolean;
};

type CreateAddressInput = AddressInput;

type UpdateAddressInput = AddressInput;

export async function getMyAddresses() {
  const { user, error: authError } =
    await getAuthenticatedUser();

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
    .order("is_default", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    });

  return {
    data,
    error,
  };
}

export async function getMyPrimaryAddress() {
  const { user, error: authError } =
    await getAuthenticatedUser();

  if (authError || !user) {
    return {
      data: null,
      error: authError,
    };
  }

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("profile_id", user.id)
    .order("is_default", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  return {
    data,
    error,
  };
}

export async function createAddress(
  input: CreateAddressInput,
) {
  const { user, error: authError } =
    await getAuthenticatedUser();

  if (authError || !user) {
    return {
      data: null,
      error: authError,
    };
  }

  const { count, error: countError } = await supabase
    .from("addresses")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("profile_id", user.id);

  if (countError) {
    return {
      data: null,
      error: countError,
    };
  }

  if ((count ?? 0) >= 1) {
    return {
      data: null,
      error: new Error(
        "Only one address is allowed during the testing phase.",
      ),
    };
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      profile_id: user.id,
      label: input.label,
      address_line: input.addressLine,
      reference: input.reference ?? null,
      latitude: input.latitude,
      longitude: input.longitude,
      is_default: true,
    })
    .select()
    .single();

  return {
    data,
    error,
  };
}

export async function getAddressById(
  addressId: string,
) {
  const { user, error: authError } =
    await getAuthenticatedUser();

  if (authError || !user) {
    return {
      data: null,
      error: authError,
    };
  }

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("id", addressId)
    .eq("profile_id", user.id)
    .maybeSingle();

  return {
    data,
    error,
  };
}

export async function updateAddress(
  addressId: string,
  input: UpdateAddressInput,
) {
  const { user, error: authError } =
    await getAuthenticatedUser();

  if (authError || !user) {
    return {
      data: null,
      error: authError,
    };
  }

  const { data, error } = await supabase
    .from("addresses")
    .update({
      label: input.label,
      address_line: input.addressLine,
      reference: input.reference ?? null,
      latitude: input.latitude,
      longitude: input.longitude,
      is_default: true,
    })
    .eq("id", addressId)
    .eq("profile_id", user.id)
    .select()
    .single();

  return {
    data,
    error,
  };
}