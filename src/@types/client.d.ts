import {
	Client,
	Collection,
	CommandInteraction,
	GuildScheduledEvent,
	Interaction,
	SlashCommandBuilder,
	User,
} from "discord.js";

interface Command {
	data: SlashCommandBuilder;
	execute: (interaction: CommandInteraction) => Promise<void>;
}

interface InteractionHandler {
	data: { customId: string };
	execute: (interaction: Interaction) => Promise<void>;
}

interface GuildEventHandler {
	data: { eventName: string };
	execute: (event: GuildScheduledEvent, user: User) => Promise<void>;
}

type Handler = InteractionHandler | GuildEventHandlers;

declare module "discord.js" {
	interface Client {
		commands: Collection<string, Command>;
		handlers: Collection<string, Handler>;
	}
}
