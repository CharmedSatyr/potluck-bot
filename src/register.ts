import "dotenv/config";
import { REST, Routes } from "discord.js";
import { SlashCommands } from "./commands/slashCommands";

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN!);

(async () => {
	try {
		console.log("Started refreshing application (/) commands.");

		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
			body: [
				{
					name: SlashCommands.CREATE,
					description: "Create a new event",
				},
			],
		});

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(error);
	}
})();
