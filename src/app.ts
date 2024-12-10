import "dotenv/config";
import {
	InteractionResponseType,
	InteractionType,
	verifyKeyMiddleware,
} from "discord-interactions";
import express from "express";
import { handleCreateCommand, handleCreateEvent } from "./handlers/create";
import { SlashCommands } from "./commands";

const app = express();

const PORT = process.env.PORT ?? 3000;

app.post(
	"/interactions",
	verifyKeyMiddleware(process.env.PUBLIC_KEY!),
	async (req, res) => {
		const { type, id, data } = req.body;

		if (type === InteractionType.PING) {
			res.send({ type: InteractionResponseType.PONG });
		}

		if (type === InteractionType.APPLICATION_COMMAND) {
			const { name } = data;

			if (name === SlashCommands.CREATE) {
				await handleCreateCommand(req, res);

				return;
			}
		}

		if (type === InteractionType.MODAL_SUBMIT) {
			const { custom_id } = data;

			if (custom_id === "create-event-modal") {
				await handleCreateEvent(req, res);

				return;
			}
		}

		res.send({
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				content: `${type} ${id} ${JSON.stringify(data)}`,
			},
		});
	}
);

app.listen(PORT, () => {
	console.log("[server]: Starting server on port", PORT);
});
