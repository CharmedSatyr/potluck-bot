import { MessageFlags, ModalSubmitInteraction } from "discord.js";
import { CustomId, DELIMITER } from "../../constants";
import { slotsCache } from "../../utilities/cache";
import { Slot } from "../../@types/slot";
import { createCommitment } from "../../services/potluck-quest";

export const data = { customId: CustomId.COMMITMENT_DETAILS_MODAL };

export const execute = async (interaction: ModalSubmitInteraction) => {
	if (!interaction.guild?.id) {
		await interaction.reply({
			content: `<@${interaction.user.id}> Please ensure you're creating the event on a server with **Potluck Quest Bot** installed and try again.`,
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	const [, slotId] = interaction.customId.split(DELIMITER);

	const cachedData = slotsCache.get<{ code: string; slot: Slot }>(slotId);

	if (!cachedData) {
		await interaction.reply({
			content: "Something went wrong. Please try again.",
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	const { code, slot } = cachedData;
	const { item, needed } = slot;

	const parseQuantity = (textInputValue: string): number => {
		const parsed = parseInt(textInputValue, 10);

		if (needed === 1 || !textInputValue) {
			return 1;
		}

		if (isNaN(parsed)) {
			return 0;
		}

		return parsed;
	};

	const quantity =
		needed > 1
			? parseQuantity(
					interaction.fields.getTextInputValue(
						CustomId.COMMITMENT_DETAILS_QUANTITY
					)
				)
			: 1;

	const description = interaction.fields.getTextInputValue(
		CustomId.COMMITMENT_DETAILS_NOTE
	);

	if (quantity < 1 || quantity > needed) {
		await interaction.reply({
			content: `<@${interaction.user.id}> Must enter a number from 1 to ${needed}. Please try again.`,
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	const result = await createCommitment({
		discordUserId: interaction.user.id,
		description,
		quantity,
		slotId,
	});

	if (!result) {
		await interaction.reply({
			content: "Something went wrong. Please try again.",
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	await interaction.reply({
		content:
			`<@${interaction.user.id}> signed up to bring **${quantity}** of **${item}**`
				.concat(description ? `: *${description}*.` : ".")
				.concat(" ")
				.concat(
					`See more details at [${code}](${process.env.POTLUCK_QUEST_BASE_URL}/event/${code}).`
				),
	});
};
