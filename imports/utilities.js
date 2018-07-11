/* =============================
*            Functions
================================*/
/* This function generates a new date with the current
* time and parses it into a string for logging
 purposes.*/
function dateNow() {
	let rightNow = new Date();
	let hour = rightNow.getHours() % 12;
	let min = rightNow.getMinutes();
	let seconds = rightNow.getSeconds();
	let milis = rightNow.getMilliseconds();
	let res = rightNow.toISOString().slice(0, 10).replace(/-/g, "/");
	return `${res} - ${hour}:${min}:${seconds}:${milis}`;
}

/* =============================
*            Exports
================================*/
module.exports = {
	dateNow
};