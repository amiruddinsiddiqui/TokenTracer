import supabase from "../config/supabase.js";

export const createLead = async (req, res) => {
    const { email, company, role } = req.body;

    const { error } = await supabase
        .from("leads")
        .insert([{ email, company, role }]);

    if (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }

    res.status(201).json({
        success: true,
    });
};