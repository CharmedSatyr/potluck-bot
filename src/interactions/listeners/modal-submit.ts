import { CacheType, Interaction, MessageFlags } from "discord.js";

export const handler = async (interaction: Interaction<CacheType>) => {
	if (!interaction.isModalSubmit()) {
		return;
	}

	const handler = interaction.client.handlers.get(interaction.customId);

	if (!handler) {
		console.error(
			`No modal customId matching ${interaction.customId} was found.`
		);
		return;
	}

	try {
		await handler.execute(interaction);
	} catch (error) {
		console.error(error);

		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: "There was an error while handling this event!",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		await interaction.reply({
			content: "There was an error while handling this event!",
			flags: MessageFlags.Ephemeral,
		});
	}
};
