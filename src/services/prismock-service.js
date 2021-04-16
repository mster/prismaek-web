const { utils, harmonies, effects } = require('prismaek')

export const loadPrismockFX = () => {
    return [Object.keys(harmonies), Object.keys(effects)]
}

export const buildScheme = (base, type) => {
    if (!harmonies[type]) throw new Error(`Unable to build scheme using harmony type: ${type}`);

    let hex, rgb;
    if (utils.isHSV(base) || (hex = utils.isHex(base)) || (rgb = utils.isRGB(base))) {
        if (rgb) base = utils.RGB2HSV(base);
        if (hex) base = utils.hex2HSV(base);

        const scheme = harmonies[type](base).map(utils.HSV2Hex);

        return { base, type, scheme }
    }

    throw new Error(`Invalid base color format: ${base}`)
}

export const buildEffects = (base, type) => {
    if(!effects[type]) throw new Error(`Unable to build effects using effect type: ${type}`);

    console.log(base)

    return effects[type](base)
}