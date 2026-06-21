import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uekpwfgsnkepzwjvwnnc.supabase.co";

const supabaseAnonKey = "sb_publishable_WZxcwLD_BucgZt_ldBVmSw_IXaJUCtP";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
