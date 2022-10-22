#!/usr/bin/env node

import fetch from "node-fetch";
import fs from "fs";
import path from "path";

import {red, green, blue, redBold, greenBold, blueBold} from "./utils/color.js";
import {checkOption} from "./scripts/invalidArguments.js";
import checkForUpdate from "./scripts/chechForUpdate.js";

/**
 * Command line arguments
 * @type {Array<string>}
 */
const [, , ...args] = process.argv;

/**
 * Current version
 * @type {string}
 */
const version = "1.2.1";

// Errors

if (args.length === 0) {
    const errorMessage = `
    ${redBold("Error")}: No arguments provided
    type ${blueBold("znip -h")} for help
    `;
    console.log(errorMessage);
    process.exit(1);
}

// Info options

if (args.includes('-v') || args.includes('--version')) {
    console.log(version);
    process.exit(0);
}


if (args.includes('-h') || args.includes('--help')) {
    const helpMessage = `
    ${greenBold(`znip v${version}`)}

    ${blueBold("znip snippet")}: add snippet with same name as snippet
    ${blueBold("znip snippet -n name")}: add snippet with name
    ${blueBold("znip snippet -o path")}: add snippet with  name as snippet at path
    ${blueBold("znip snippet -n name -o path")}: add snippet with name at path
    `;
    console.log(helpMessage);
    process.exit(0);
}

checkForUpdate(version);

// Snippet fetch

/**
 * The base url to server
 * @type {string}
 */
const baseUrl = 'https://kunalsin9h.dev/znip/';

/**
 * The name of snippet to fetch
 * @type {string}
 */
const snippetName = args[0];
checkOption(snippetName, "Snippet Name")

/**
 * The full url to snippet
 * @type {string}
 */
const fullUrl = baseUrl + snippetName;

/**
 * If the custom name is provided with -n then use that name else use the snippet name
 * @type {string|string}
 */
let snippetRename = snippetName;
if (args.includes('-n')) {
    const fileName = args[args.indexOf('-n') + 1];
    checkOption(fileName, '-n');
    snippetRename = fileName;
}

/**
 * Create path when -o is provided
 */
if (args.includes('-o')) {
    const folder = args[args.indexOf('-o') + 1];
    checkOption(folder, '-o');
    fs.mkdir(folder, {recursive: true}, function (error){
        if (error) {
            console.log(`${redBold("Error: ")} Unable to create folder`);
            process.exit(1);
        }
    });
    snippetRename = path.join(...new Set([...folder.split('/'), snippetRename]));
}

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

/**
 * Save the snippet to given location
 * @param filePath
 * @returns {Promise<void>}
 */
async function saveSnippet(filePath) {
    try {
        const data = await getSnippetData(fullUrl);
        // 404 -> not found
        if (data.includes("404")) throw new Error("Snippet not found");

        fs.writeFile(filePath, data, function (error) {
            if (error) throw new Error("Unable to save new file");
        });

    } catch (error) {
        console.log(`${redBold("Error: ")}${error.message}`)
        process.exit(1);
    }
}

saveSnippet(snippetRename);