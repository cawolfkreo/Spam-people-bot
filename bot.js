require("dotenv").config();
const { TELEGRAM } = process.env;

if (!TELEGRAM) {
	console.log("Error: No TELEGRAM variable in enviorement.\nPerhaps you forgot to load it?");
	process.exit(1);
}

const botgram = require("botgram");
const bot = botgram(TELEGRAM);

/* ======================================
*				Commands
 ====================================== */

bot.command("start", (msg, reply) =>{
	console.log("Mensaje: " + msg);
	reply.text("Hello!!!");
});

bot.command("add", (msg, reply) =>{
	console.log("Mensaje: " + msg);
	reply.text("Hello!!!");
});

bot.command("remove", (msg, reply) =>{
	console.log("Mensaje: " + msg);
	reply.text("Hello!!!");
});

bot.command("list", (msg, reply) =>{
	console.log("Mensaje: " + msg);
	reply.text("Hello!!!");
});

/* Default command:
* This is called for all commands directed to the bot 
* that are unknown for him. This is how the bot handles 
* bad or unexpected commands.
*/
bot.command((msg,reply)=>{
	reply.reply(msg).text("I don't understand that command 😞");
});


/* ======================================
*				Messages
 ====================================== */

bot.message((msg) =>{
	console.log("1. Mensaje de: " + msg.from.username);
	console.log("2. Mensaje de: " + msg.chat.username);
	if(msg.type === "text"){
		console.log("Cuerpo del mensaje: "+ msg.text);
	}
});

console.log("Bot ready! :D");