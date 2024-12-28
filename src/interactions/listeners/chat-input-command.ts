import { CacheType, Interaction, MessageFlags } from "discord.js";
import { checkAccountExists } from "../../services/potluck-quest";

export const listener = async (interaction: Interaction<CacheType>) => {
	if (!interaction.isChatInputCommand()) {
		return;
	}

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	const hasPotluckAccount = await checkAccountExists(interaction.user.id);

	// TODO: This should have a button that automatically takes you to discord oauth.
	if (!hasPotluckAccount) {
		await interaction.reply({
			content: `<@${interaction.user.id}> Sign in to [Potluck Quest](${process.env.POTLUCK_QUEST_BASE_URL}) to continue.`,
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);

		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: "There was an error while executing this command!",
				flags: MessageFlags.Ephemeral,
			});
		}

		await interaction.reply({
			content: "There was an error while executing this command!",
			flags: MessageFlags.Ephemeral,
		});
	}
};
