"use strict";
/* ======================================
*				Imports
 ====================================== */
/*const { PORT } = process.env;

if (!PORT) {
	console.log("Error: No PORT variable in enviorement.\nPerhaps you forgot to include it?");
	process.exit(1);
}

const express = require("express");
const fastify = require("fastify");
const packageInfo = require("../package.json");
const { printLog, printError } = require("./utilities");

/* ======================================
*			Server config
 ====================================== */
/*const app = fastify({ logger: true });

app.use((req, res, next) => {
	if (req.path !== "/") {
		printLog("Called some other path.");
		next();
		return;
	}
	printLog("Called the main path!");
	res.append("Access-Control-Allow-Origin", ["https://keepnavion.cawolf.repl.co"]);
	res.append("Access-Control-Allow-Methods", "GET");
	res.append("Access-Control-Allow-Headers", "Content-Type");
	res.append("Warning", "Don't use this if you are not the owner of Navi");
	next();
});

app.get("/",(_req, res)=>{
	res.json({ version: packageInfo.version });
});

function startServerWithHooks(secretPath, botMiddleware) {
	app.post(`/telegraf/${secretPath}`, (req, res) => botMiddleware(req.raw, res.raw));
	startServer();
}

async function startServer() {

	app.use((err, req, res, next) => {
		const mainMessage = "Found an error on the express level!!";
		const request = JSON.stringify(req);
		printError(mainMessage);
		printError(request);
		printError("================Full error:===================");
		printError(err);
		next();
	});

	try {
		const host = await app.listen({port: PORT, host: "::"});
		printLog(`Express web server ready! :D - on host: ${host}`);
	} catch (err) {
		app.log.error(err);
	}

	const server = app.listen(PORT ,async ()=>{
		const host = server.address().address;
		const port = server.address().port;
		printLog(`Express web server ready! :D - on host ${host} and port ${port}`);
	});
}

module.exports = {
	startServer,
	startServerWithHooks
};*/
