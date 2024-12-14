import "dotenv/config";
import { REST, Routes } from "discord.js";
import create from "./commands/create";

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN!);

(async () => {
	try {
		console.log("Started refreshing application (/) commands.");

		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
			body: [create.toJSON()],
		});

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(error);
	}
})();
