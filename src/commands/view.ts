import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	MessageFlags,
	SlashCommandBuilder,
} from "discord.js";
import { formatDateTimeForView } from "../utilities/date-time";
import { removeBlurbAndGetCode } from "../utilities/description-blurb";

// TODO: Add cooldowns https://discordjs.guide/additional-features/cooldowns.html#resulting-code
export const data = new SlashCommandBuilder()
	.setName("view")
	.setDescription("View existing Potluck Quest events");

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const events = await interaction.guild?.scheduledEvents.fetch();

	if (!events || events.size === 0 || !interaction.guild) {
		await interaction.reply({
			content: "❌ No Potluck Quest events found.",
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	const fields = events
		.filter(
			(event) =>
				event.creatorId === process.env.CLIENT_ID &&
				(event.isScheduled() || event.isActive())
		)
		.map((event) => {
			const { code } = removeBlurbAndGetCode(event.description);

			return [
				{
					name: "\u200B",
					value: `**${event.name}**`,
					inline: true,
				},
				{
					name: "\u200B",
					value: formatDateTimeForView(event.scheduledStartAt),
					inline: true,
				},
				{
					name: "\u200B",
					value: code
						? `[${code}](https://www.potluck.quest/event/${code})`
						: "\u200B",
					inline: true,
				},
			];
		});

	// Add headings above the first row of fields.
	fields[0][0].name = "Event";
	fields[0][1].name = "Date/Time";
	fields[0][2].name = "Code";

	const flattened = fields.flat();

	if (flattened.length > 25) {
		await interaction.reply({
			content: `Too many events to view using this command. Visit [Potluck Quest](${process.env.POTLUCK_QUEST_BASE_URL}) for more options.`,
			ephemeral: true,
		});
		return;
	}

	const embed = new EmbedBuilder()
		.setTitle(`Upcoming Potluck Quest Events`)
		.addFields(flattened)
		.setTimestamp()
		.setAuthor({
			name: interaction.guild.name,
			iconURL: interaction.guild.iconURL() ?? undefined,
		});

	await interaction.reply({
		embeds: [embed],
		ephemeral: true,
	});
};
