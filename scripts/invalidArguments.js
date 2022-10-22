import {redBold, greenBold, blueBold} from "../utils/color.js";

/**
 * Check if the option is valid
 * @param {string|null|undefined} option - the given string to check
 * @returns {boolean} true or false
 */
export function isInvalidOption(option) {
    return option === null || option === undefined || option === "" || option.includes('-');
}

/**
 * Check if option is valid for given type
 * @param {string|null|undefined} option
 * @param {string} type
 */
export function checkOption(option, type) {
    const errorMgs = `
    ${redBold("Error: ")} Invalid option for ${greenBold(type)}
    type ${blueBold("znip -h")} for help
    `;
    if (isInvalidOption(option)) {
        console.log(errorMgs);
        process.exit(1);
    }
}