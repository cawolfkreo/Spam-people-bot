/* ======================================
*				Imports
 ====================================== */

require("dotenv").config();
const { TELEGRAM } = process.env;

if (!TELEGRAM) {
	console.log("Error: No TELEGRAM variable in enviorement.\nPerhaps you forgot to load it?");
	process.exit(1);
}

const botgram = require("botgram");
const bot = botgram(TELEGRAM);

/* ======================================
*			Global Variables
 ====================================== */

let states = [];

let victims = []; //Array of victims

/* ======================================
*				Commands
 ====================================== */

bot.command("start", "help", (msg, reply) => {
	reply.text("This bot helps annoying people by spamming a message to a user after he sends " +
		"a message to a group. The bot will always reply to that message with a random " +
		"message with a list of messages created for that user. Right now only the bot admin " +
		"is able to add users to the list of victims for the bot 😉");
});

bot.command("add", (msg, reply) => {
	let { found } = inState(msg.from.username);
	if (!found && msg.from.username === "Cawolf") {
		states.push({
			userName: msg.from.username,
			state: "a1"
		});
		reply.text("Send me the @handler of the user you want to add");
	} else {
		reply.text("You don't have permission to use that command :/");
	}

});

bot.command("remove", (msg, reply) => {
	console.log("Mensaje: " + msg);
	reply.text("Hello!!!");
});

bot.command("list", (msg, reply) => {
	if (msg.from.userName === "Cawolf") {
		reply.text(`The list of victims is:\n${victimsToString()}`);
	} else {
		reply.text("You don't have permission to use that command :/");
	}
});

/* Default command:
* This is called for all commands directed to the bot 
* that are unknown for him. This is how the bot handles 
* bad or unexpected commands.
*/
bot.command((msg, reply) => {
	reply.reply(msg).text("I don't understand that command 😞");
});


/* ======================================
*				Messages
 ====================================== */

bot.all((msg, reply, next) => {
	next();
});

bot.text((msg, reply) => {
	const { found, user } = inState(msg.from.username);
	if (found && msg.chat.type === "user") {
		switch (user.state) {
		case "a1":
			addVictimHandler(msg, reply);
			break;
		case "a2":
			break;
		}
	} else {
		const { found, user } = inVictims(msg.from.username);
		if (found) {
			console.log(`El usuario ${user.userName} es victima`);
			const lista = user.list;
			const index = Math.floor(Math.random() * lista.length);
			reply.reply(msg).text(lista[index]);
		}
	}
});

/* ======================================
*			Other Functions
 ====================================== */

function inState(userName) {
	let found = false, user = null;

	for (let index = 0; index < states.length && !index; index++) {
		const userInState = states[index];
		found = userName === userInState.userName;
		user = userInState;
	}

	return { found, user };
}

function inVictims(userName) {
	let found = false, user = null;

	for (let index = 0; index < victims.length && !index; index++) {
		const userInState = victims[index];
		found = userName === userInState.userName;
		user = userInState;
	}

	return { found, user };
}

function addVictimHandler(msg, reply) {
	const handlerExp = /^@[\w]{5,}$/; //RegEx to match telegram alias
}

function victimsToString() {
	if (victims.length !== 0) {
		let res = "", index = 1;
		victims.forEach(victim => {
			res += index + ". @" + victim.userName + "\n";
		});
		return res;
	} else {
		return "No victims yet 😉";
	}
}

/* ======================================
*				Start-Up 
*				  Info
 ====================================== */

console.log("Bot ready! :D");