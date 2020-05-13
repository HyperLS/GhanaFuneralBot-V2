const Discord = require("discord.js");
require("console-stamp")(console, "HH:MM:ss.l");
const {
	prefix,
	token_coffin,
	token_guy1,
	token_guy2,
	token_guy3,
	token_guy4,
	token_guy5,
	token_guy6,
  token_guy7,
  token_guy8,
  token_guy9
} = require("./config.json");
const clients = [];
for (let i = 0; i < 7; i++) {
	clients.push(new Discord.Client());
}
var tokens = [token_guy1, token_guy2, token_guy3, token_guy4, token_guy5, token_guy6, token_guy7, token_guy8, token_guy9, token_coffin];
for (let i = 0; i < tokens.length; i++) {
	if (!tokens[i]) {
		throw new Error("Token " + (i + 1) + " is empty"); // Crash if any token is empty
	}
}

//Okay before I get destroyed, I suck at programming, I'm already aware

for (var i = 0; i < clients.length; i++) {
	clients[i].login(tokens[i]);
	console.log("Client " + i + " has logged in.");
}

clients[0].once("ready", () => {
	console.log("Ready to run!");
	clients[0].user.setActivity("Astronomia", { type: "LISTENING" });
});

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

clients[0].on("message", async (message) => {
	let guildName = message.guild.name;
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === "join" && message.member.hasPermission("MANAGE_CHANNELS")) {
		console.log("Command for " + command + " Recieved in Server: " + guildName);

		if (!message.member.voice.channel) {
			return message.reply("You're not in any voice channel");
		}
		const connection = await message.member.voice.channel.join();
		const dispatcher = connection.play("./Astronomia.mp3");

		dispatcher.on("start", () => {
			console.log("Astronomia now playing");
		});

		dispatcher.on("finish", () => {
			console.log("Astronomia done playing");
			connection.disconnect();
		});
	} else if (command === "ban" && message.member.hasPermission("BAN_MEMBERS")) {
		//Someone please fix this mess
		console.log("Command for " + command + " Recieved in Server: " + guildName);

		let member = message.mentions.members.first();
		if (!member) return message.reply("Please mention a valid member of this server");
		if (!member.bannable)
			return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

		let reason = args.slice(1).join(" ");
		if (!reason) reason = "No reason provided";

		let channel = member.voice.channel; // Join voice channel of person to be banned
		if (!channel) channel = message.member.voice.channel; // Join message sender if to be banned person isn't in voice chat
		if (!channel) {
			return message.reply("Neither you or the person you are trying to ban are in a voice chat");
		}
		const connection = await member.voice.channel.join();
		const dispatcher = connection.play("./Astronomia.mp3");

		dispatcher.on("start", () => {
			console.log("Astronomia now playing in");
		});

		dispatcher.on("finish", () => {
			console.log("Astronomia done playing");
			member.send("You have been banned from " + guildName + ` for \"${reason}\"`);
			member.ban(reason);
			connection.disconnect();
		});
	} else if (command === "leave" && message.member.hasPermission("MANAGE_CHANNELS")) {
		message.member.voice.channel.leave();
	} else if (command === "help") {
		const helpEmbed = new Discord.MessageEmbed()
			.setColor("#0099ff")
			.setTitle("Ghana Funeral Meme Bots")
			.setAuthor(
				"Bot by shaftAndi#1825",
				"https://cdn.discordapp.com/avatars/571412838388727809/d1e411fb103171344f9dc0271460857b.webp?size=128"
			)
			.setDescription(
				"Benjamin and his Henchmen will join your voice channel and play Astronomia! A neato fun bot!"
			)
			.setThumbnail("https://media1.tenor.com/images/c0bfc4509ae66de179e7499517031dc8/tenor.gif")
			.addFields(
				{ 
					name: "- !g help", 
					value: "This command..." 
				},
				{ 
					name: "- !g join", 
				 	value: "Joins the voice channel you are in" 
				},
				{ 
					name: "- !g leave", 
					value: "Leaves the voice channel incase needed!" 
				},
				{
					name: "- !g ban <tag user>",
					value: "Bans the user while music is playing! Will DM the user that he has been banned."
				}
			);
		return message.channel.send(helpEmbed);
	}
});

function getFunc(botNum) {
	return async (message) => {
		const args = message.content.slice(prefix.length).split(/ +/);
		const command = args.shift().toLowerCase();
		if (
			(command === "join" && message.member.hasPermission("MANAGE_CHANNELS")) ||
			(command === "ban" && message.member.hasPermission("BAN_MEMBERS"))
		) {
			const channel = message.member.voice.channel;
			if (!channel) {
				return; // User not in voice channel
			}
			await sleep(19500);
			console.log("Client " + botNum + " is joining voice chat");
			const connection = await channel.join();
			await sleep(19000);
			connection.disconnect();
			console.log("Client " + botNum + " has left voice chat");
		}
		if (command === "leave" && message.member.hasPermission("MANAGE_CHANNELS")) {
			message.member.voice.channel.leave();
		}
	};
}

for (let i = 1; i < clients.length; i++) {
	clients[i].on("message", getFunc(i));
}
