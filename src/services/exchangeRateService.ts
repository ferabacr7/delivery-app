import { supabase } from "../lib/supabase";

type ExchangeRateRow = {
  crc_per_usd: number | string;
  effective_date: string;
  currency_from: "USD";
  currency_to: "CRC";
};

export async function getActiveExchangeRate(): Promise<number> {
  const { data, error } = await supabase
    .from("exchange_rates")
    .select(
      "crc_per_usd, effective_date, currency_from, currency_to",
    )
    .eq("currency_from", "USD")
    .eq("currency_to", "CRC")
    .order("effective_date", { ascending: false })
    .limit(1)
    .maybeSingle<ExchangeRateRow>();

  if (error) {
    console.error("EXCHANGE RATE ERROR:", error);
    throw error;
  }

  if (!data) {
    throw new Error(
      "No existe una tasa de cambio configurada.",
    );
  }

  const rate = Number(data.crc_per_usd);

  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error(
      "La tasa de cambio configurada no es válida.",
    );
  }

  console.warn("ACTIVE EXCHANGE RATE:", {
    rate,
    effectiveDate: data.effective_date,
  });

  return rate;
}