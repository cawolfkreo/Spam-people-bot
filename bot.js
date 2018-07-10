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
	if(msg.chat.type !== "user"){
		reply.text("Sorry, commands are only for PM 👌😉");
	} else if (msg.from.username === "Cawolf") {
		enabled = false;
		reply.text("The bot is now off 🤖 ⛔");
	} else {
		reply.text("You don't have permission to use that command :/");
	}
});

bot.command("turnOn", (msg, reply) => {
	if(msg.chat.type !== "user"){
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
	if(msg.chat.type !== "user"){
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
	console.log("Mensaje: " + msg);
	reply.text("Hello!!!");
});

bot.command("list", (msg, reply) => {
	if(msg.chat.type !== "user"){
		reply.text("Sorry, commands are only for PM 👌😉");
	} else if (msg.from.username === "Cawolf") {
		reply.text(`The list of victims is:\n${victimsToString()}`);
	} else {
		reply.text("You don't have permission to use that command :/");
	}
});

bot.command("cancel", (msg, reply) => {
	if(msg.chat.type !== "user"){
		reply.text("Sorry, commands are only for PM 👌😉");
	} else if(msg.from.username === "Cawolf"){
		changeState(msg.from.username,"quit");
		reply.text("Correct! you just cancelled. Anything else I can help you with? 😄");
	} else {
		reply.reply(msg).text("Sorry, you don't have permission to use this bot 😢");
	}
});

bot.command("status", (msg, reply) => {
	if(msg.chat.type !== "user"){
		reply.text("Sorry, commands are only for PM 👌😉");
	} else {
		let status = `The bot is currently ${(enabled? "on 🤖✔":"off 🤖⛔")}.` +
		`\nThe bot is currently targeting ${victims.length===1?"one victim":`${victims.length} victims`}` +
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
	if(enabled){
		const { found, user } = inVictims(msg.from.username);
		if (found) {
			const lista = user.list;
			const index = Math.floor(Math.random() * lista.length);
			reply.reply(msg).text(lista[index]);
		}
	} else {
		next();
	}
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
	let found = false, user = null;

	for (let index = 0; index < states.length && !index; index++) {
		const userInState = states[index];
		found = username === userInState.username;
		user = userInState;
	}
	return { found, user };
}

function inVictims(username) {
	let found = false, user = null;

	for (let index = 0; index < victims.length && !index; index++) {
		const userInState = victims[index];
		found = username === userInState.username;
		user = userInState;
	}

	return { found, user };
}

function addVictimHandler(msg, reply) {
	const handlerExp = /^@[\w]{5,}$/; //RegEx to match telegram alias
	if (!handlerExp.test(msg.text)) {
		reply.text("That is not a correct @username. Please provide a correct one 😢");
	} else {
		const { found } = inVictims(msg.text);
		if(found){
			reply.text(`The user ${msg.text} is already a victim. If you want to remove him use /remove.`);
		} else {
			const newVictimUsername = msg.text.replace("@","");
			victims.push({
				username:newVictimUsername,
				messages: []
			});
			
			reply.text("User added!! now send me all the replies you want that user to have on"+
			" a message one by one. When you are done use /cancel to finish.");

			changeState(msg.from.username,"a2", newVictimUsername);
		}
	}
}

function addVictimMessages(msg, reply) {
	const result = getStateParams(msg.from.username);
	if(result === ""){
		reply.text("I couldn't find the victim. /cancel, /remove and try again 😢");
	} else {
		const { params } = result;
		let response = findInList(victims, params);
		if(response) {
			let { index } = response;
			victims[index].messages.push(msg.text);
		}
		reply.reply(msg).text("¡¡Message added!! type /cancel if you are done or keep sending messages if you want to add more");
	}
}

function changeState(username, state, params) {
	let found = false, i = 0;

	while(i < states.length && !found){
		found = states[i].username === username;
		i++;
	}

	i--; //after the loop the index is not on position n but in position n+1.

	if(found && state === "quit"){
		states = states.splice(i);
	} else {
		states[i] = { username, state, params };
	}
}

function getStateParams(username){
	let result = findInList(states,username);
	return result? { params: result.user.params, index: result.index } : "";
}

function victimsToString() {
	if (victims.length !== 0) {
		let res = "", index = 1;
		victims.forEach(victim => {
			res += index + ". @" + victim.username + "\n";
		});
		return res;
	} else {
		return "No victims yet 😉";
	}
}

function findInList(list, username){
	let found = false, user = null, index = 0;
	for (; index < list.length && !found; index++) {
		const currentUser = list[index];
		if(username === currentUser.username){
			user = currentUser;
			found = true;
		}
	}
	index--; //index ends at the position n+1 after the cicle
	return found? { user, index } : null;
}

/* ======================================
*				Start-Up 
*				  Info
 ====================================== */

console.log("Bot ready! :D");