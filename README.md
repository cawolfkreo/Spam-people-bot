# ¿Have you ever wanted to spam someone?
## Table of Contents
<details><summary>Expand to see contents</summary>
  <p>

* **[Description](#Description)**<br />
* **[Motivation](#motivation)**<br />
* **[Getting Started](#getting-started)**<br />
* **[Deployment](#deployment)**<br />
* **[Author](#author)**<br />
* **[Contributing](#contributing)**<br />
* **[License](#license)**<br />

</p>
</details>

## Description
This project was made to target people and spam them. It's a telegram bot you can give targets to spam on group chats. It works like this: You give _the bot_ a target(**victim**) and some messages for that **victim**. _He_ will make a list with those messages you give to _him_ and then you add it to a group chat where your **target** is active, as soon as _the bot_ sees a **victim's** message _he_ will pick a random message from that **victim's** list he created with the messages given and reply to the **target´s** messages with the random reply picked by _the bot_.

**WARNING NOTE:** Due to the nature of this bot it's easy to annoy people and whole groups with this. I do not take responsability for any damage made with this code and please be careful. **Remember:** you can delete victims and completely turn off the bot by **talking to the bot in a private message**.

Right now the deployed versión of this bot only accepts commands from me, but if you want to deploy it by yourself so it only listens to you then follow the steps on getting started and motivation.

### Tools used
<details><summary>Expand to see contents</summary>
  <p>

* **Node.Js:** For the JS coding of the bot.<br />
* **Botgram:** As the wrapper for the telegram API (you can fin it [here](https://github.com/botgram/botgram)).<br />
* **dotenv:** To load the .env file variables into the process enviroment.<br />

</p>
</details>

## Motivation
I had one of those fights with someone on telegram when we both ended up spamming "no u" to one another. Because of if I thought of making this bot so I could win said fight and also spam other people.

## Getting Started
If you want to deploy this bot by yourself first you need to prepare a few things. First of all the bot needs two enviroment variables to work. Since one of the npm modules the project requires is `"dotenv"` then you can create a file called `.env` with the variables there and they will be loaded. If you don't want to do that you can add those variables later in any other way you want.

### Env Variables
Now, the env variables you need are the "_username_" of your `@username` on telegram, you would give that value to a variable called `ADMIN` and an api token telegram will give you for your bot. Before you go for the api key remember it is `TELEGRAM`.

### Telegram Api Key
On telegram search for `@BotFather` and talk to him. type `/help` if you don't know what to do. Here you can make your bot, he will ask you for some info of the bot and then it will give you the Api key. If you want to give your bot a description, image, etc. Then here you can also do that.

### Clone or Download this repo
Now is when you clone/download this repo, make a folder for it and save it there, if you already made the .env file then save it in the same folder where the `bot.js` file is (or create said file here).

### Make sure you have node 
Before you begin make sure you have node and npm installed in your sistem. You can do it by typing:

```
node -v
npm -v
```
Those two commands should print you the versión of those programs you have installed. If you don't see it then make sure you install [Node.Js](http://nodejs.org) on your system.

### Install Modules
We are almost done, last thing we have to do before deployment is to add the required node modules, to do that you need to open a console in the path where you cloned/downloaded the repo and type:
```
npm install
``` 
npm will download and install all the modules required for the project in a folder called `node_modules`. This can take a few seconds, but after it you are ready to deploy.

## Deployment
Now to deploy, please **remember to add the env variables to your console or operative system** if you didn't create a .env file. Now that everything is done open the console where you have this project and type:
```
npm start
```
when you see a message saying `Bot is ready! :D` then it means the bot is active on telegram and ready to use.

## Authors
* [__Camilo Zambrano Votto__](https://github.com/cawolfkreo)

## Contributing
If anyone wants to give me any help or ideas, you can by making new [Issues](https://github.com/cawolfkreo/Spam-people-bot/issues) or [Pull requests](https://github.com/cawolfkreo/Spam-people-bot/pulls).

## License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This repository has the standard MIT license. You can find it [here.](https://github.com/cawolfkreo/Spam-people-bot/blob/master/LICENSE)
