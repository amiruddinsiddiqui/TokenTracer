
const calculateSavings = ({ currentSpend, recommendedSpend }) => {

    const monthlySavings = currentSpend - recommendedSpend;

    return { monthlySavings,
        annualSavings: monthlySavings * 12
    };
};

export default calculateSavings;