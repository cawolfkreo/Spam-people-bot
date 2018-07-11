/* ======================================
*				Imports
 ====================================== */

require("dotenv").config();
const { TELEGRAM } = process.env;

if (!TELEGRAM) {
	console.log("Error: No TELEGRAM variable in enviorement.\nPerhaps you forgot to add it?");
	process.exit(1);
}

const botgram = require("botgram");
const bot = botgram(TELEGRAM);

/* ======================================
*			Global Variables
 ====================================== */

let states = []; //Array of states for user interaction

let victims = []; //Array of victims

let enabled = true; //wheter or not the bot will spam the victims.

/* ======================================
*				Commands
 ====================================== */

bot.command("start", "help", (msg, reply) => {
	reply.text("This bot helps annoying people by spamming a message to a user after he sends " +
		"a message to a group. The bot will always reply to that message with a random " +
		"message with a list of messages created for that user. Right now only the bot admin " +
		"is able to add users to the list of victims for the bot 😉");
});

bot.command("turnOff", (msg, reply) => {
	if (msg.chat.type !== "user") {
		reply.text("Sorry, commands are only for PM 👌😉");
	} else if (msg.from.username === "Cawolf") {
		enabled = false;
		reply.text("The bot is now off 🤖 ⛔");
	} else {
		reply.text("You don't have permission to use that command :/");
	}
});

bot.command("turnOn", (msg, reply) => {
	if (msg.chat.type !== "user") {
		reply.text("Sorry, commands are only for PM 👌😉");
	} else if (msg.from.username === "Cawolf") {
		enabled = true;
		reply.text("The bot is now on 🤖 ✔");
	} else {
		reply.text("You don't have permission to use that command :/");
	}
});

bot.command("add", (msg, reply) => {
	let { found } = inState(msg.from.username);
	if (msg.chat.type !== "user") {
		reply.text("Sorry, commands are only for PM 👌😉");
	} else if (!found && msg.from.username === "Cawolf") {
		states.push({
			username: msg.from.username,
			state: "a1"
		});
		reply.text("Send me the @username of the user you want to add");
	} else {
		reply.text("You don't have permission to use that command :/");
	}
});

bot.command("remove", (msg, reply) => {
	if (msg.chat.type !== "user") {
		reply.text("Sorry, commands are only for PM 👌😉");
	} else if (msg.from.username === "Cawolf") {
		let args = msg.args();
		if(args !== ""){
			removeVictims(args);
			reply.text("I will remove that victim 😎");
		} else {
			reply.text("you didn't give any params to this command. use /list and try again 😢");
		}
	} else {
		reply.text("You don't have permission to use that command :/");
	}
});

bot.command("list", (msg, reply) => {
	if (msg.chat.type !== "user") {
		reply.text("Sorry, commands are only for PM 👌😉");
	} else if (msg.from.username === "Cawolf") {
		reply.text(`The list of victims is:\n${victimsToString()}`);
	} else {
		reply.text("You don't have permission to use that command :/");
	}
});

bot.command("cancel", (msg, reply) => {
	if (msg.chat.type !== "user") {
		reply.text("Sorry, commands are only for PM 👌😉");
	} else if (msg.from.username === "Cawolf") {
		changeState(msg.from.username, "quit");
		reply.text("Correct! you just cancelled. Anything else I can help you with? 😄");
	} else {
		reply.reply(msg).text("Sorry, you don't have permission to use this bot 😢");
	}
});

bot.command("status", (msg, reply) => {
	if (msg.chat.type !== "user") {
		reply.text("Sorry, commands are only for PM 👌😉");
	} else {
		let status = `The bot is currently ${(enabled ? "on 🤖 ✔" : "off 🤖 ⛔")}.` +
			`\nThe bot is currently targeting ${victims.length === 1 ? "one victim" : `${victims.length} victims`}` +
			"\nThe bot is happy to see you care for him and wishes you an awesome day 😊";
		reply.text(status);
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
	const { found, user } = inVictims(msg.from.username);
	if (enabled && found && user.messages.length !== 0) {
		const lista = user.messages;
		const index = Math.floor(Math.random() * lista.length);
		reply.reply(msg).text(lista[index]);
	}
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
			addVictimMessages(msg, reply);
			break;
		}
	}
});

