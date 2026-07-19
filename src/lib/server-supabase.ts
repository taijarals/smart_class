import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

let supabaseAdmin: any = null;

export function getSupabaseAdmin() {
    if (!supabaseAdmin) {
        const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
        if (!url || !key) {
            console.warn("SUPABASE_URL ou VITE_SUPABASE_URL ou chaves correspondentes faltando");
            console.log("URL:", url);
            return null;
        }
        supabaseAdmin = createClient(
            url,
            key,
            { db: { schema: 'smartclass' } }
        );
    }
    return supabaseAdmin;
}
