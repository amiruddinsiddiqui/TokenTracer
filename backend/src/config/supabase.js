import { createClient } from "@supabase/supabase-js";
import config from "./config.js";


class SupabaseSingleton {
    static instance = null;

    static getInstance() {
        if (!SupabaseSingleton.instance) {
            SupabaseSingleton.instance = createClient(
                config.supabase.supabase_url,
                config.supabase.supabase_secret_key
            );
        }
        return SupabaseSingleton.instance;
    }
}

const supabase = SupabaseSingleton.getInstance();

export { SupabaseSingleton };

export default supabase;