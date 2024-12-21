import { Client, Events, GatewayIntentBits, Partials } from "discord.js";

import collectCommands from "./utilities/collect-commands";
import { listener as chatInputCommandListener } from "./interactions/listeners/chat-input-command";
import { listener as modalSubmitListener } from "./interactions/listeners/modal-submit";
import { listener as buttonClickListener } from "./interactions/listeners/button-click";
import { listener as eventUserAddListener } from "./guildEvents/listeners/user-add";
import { listener as eventUserRemoveListener } from "./guildEvents/listeners/user-remove";
import collectHandlers from "./utilities/collect-handlers";

const client = new Client({
	partials: [Partials.GuildScheduledEvent],
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
client.on(Events.GuildScheduledEventUserAdd, eventUserAddListener);
client.on(Events.GuildScheduledEventUserRemove, eventUserRemoveListener);

client.login(process.env.BOT_TOKEN);

export default client;
