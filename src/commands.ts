import { Command } from "./@types/command";

export enum SlashCommands {
	CREATE = "create",
}

export const CREATE_COMMAND: Command = {
	name: SlashCommands.CREATE,
	description: "Create an event",
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1, 2],
};
