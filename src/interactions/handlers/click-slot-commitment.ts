import {
	ActionRowBuilder,
	ButtonInteraction,
	MessageFlags,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { CustomId, DELIMITER } from "../../constants";
import { slotsCache } from "../../utilities/cache";
import { Slot } from "../../@types/slot";

export const data = { customId: CustomId.CLICK_SLOT_COMMITMENT };

// TODO: Cancel action after timeout https://discordjs.guide/message-components/interactions.html#deferred-updates
export const execute = async (interaction: ButtonInteraction) => {
	const [, slotId] = interaction.customId.split(DELIMITER);

	const cachedData = slotsCache.get<{ code: string; slot: Slot }>(slotId);

	if (!cachedData) {
		await interaction.reply({
			content: "Something went wrong. Please try again.",
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	const { slot } = cachedData;
	const { needed } = slot;

	const modal = new ModalBuilder()
		.setCustomId(
			CustomId.COMMITMENT_DETAILS_MODAL.concat(DELIMITER).concat(slotId)
		)
		.setTitle("Add Commitment Details");

	const quantityInput = new TextInputBuilder()
		.setCustomId(CustomId.COMMITMENT_DETAILS_QUANTITY)
		.setLabel(`How many will you bring? (Max: ${needed})`)
		.setPlaceholder("1")
		.setStyle(TextInputStyle.Short)
		.setMaxLength(3)
		.setRequired(false);

	const placeholders = [
		"Ravenloft-style smoked brisket and potatoes",
		"A potion of savory broth infused with forest herbs",
		"Mystical moonberry pie, baked with stardust",
		"Glistening elven ham, honeyed to perfection",
		"Golden roasted chicken, dusted with ancient spice",
		"A dish of dragonfruit and enchanted greens",
		"Spicy elven bread, crisped over a magical flame",
		"A hearty stew, loaded with dwarven mine fungus",
	];
	const getRandomPlaceholder = () => {
		const randomIndex = Math.floor(Math.random() * placeholders.length);
		return placeholders[randomIndex];
	};

	const descriptionInput = new TextInputBuilder()
		.setCustomId(CustomId.COMMITMENT_DETAILS_NOTE)
		.setLabel("Add a description")
		.setPlaceholder(getRandomPlaceholder())
		.setStyle(TextInputStyle.Short)
		.setMaxLength(100)
		.setRequired(false);

	const components = [
		new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput),
	];

	if (needed > 1) {
		components.unshift(
			new ActionRowBuilder<TextInputBuilder>().addComponents(quantityInput)
		);
	}

	if (needed) modal.addComponents(...components);

	await interaction.showModal(modal);
};
