import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildScheduledEvents],
});

client.once("ready", () => {
	console.log(`Logged in as ${client.user?.tag}!`);
});

client.login(process.env.BOT_TOKEN);

export default client;