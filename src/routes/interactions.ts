import { Router, Request, Response } from "express";
import { InteractionType, InteractionResponseType } from "discord-interactions";
import { handleCreateCommand, handleCreateEvent } from "../handlers/create";
import { SlashCommands } from "../commands/slashCommands";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
	const { type, id, data } = req.body;

	if (type === InteractionType.PING) {
		res.send({ type: InteractionResponseType.PONG });
		return;
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
});

export default router;