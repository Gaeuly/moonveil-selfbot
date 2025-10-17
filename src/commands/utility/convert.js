module.exports = {
    name: 'convert',
    description: 'Converts between different units.',
    aliases: ['conv'],
    async execute(client, message, args) {
        const value = parseFloat(args[0]);
        const fromUnit = args[1]?.toLowerCase();
        const toKeyword = args[2]?.toLowerCase();
        const toUnit = args[3]?.toLowerCase();

        if (isNaN(value) || !fromUnit || toKeyword !== 'to' || !toUnit) {
            return message.edit('Usage: `!convert <value> <from_unit> to <to_unit>`\nExample: `!convert 10 km to miles`').catch(() => {});
        }

        const conversions = {
            // Length
            km: 1000, m: 1, cm: 0.01,
            miles: 1609.34, mi: 1609.34,
            ft: 0.3048, feet: 0.3048,
            // Weight
            kg: 1000, g: 1,
            lb: 453.592, pounds: 453.592,
            oz: 28.3495, ounces: 28.3495,
        };

        try {
            let result;
            let finalUnit = toUnit;

            // Temperature is special
            if ((fromUnit === 'c' || fromUnit === 'celsius') && (toUnit === 'f' || toUnit === 'fahrenheit')) {
                result = (value * 9/5) + 32;
                finalUnit = '°F';
            } else if ((fromUnit === 'f' || fromUnit === 'fahrenheit') && (toUnit === 'c' || toUnit === 'celsius')) {
                result = (value - 32) * 5/9;
                finalUnit = '°C';
            } else if (conversions[fromUnit] && conversions[toUnit]) {
                const baseValue = value * conversions[fromUnit];
                result = baseValue / conversions[toUnit];
            } else {
                return message.edit('Unsupported units for conversion.').catch(() => {});
            }

            await message.edit(`**Conversion:**\n> ${value} ${fromUnit} ≈ **${result.toFixed(2)} ${finalUnit}**`).catch(() => {});

        } catch (error) {
            await message.edit('Failed to perform conversion.').catch(() => {});
        }
    }
};