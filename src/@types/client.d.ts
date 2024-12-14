import {
	Client,
	Collection,
	CommandInteraction,
	SlashCommandBuilder,
} from "discord.js";

interface Command {
	data: SlashCommandBuilder;
	execute: (interaction: CommandInteraction) => Promise<void>;
}

declare module "discord.js" {
	interface Client {
		commands: Collection<string, Command>;
	}
}
