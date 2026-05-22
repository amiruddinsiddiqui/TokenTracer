// import supabase from "../config/supabase.js";
//
// class AuditRepository {
//
//     async createAudit(auditData) {
//
//         const { data, error } = await supabase
//             .from("audits")
//             .insert([auditData])
//             .select()
//             .single();
//
//         if (error) {
//             throw error;
//         }
//
//         return data;
//     }
//
//     async findById(id) {
//
//         const { data, error } = await supabase
//             .from("audits")
//             .select("*")
//             .eq("id", id)
//             .single();
//
//         if (error) {
//             throw error;
//         }
//
//         return data;
//     }
// }
//
// export default new AuditRepository();



import supabase from "../config/supabase.js";

class AuditRepository {

    async createAudit(auditData) {

        const { data, error } =
            await supabase
                .from("audits")
                .insert([auditData])
                .select()
                .single();

        if (error) {
            throw error;
        }

        return data;
    }
}

export default new AuditRepository();