"use strict";
/* ======================================
*				Imports
 ====================================== */

require("dotenv").config();
const { TELEGRAM, ADMIN, URL } = process.env;

if (!TELEGRAM) {
	console.error("Error: No TELEGRAM variable in enviorement.\nPerhaps you forgot to include it?");
	process.exit(1);
}

if (!ADMIN) {
	console.error("Error: No ADMIN variable in enviorement.\nPerhaps you forgot to include it?");
	process.exit(1);
}

const utilities = require("./imports/utilities");
const { startServer, startServerWithHooks } = require("./imports/server");
const { Telegraf } = require("telegraf");
const bot = new Telegraf(TELEGRAM);

/* ======================================
*			Global Variables
 ====================================== */

let states = []; //Array of states for user interaction

let victims = []; //Array of victims

let enabled = true; //wheter or not the bot will spam the victims.

/* ======================================
*				Middleware
 ====================================== */

bot.use((ctx, next) => {
	if (ctx.chat.type === "private") {
		next();
		return;
	}

	const validator = /^\/\w*(@|\w)*/;
	if (!validator.test(ctx.message.text)) {
		next();
		return;
	}
	
	const command = ctx.message.text.replace(/^\/\w*/, "");
	const botnameValidator = new RegExp(`^@${ctx.me}`);

	if (botnameValidator.test(command)) {
		next();
		return;
	}
});

/* ======================================
*				Commands
 ====================================== */

bot.victimsToString

bot.command(["start", "help"], (ctx) => {
	ctx.reply("This bot helps annoying people by spamming a random text from a list " +
		"of messages to a user (or 'victim'). When the bot sees a message made by a victim " +
		"on a group chat, a random response will be picked and send as a reply to that " +
		"victim's message. Right now only the bot admin is able to add users to the bot " +
		"list of victims 😉");
});

bot.command("turnoff", (ctx) => {
	ctx.chat.type
	if (ctx.chat.type !== "private") {
		ctx.reply("Sorry, commands are only for PM 👌😉" + ctx.from.username);
	} else if (ctx.from.username === ADMIN) {
		enabled = false;
		ctx.reply("The bot is now off 🤖 ⛔");
		console.log(`[${utilities.dateNow()}] Bot is Off!`);
	} else {
		ctx.reply("You don't have permission to use that command :/");
	}
});

bot.command("turnon", (ctx) => {
	if (ctx.chat.type !== "private") {
		ctx.reply("Sorry, commands are only for PM 👌😉");
	} else if (ctx.from.username === ADMIN) {
		enabled = true;
		ctx.reply("The bot is now on 🤖 ✅");
		console.log(`[${utilities.dateNow()}] Bot is On!`);
	} else {
		ctx.reply("You don't have permission to use that command :/");
	}
});

bot.command("add", (ctx) => {
	let { found } = inState(ctx.from.username);
	if (ctx.chat.type !== "private") {
		ctx.reply("Sorry, commands are only for PM 👌😉");
	} else if (!found && ctx.from.username === ADMIN) {
		states.push({
			username: ctx.from.username,
			state: "a1"
		});
		ctx.reply("Send me the @username of the user you want to add");
	} else if (found) {
		ctx.reply("you're still doing another command.\nDid you forgot to type /cancel 🤔?");
	} else {
		ctx.reply("You don't have permission to use that command :/");
	}
});

bot.command("remove", async (ctx) => {
	if (ctx.chat.type !== "private") {
		ctx.reply("Sorry, commands are only for PM 👌😉");
		return;
	}
	if (ctx.from.username !== ADMIN) {
		ctx.reply("You don't have permission to use that command :/");
		return;
	}

	const args = utilities.getArgsFromMsg(ctx.message.text);
	if (args.length <= 0) {
		ctx.reply("you didn't give any params to this command. use /list and try again 😢");
		return;
	}

	removeVictims(args);
	ctx.reply(`I will remove ${args.length !== 1? "those victoms" : "that victim"} 😎`);

});

bot.command("list", (ctx) => {
	if (ctx.chat.type !== "private") {
		ctx.reply("Sorry, commands are only for PM 👌😉");
	} else if (ctx.from.username === ADMIN) {
		ctx.reply(`The list of victims is:\n${victimsToString()}`);
	} else {
		ctx.reply("You don't have permission to use that command :/");
	}
});

bot.command("cancel", (ctx) => {
	if (ctx.chat.type !== "private") {
		ctx.reply("Sorry, commands are only for PM 👌😉");
	} else if (ctx.from.username === ADMIN) {
		changeState(ctx.from.username, "quit");
		ctx.reply("Correct! you just cancelled. Anything else I can help you with? 😄");
	} else {
		ctx.reply("Sorry, you don't have permission to use this bot 😢", {reply_to_message_id: ctx.message.message_id});
	}
});

