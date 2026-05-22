const pricingRules = {

    cursor: {
        hobby: 0,
        pro: 20,
        business: 40,
        enterprise: 60
    },

    githubCopilot: {
        individual: 10,
        business: 19,
        enterprise: 39
    },

    claude: {
        free: 0,
        pro: 20,
        max: 100,
        team: 30,
        enterprise: 60,
        api: "usage_based"
    },

    chatgpt: {
        plus: 20,
        team: 30,
        enterprise: 60,
        api: "usage_based"
    },

    anthropicApi: {
        type: "usage_based"
    },

    openaiApi: {
        type: "usage_based"
    },

    gemini: {
        pro: 20,
        ultra: 50,
        api: "usage_based"
    },

    windsurf: {
        pro: 15,
        team: 30
    }
};

export default pricingRules;