import {
	ActionRowBuilder,
	ButtonInteraction,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { CustomId, DELIMITER } from "../../constants";

export const data = { customId: CustomId.CLICK_SLOT_COMMITMENT };

// TODO: Cancel action after timeout https://discordjs.guide/message-components/interactions.html#deferred-updates
export const execute = async (interaction: ButtonInteraction) => {
	const slotId = interaction.customId.split(DELIMITER)[1];

	const modal = new ModalBuilder()
		.setCustomId(CustomId.COMMITMENT_DETAILS_MODAL)
		.setTitle("Commitment Details");

	const quantityInput = new TextInputBuilder()
		.setCustomId(CustomId.COMMITMENT_DETAILS_QUANTITY)
		.setLabel("How many will you bring? (Defaults to 1)")
		.setStyle(TextInputStyle.Short)
		.setMaxLength(3)
		.setRequired(false);

	const descriptionInput = new TextInputBuilder()
		.setCustomId(CustomId.COMMITMENT_DETAILS_NOTE)
		.setLabel("Add a description")
		.setStyle(TextInputStyle.Short)
		.setMaxLength(100)
		.setRequired(false);

	modal.addComponents(
		new ActionRowBuilder<TextInputBuilder>().addComponents(quantityInput),
		new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput)
	);

	await interaction.showModal(modal);
};