/* ======================================
*			Other Functions
 ====================================== */

function inState(username) {
	const response = findInList(states, username);
	let found = false, user = null, index = null;
	if (response) {
		found = response.user ? true : false;
		user = found ? response.user : null;
		index = found ? response.index : null;
	}

	return { found, user, index };
}

function inVictims(username) {
	const response = findInList(victims, username);
	let found = false, user = null, index = null;
	if (response) {
		found = response.user ? true : false;
		user = found ? response.user : null;
		index = found ? response.index : null;
	}

	return { found, user, index };
}

function findInList(list, username) {
	let found = false, user = null, index = 0;
	for (; index < list.length && !found; index++) {
		const currentUser = list[index];
		if (username.toLowerCase() === currentUser.username.toLowerCase()) {
			user = currentUser;
			found = true;
		}
	}
	index--; //index ends at the position n+1 after the cicle
	return found ? { user, index } : null;
}

function addVictimHandler(msg, reply) {
	const handlerExp = /^@[\w]{5,}$/; //RegEx to match telegram alias
	if (!handlerExp.test(msg.text)) {
		reply.text("The message you sen't was not a correct @username. Please provide a correct one 😢\nOr type /cancel if you don't want to add anyone 😜");
	} else {
		const { found } = inVictims(msg.text);
		if (found) {
			reply.text(`The user ${msg.text} is already a victim. If you want to remove him use /remove.\nType /cancel if you don't want to add anyone 😜`);
		} else {
			const newVictimUsername = msg.text.replace("@", "");
			victims.push({
				username: newVictimUsername,
				messages: []
			});

			reply.text("User added!! now send me all the replies you want that user to have on" +
				" a message one by one. When you are done use /cancel to finish.");

			changeState(msg.from.username, "a2", newVictimUsername);
		}
	}
}

function addVictimMessages(msg, reply) {
	const result = getStateParams(msg.from.username);
	if (result === "") {
		reply.text("I couldn't find the victim. /cancel, /remove and try again 😢");
	} else {
		const { params } = result;
		let response = findInList(victims, params);
		if (response) {
			let { index } = response;
			victims[index].messages.push(msg.text);
		}
		reply.reply(msg).text("¡¡Message added!! type /cancel if you are done or keep sending messages if you want to add more");
	}
}

function removeVictims(indexes) {
	indexes = indexes.split(" ");
	indexes = indexes.sort((a, b) => {
		if (parseInt(a) > parseInt(b)) {
			return 1;
		} else if (parseInt(a) < parseInt(b)) {
			return -1;
		} else {
			return 0;
		}
	});
	while (indexes.length > 0) {
		const current = indexes.pop();
		if (!isNaN(parseInt(current))) {
			let head, tail;
			const index = parseInt(current) - 1;

			head = victims.slice(0, index);
			tail = victims.slice(index + 1);
			victims = head.concat(tail);
		}
	}
}

function changeState(username, state, params) {
	let { found, index } = inState(username);

	if (found && state === "quit") {
		let head, tail;
		head = states.slice(0, index);
		tail = states.slice(index + 1);
		states = head.concat(tail);
	} else {
		states[index] = { username, state, params };
	}
}

function getStateParams(username) {
	let result = findInList(states, username);
	return result ? { params: result.user.params, index: result.index } : "";
}

function victimsToString() {
	if (victims.length !== 0) {
		let res = "";
		victims.forEach((victim, index) => {
			res += (index + 1) + ". @" + victim.username + "\n";
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