import fs from "fs";
import path from "path";
import { Collection } from "discord.js";
import { Command } from "../@types/client";

const collectCommands = () => {
	const commands = new Collection<string, Command>();

	const commandsPath = path.resolve(__dirname, "../commands");
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".ts"));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command: Command = require(filePath);

		if ("data" in command && "execute" in command) {
			console.log(`Adding command: ${command.data.name}`);
			commands.set(command.data.name, command);
		} else {
			console.warn(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			);
		}
	}

	return commands;
};

export default collectCommands;
