import fs from "fs";
import path from "path";
import { Collection } from "discord.js";
import { Handler } from "../@types/client";

const handlersDirs = ["../interactions/handlers", "../guildEvents/handlers"];

const collectHandlers = () => {
	const handlers = new Collection<string, Handler>();

	handlersDirs.forEach((dir: string) => {
		const handlersPath = path.resolve(__dirname, dir);
		const handlerFiles = fs.readdirSync(handlersPath);

		for (const file of handlerFiles) {
			const filePath = path.join(handlersPath, file);
			const handler = require(filePath);

			if (!("data" in handler && "execute" in handler)) {
				console.warn(
					`[WARNING] The handler at ${filePath} is missing a required "data" or "execute" property.`
				);
				return;
			}

			if (handler.data.customId) {
				handlers.set(handler.data.customId!, handler);
			}

			if (handler.data.eventName) {
				handlers.set(handler.data.eventName, handler);
			}
		}
	});

	return handlers;
};

export default collectHandlers;
