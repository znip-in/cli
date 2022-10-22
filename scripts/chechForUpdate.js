import fetch from 'node-fetch';

import {greenBold, blueBold} from "../utils/color.js";

/**
 * The API for all the details about the npm package
 * @type {string}
 */
const packageRegistryInfoUrl = 'https://registry.npmjs.org/znip';

/**
 * Check for new Version available
 * @param {string} currentVersion
 * @returns {Promise<void>}
 */
export default async function checkForUpdate(currentVersion){
    const response = await fetch(packageRegistryInfoUrl);
    const data = await response.json();

    const latestVersion = data['dist-tags'].latest;

    if (latestVersion > currentVersion) {
        console.log(`Update available: ${blueBold(`v${currentVersion}  ->  v${latestVersion}`)}`);
        console.log(`type ${greenBold("npm i -g znip@latest")} to update`);
    }
}
