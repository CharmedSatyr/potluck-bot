import fs from "fs";
import path from "path";
import { Collection } from "discord.js";
import { Handler } from "../@types/client";

const collectInteractionHandlers = () => {
	const handlers = new Collection<string, Handler>();

	const handlersPath = path.resolve(__dirname, "../interactions/handlers");
	const handlerFiles = fs.readdirSync(handlersPath);

	for (const file of handlerFiles) {
		const filePath = path.join(handlersPath, file);
		const handler: Handler = require(filePath);

		if ("data" in handler && "execute" in handler) {
			handlers.set(handler.data.customId, handler);
		} else {
			console.warn(
				`[WARNING] The handler at ${filePath} is missing a required "data" or "execute" property.`
			);
		}
	}

	return handlers;
};

export default collectInteractionHandlers;
