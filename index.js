#!/usr/bin/env node

import fetch from "node-fetch";
import {blue, blueBold, green, redBold} from "./utils/color.js";
import * as fs from "fs";

/**
 * Command line arguments
 * @type {Array<string>}
 */
const [, , ...args] = process.argv;

/**
 * Current version
 * @type {string}
 */
const version = "v1.0.0";

// Errors

if (args.length === 0) {
    const errorMessage = `
    ${redBold("Error")}: No arguments provided
    type ${blueBold("znip -h")} for help
    `;
    console.log(errorMessage);
    process.exit(1);
}
// TODO v1.0.1 invalid arguments


// Info options

if (args.includes('-v') || args.includes('--version')) {
    console.log(version);
    process.exit(0);
}

// TODO v1.2.0 `znip -u` or `znip --update` update znip to latest version

if (args.includes('-h') || args.includes('--help')) {
    const helpMessage = `
    ${green(`znip ${version}`)}
    
    ${blue("znip snippet")}: add snippet to project with same name as snippet
    ${blue("znip snippet -n name")}: add snippet to project with name
    `;
    console.log(helpMessage);
    process.exit(0);
}

// Snippet fetch

/**
 * The base url to server
 * @type {string}
 */
const baseUrl = 'https://kunalsin9h.dev/snip/';
/**
 * The name of snippet to fetch
 * @type {string}
 */
const snippetName = args[0];
/**
 * If the custom name is provided with -n then use that name else use the snippet name
 * @type {string|string}
 */
const snippetRename = args.includes('-n') ? args[args.indexOf('-n') + 1] : snippetName;

/**
 * The full url to snippet
 * @type {string}
 */
const fullUrl = baseUrl + snippetName;


/**
 * Function to return the snippet code
 * @param snippetUrl
 * @returns {Promise<string>}
 */
async function getSnippetData(snippetUrl) {
    try {
        const response = await fetch(snippetUrl);
        return await response.text();
    } catch (error) {
        console.log(`${redBold("Error: ")} Unable to fetch snippet`);
        process.exit(1);
    }
}

async function saveSnippet(fileName) {
    try {
        const data = await getSnippetData(fullUrl);
        // 404 -> not found
        if (data.includes("404")) throw new Error("Snippet not found");

        fs.writeFile(`./${fileName}`, data, function (error) {
            if (error) throw new Error("Unable to create new file");
        });

    } catch (error) {
        console.log(`${redBold("Error: ")}${error.message}`)
        process.exit(1);
    }
}

saveSnippet(snippetRename);