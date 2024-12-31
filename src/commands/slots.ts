import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	MessageComponentInteraction,
	MessageFlags,
	SlashCommandBuilder,
} from "discord.js";
import { DELIMITER, CustomId } from "../constants";
import { getSlots } from "../services/potluck-quest";

// TODO: Add cooldowns https://discordjs.guide/additional-features/cooldowns.html#resulting-code
export const data = new SlashCommandBuilder()
	.setName("slots")
	.setDescription("See slots for a Potluck Quest event")
	.addStringOption((option) =>
		option
			.setName("code")
			.setDescription(
				"Potluck Quest event code. Use /view to see available event codes."
			)
			.setMinLength(5)
			.setMaxLength(5)
			.setRequired(true)
	);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const input = interaction.options.getString("code")?.toUpperCase();

	if (!input) {
		await interaction.reply({
			content: "Potluck Quest event code required",
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	const slots = await getSlots(input);

	if (!slots) {
		await interaction.reply({
			content: `Failed to retrieve slots for event code ${input}`,
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	if (slots.length === 0) {
		await interaction.reply({
			content: `No slots have been created for [${input}](${process.env.POTLUCK_QUEST_BASE_URL}/event/${input}). Ask the host to create some!`,
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	const rows: ActionRowBuilder<ButtonBuilder>[] = [];
	let currentRow = new ActionRowBuilder<ButtonBuilder>();

	slots
		// Sort completed slots to end
		.sort((a, b) => {
			if (b.needed === 0) {
				return -1;
			}

			if (a.needed === 0) {
				return 1;
			}

			return 0;
		})
		.forEach((slot, index) => {
			const button = new ButtonBuilder()
				.setCustomId(
					CustomId.CLICK_SLOT_COMMITMENT.concat(DELIMITER).concat(slot.id)
				)
				.setLabel(`${slot.needed}: ${slot.item}`)
				.setStyle(ButtonStyle.Primary)
				.setDisabled(slot.needed <= 0);

			currentRow.addComponents(button);

			if ((index + 1) % 5 === 0 || index === slots.length - 1) {
				rows.push(currentRow);
				currentRow = new ActionRowBuilder<ButtonBuilder>();
			}
		});

	const prompt = await interaction.reply({
		content:
			"Here's how many of each item is still needed. What would you like to bring?",
		components: rows,
		flags: MessageFlags.Ephemeral,
	});

	// Remove the buttons on click or timeout so they can't be reused.
	const collectorFilter = (i: MessageComponentInteraction): boolean =>
		i.isButton() &&
		i.customId.split(DELIMITER)[0] === CustomId.CLICK_SLOT_COMMITMENT;

	try {
		await prompt.awaitMessageComponent({
			filter: collectorFilter,
			time: 60_000,
		});
		await prompt.delete();
	} catch (err) {
		console.error(err);

		await interaction.editReply({
			content: "Confirmation not received within 1 minute. Please try again.",
			components: [],
		});
	}
};
