import { MessageFlags, ModalSubmitInteraction } from "discord.js";
import { CustomId } from "../../constants";

export const data = { customId: CustomId.COMMITMENT_DETAILS_MODAL };

export const execute = async (interaction: ModalSubmitInteraction) => {
	if (!interaction.guild?.id) {
		await interaction.reply({
			content: `<@${interaction.user.id}> Please ensure you're creating the event on a server with **Potluck Quest Bot** installed and try again.`,
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	const quantity = interaction.fields.getTextInputValue(
		CustomId.COMMITMENT_DETAILS_QUANTITY
	);
	const description = interaction.fields.getTextInputValue(
		CustomId.COMMITMENT_DETAILS_NOTE
	);

	await interaction.reply({
		content: `<@${interaction.user.id}> signed up to bring X!`,
	});
};