bot.command("status", (ctx) => {
	if (ctx.chat.type !== "private") {
		ctx.reply("Sorry, commands are only for PM 👌😉");
	} else {
		let status = `The bot is currently ${(enabled ? "on 🤖 ✅" : "off 🤖 ⛔")}.` +
		`\nThe bot is currently targeting ${victims.length === 1 ? "one victim" : `${victims.length} victims`}` +
		"\nThe bot is happy to see you care for him and wishes you an awesome day 😊";
		ctx.reply(status);
	}
});

bot.command("ping", ctx => {
	const options = { reply_to_message_id: ctx.message.message_id };
	ctx.reply(`Pong! 🤖 ${(enabled ? "✅" : "⛔")}.`, options);
});

bot.command("about", (ctx) => {
	if (ctx.chat.type !== "private") {
		ctx.reply("Sorry, commands are only for PM 👌😉");
	} else {
		let aboutThisBot = "this bot was made with 🤣 and some good intentions by @Cawolf." +
		"\nIf you want to know more of how this bot was made the source code is" +
		" [here](https://github.com/cawolfkreo/Spam-people-bot)." +
		"\n Have a nice day! 😄";
		ctx.replyWithMarkdown(aboutThisBot);
	}
});

/* Default command:
* This is called for all commands directed to the bot 
* that are unknown for him. This is how the bot handles 
* bad or unexpected commands.
*/
bot.command((ctx) => {
	ctx.reply("I don't understand that command 😞", {reply_to_message_id: ctx.message.message_id});
});


/* ======================================
*				Messages
 ====================================== */

bot.on("message", (ctx, next) => {
	const { found, user } = inVictims(ctx.from.username);
	if (enabled && found && user.messages.length !== 0) {
		const lista = user.messages;
		const index = Math.floor(Math.random() * lista.length);
		ctx.reply(lista[index], {reply_to_message_id: ctx.message.message_id});
	}
	next();
});
bot.on("text", (ctx) => {
	const { found, user } = inState(ctx.from.username);
	if (found && ctx.chat.type === "private") {
		switch (user.state) {
			case "a1":
				addVictimHandler(ctx);
				break;
			case "a2":
				addVictimMessages(ctx);
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
	for (; (typeof username !== "undefined") && index < list.length && !found; index++) {
		const currentUser = list[index];
		if (username.toLowerCase() === currentUser.username.toLowerCase()) {
			user = currentUser;
			found = true;
		}
	}
	index--; //index ends at the position n+1 after the cicle
	return found ? { user, index } : null;
}

function addVictimHandler(ctx) {
	const handlerExp = /^@[\w]{5,}$/; //RegEx to match telegram alias
	const msgText = ctx.message.text;
	if (!handlerExp.test(msgText)) {
		ctx.reply("The message you sent was not a correct @username. Please provide a correct one 😢\nOr type /cancel if you don't want to add anyone 😜");
	} else {
		const { found } = inVictims(msgText);
		if (found) {
			ctx.reply(`The user ${msgText} is already a victim. If you want to remove him use /remove.\nOr type /cancel if you don't want to add anyone 😜`);
		} else {
			const newVictimUsername = msgText.replace("@", "");
			victims.push({
				username: newVictimUsername,
				messages: []
			});

			ctx.reply("User added! now send me all the replies you want that user to have on" +
				" a message, one by one. When you are done use /cancel to finish🤖.");

			changeState(ctx.from.username, "a2", newVictimUsername);
		}
	}
}

function addVictimMessages(ctx) {
	const result = getStateParams(ctx.from.username);
	if (result === "") {
		ctx.reply("I couldn't find the victim. Please use /cancel, then /remove and try again 😢");
	} else {
		const { params } = result;
		let searchResult = findInList(victims, params);
		if (searchResult) {
			let { index } = searchResult;
			victims[index].messages.push(ctx.message.text);
		}
		const response = "Message added!! type /cancel if you are done or keep sending messages if you want to add more";
		ctx.reply(response, {reply_to_message_id: ctx.message.message_id});
	}
}

function removeVictims(indexes) {
	const numIndexes = indexes.map(elem => parseInt(elem)-1);

	victims = victims.filter((_, index) => !numIndexes.includes(index));
}

function changeState(username, state, params) {
	let { found, index } = inState(username);

	if (found && state === "quit") {
		states.splice(index, 1);
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
async function startBot() {
	let startType = "";

	if (URL) {
		const hookMiddleware = await bot.createWebhook({ domain: URL });
		startServerWithHooks(hookMiddleware)
		startType = "web hooks";
	}
	else {
		startServer();
		bot.launch();
		startType = "long polling";
	}

	console.log(`[${utilities.dateNow()}] Bot is ready! :D\t\t-\tUsing ${startType}`);
}
startBot();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
