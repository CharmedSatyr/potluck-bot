import {
	Client,
	Collection,
	CommandInteraction,
	GuildScheduledEvent,
	Interaction,
	PartialGuildScheduledEvent,
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

interface GuildScheduledEventUserHandler {
	data: { eventName: string };
	execute: (
		event: GuildScheduledEvent | PartialGuildScheduledEvent,
		user: User
	) => Promise<void>;
}

interface GuildScheduledEventUpdateHandler {
	data: { eventName: string };
	execute: (
		oldGuildScheduledEvent:
			| GuildScheduledEvent
			| PartialGuildScheduledEvent
			| null,
		newGuildScheduledEvent: GuildScheduledEvent | PartialGuildScheduledEvent
	) => Promise<void>;
}

type Handler =
	| InteractionHandler
	| GuildScheduledEventUpdateHandler
	| GuildScheduledEventUserHandler;

declare module "discord.js" {
	interface Client {
		commands: Collection<string, Command>;
		handlers: Collection<string, Handler>;
	}
}
