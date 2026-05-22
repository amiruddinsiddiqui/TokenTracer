import supabase from "../config/supabase.js";

class LeadRepository {

    async createLead(leadData) {

        const { data, error } = await supabase
            .from("leads")
            .insert([leadData])
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    }
}

export default new LeadRepository();