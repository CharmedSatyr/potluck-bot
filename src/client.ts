import { Client, Collection, Events, GatewayIntentBits } from "discord.js";

import collectCommands from "./utilities/collect-commands";
import { handler as chatInputCommandListener } from "./interactions/listeners/chat-input-command";
import { handler as modalSubmitListener } from "./interactions/listeners/modal-submit";
import collectHandlers from "./utilities/collect-handlers";

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildScheduledEvents],
});

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Logged in as ${readyClient.user.tag}!`);
	console.log(`Connected to ${readyClient.guilds.cache.size} guilds.`);

	client.commands = collectCommands();
	client.handlers = collectHandlers();
});

client.on(Events.InteractionCreate, chatInputCommandListener);
client.on(Events.InteractionCreate, modalSubmitListener);

client.login(process.env.BOT_TOKEN);

export default client;
