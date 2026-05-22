import supabase from "../config/supabase.js";

class ShareRepository {

    async findPublicAudit(publicId) {

        const { data, error } = await supabase
            .from("audits")
            .select("*")
            .eq("public_id", publicId)
            .single();

        if (error) {
            throw error;
        }

        return data;
    }
}

export default new ShareRepository();