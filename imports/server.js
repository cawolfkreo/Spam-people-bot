"use strict";
/* ======================================
*				Imports
 ====================================== */
const { PORT } = process.env;

if (!PORT) {
	console.log("Error: No PORT variable in enviorement.\nPerhaps you forgot to include it?");
	process.exit(1);
}

const express = require("express");
const packageInfo = require("../package.json");
const utilities = require("./utilities");

/* ======================================
*			Server config
 ====================================== */
const app = express();

app.use((_req, res, next) => {
    res.append("Access-Control-Allow-Origin", ["http://keepnavion.cawolf.repl.co/"]);
    res.append("Access-Control-Allow-Methods", "GET");
    res.append("Access-Control-Allow-Headers", "Content-Type");
	res.append("Warning", "Don't use this if you are not the owner of Navi");
    next();
});

app.get("/",(_req, res)=>{
	res.json({ version: packageInfo.version });
});

const server = app.listen(PORT,()=>{
	const host = server.address().address;
	const port = server.address().port;
	console.log(`[${utilities.dateNow()}] Express web server ready! :D - on host ${host} and port ${port}`);
});