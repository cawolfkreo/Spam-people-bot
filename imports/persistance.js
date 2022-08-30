"use strict";

const fs = require("node:fs/promises");

const { printLog, printError } = require("./utilities");


/**
 * Tries to parse the string passed as
 * a JSON object. If it fails it will
 * return an empty object.
 * @param {String} jsonString The string to try and parse.
 * @returns an object either empty or parsed from the string
 */
function TryParse(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        return new Object();
    }
}

/**
 * Creates the persistance object
 * @param {String} dirPath The path of the directory where the file will be stored.
 * @param {String} fullPath The path of the file to store.
 * @returns The peristance object
 */
async function CreatePersistance (dirPath, fullPath) {
    await fs.mkdir(dirPath, {recursive: true});                //Makes sure the folder exist

    const encoding = "utf-8";
    const file = await fs.readFile(fullPath, {encoding , flag: "w+"});   //Reads the file if exist

    const jsonDB = TryParse(file);

    const persistance = {};

    /**
     * Retrieves an item previously stored
     * on the persistance object. If the
     * item does not exist it will return 
     * `undefined` instead.
     * @param {String} key The key for the item to retrieve
     * @returns The item retrieved from the persistance object.
     */
    persistance.get = key => jsonDB[key];

    /**
     * Stores an item with the key
     * provided on the persistance object
     * @param {String} key The key for the item to store
     * @param {any} value The item to store
     * @returns The item stored in the persistance object.
     */
    persistance.set = (key, value) => {
        if (jsonDB[key]=== value) {
            return value;
        }

        jsonDB[key] = value;

        fs.writeFile(fullPath, JSON.stringify(jsonDB, null, 4), {encoding, flag: "w"})
            .then(() => printLog(`DB file stored! Stored: ${JSON.stringify({key, value})}`))
            .catch(err => {
                printError("Persistance error!");
                printError(err);
            });

        return value;
    };

    return persistance;
}

module.exports = {
    CreatePersistance
}
