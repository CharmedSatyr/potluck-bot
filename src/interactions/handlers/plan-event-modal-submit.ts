import { ModalSubmitInteraction } from "discord.js";

export const data = { customId: "plan-event-modal" };

export const execute = async (interaction: ModalSubmitInteraction) => {
	console.log(interaction);
};
