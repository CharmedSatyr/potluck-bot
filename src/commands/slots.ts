import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	MessageFlags,
	SlashCommandBuilder,
} from "discord.js";

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
	const code = interaction.options.getString("code");

	if (!code) {
		await interaction.reply({
			content: "Potluck Quest event code required",
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	const params = new URLSearchParams({ code });

	const result = await fetch(
		process.env.POTLUCK_SLOTS_API_URL! + "?" + params.toString()
	);

	if (!result.ok) {
		await interaction.reply({
			content: `Failed to retrieve slots for event code ${code}`,
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	// TODO: Share proper types
	type Slot = { id: string; item: string; needed: number };

	const { slots }: { slots: Slot[] } = await result.json();

	if (slots.length === 0) {
		await interaction.reply({
			content: `No slots have been created for [${code}](https://potluck.quest/event/${code}). Ask the host to create some!`,
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
				.setCustomId(slot.id)
				.setLabel(`${slot.needed}: ${slot.item}`)
				.setStyle(ButtonStyle.Primary)
				.setDisabled(slot.needed <= 0);

			currentRow.addComponents(button);

			if ((index + 1) % 5 === 0 || index === slots.length - 1) {
				rows.push(currentRow);
				currentRow = new ActionRowBuilder<ButtonBuilder>();
			}
		});

	await interaction.reply({
		content:
			"Here's how many of each item is still needed. What would you like to bring?",
		components: rows,
		flags: MessageFlags.Ephemeral,
	});
};
