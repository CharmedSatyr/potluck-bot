import {
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

	const json = await result.json();

	await interaction.reply(`Looked up code ${code} and got ${json.message}`);
};
