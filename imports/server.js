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
app.get("/",(req, res)=>{
	res.json({ version: packageInfo.version });
});

const server = app.listen(PORT,()=>{
	const host = server.address().address;
	const port = server.address().port;
	console.log(`[${utilities.dateNow()}] Express web server ready! :D - on host ${host} and port ${port}`);
});