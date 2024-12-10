import "dotenv/config";

import { Command } from "./@types/command";
import { discordRequest } from "./discord-request";
import { CREATE_COMMAND } from "./commands";

const installCommands = async (appId: string, commands: Command[]) => {
	/**
	 * Bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
	 */
	const endpoint = `applications/${appId}/commands`;

	try {
		const result = await discordRequest(endpoint, {
			method: "PUT",
			body: commands,
		});

		console.log(await result.json());
	} catch (err) {
		console.error(err);
	}
};

const ALL_COMMANDS: Command[] = [CREATE_COMMAND];

installCommands(process.env.APP_ID!, ALL_COMMANDS);
