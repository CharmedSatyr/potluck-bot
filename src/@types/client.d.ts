import {
	Client,
	Collection,
	CommandInteraction,
	Events,
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
	data: {
		eventName:
			| Events.GuildScheduledEventUserAdd
			| Events.GuildScheduledEventUserRemove;
	};
	execute: (
		event: GuildScheduledEvent | PartialGuildScheduledEvent,
		user: User
	) => Promise<void>;
}

interface GuildScheduledEventUpdateHandler {
	data: { eventName: Events.GuildScheduledEventUpdate };
	execute: (
		oldGuildScheduledEvent:
			| GuildScheduledEvent
			| PartialGuildScheduledEvent
			| null,
		newGuildScheduledEvent: GuildScheduledEvent | PartialGuildScheduledEvent
	) => Promise<void>;
}

interface GuildScheduledEventDeleteHandler {
	data: { eventName: Events.GuildScheduledEventDelete };
	execute: (
		guildScheduledEvent: GuildScheduledEvent | PartialGuildScheduledEvent | null
	) => Promise<void>;
}

type Handler =
	| InteractionHandler
	| GuildScheduledEventUpdateHandler
	| GuildScheduledEventDeleteHandler
	| GuildScheduledEventUserHandler;

declare module "discord.js" {
	interface Client {
		commands: Collection<string, Command>;
		handlers: Collection<string, Handler>;
	}
}
