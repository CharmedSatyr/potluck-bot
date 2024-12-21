import { Client, Events, GatewayIntentBits } from "discord.js";

import collectCommands from "./utilities/collect-commands";
import { listener as chatInputCommandListener } from "./interactions/listeners/chat-input-command";
import { listener as modalSubmitListener } from "./interactions/listeners/modal-submit";
import { listener as buttonClickListener } from "./interactions/listeners/button-click";
import collectHandlers from "./utilities/collect-handlers";

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildScheduledEvents],
});

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Logged in as ${readyClient.user.tag}!`);
	console.log(`Connected to ${readyClient.guilds.cache.size} guilds.`);

	client.commands = collectCommands();
	console.log(`Collected ${client.commands.size} commands`);
	client.handlers = collectHandlers();
	console.log(`Collected ${client.handlers.size} handlers`);
});

client.on(Events.InteractionCreate, chatInputCommandListener);
client.on(Events.InteractionCreate, modalSubmitListener);
client.on(Events.InteractionCreate, buttonClickListener);

client.login(process.env.BOT_TOKEN);

export default client;
