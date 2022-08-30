"use strict";
/* =============================
*            Functions
================================*/
/* This function generates a new date with the current
* time and parses it into a string for logging
 purposes.*/
function dateNow() {
	const rightNow = new Date();
	const hour = ('00'+rightNow.getHours()).slice(-2);
	const min = ('00'+rightNow.getMinutes()).slice(-2);
	const seconds = ('00'+rightNow.getSeconds()).slice(-2);
	const milis = ('000'+rightNow.getMilliseconds()).slice(-3);
	const res = rightNow.toISOString().slice(0, 10).replace(/-/g, "/");
	return `${res} - ${hour}:${min}:${seconds}:${milis} ${hour > 12? "pm":"am"}`;
}

/**
 * Prints a message with the
 * log level.
 * @param {String} message message to print
 */
function printLog(message) {
	callLog(console.log, message);
}

/**
 * Prints a message with the
 * error level.
 * @param {String} message Error message to print
 */
function printError(message) {
	callLog(console.error, message);
}

function callLog(logger, message) {
	logger(`[${dateNow()}] ${message}`);
}

/**
 * Returns the arguments from a command message
 * @param {string} message The full text message with the args included
 * @returns An array of all the args passed on the message
 */
function getArgsFromMsg(message) {
	const [, ...args] = message.split(" ");
	return args;
}

/* =============================
*            Exports
================================*/
module.exports = {
	dateNow,
	getArgsFromMsg,
	printLog,
	printError
};