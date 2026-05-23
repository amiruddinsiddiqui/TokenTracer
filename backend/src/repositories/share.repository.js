import supabase from "../config/supabase.js";
import AppError from "../utils/AppError.js";

class ShareRepository {

    async findPublicAudit(publicId) {

        const { data, error } = await supabase
            .from("audits")
            .select("*")
            .eq("public_id", publicId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                throw new AppError('Shared audit not found', 404);
            }
            throw error;
        }

        return data;
    }
}

export default new ShareRepository();