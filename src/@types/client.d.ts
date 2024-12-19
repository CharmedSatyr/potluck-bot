import {
	Client,
	Collection,
	CommandInteraction,
	Interaction,
	SlashCommandBuilder,
} from "discord.js";

interface Command {
	data: SlashCommandBuilder;
	execute: (interaction: CommandInteraction) => Promise<void>;
}

interface Handler {
	data: { customId: string };
	execute: (interaction: Interaction) => Promise<void>;
}

declare module "discord.js" {
	interface Client {
		commands: Collection<string, Command>;
		handlers: Collection<string, Handler>;
	}
}
