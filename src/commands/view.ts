import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	MessageFlags,
	SlashCommandBuilder,
} from "discord.js";
import formatDateTime from "../utilities/format-date-time";
import buildBlurb from "../utilities/build-blurb";

export const data = new SlashCommandBuilder()
	.setName("view")
	.setDescription("View existing Potluck Quest events");

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const events = await interaction.guild?.scheduledEvents.fetch();

	if (!events || events.size === 0) {
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
			const removeBlurbAndGetCode = (description: string) => {
				const blurb = buildBlurb("");
				const blurbIndex = description.lastIndexOf(blurb);

				if (blurbIndex === -1) {
					return { code: "", description };
				}

				const cleanedDescription = description.slice(0, blurbIndex).trim();
				const code = description?.slice(blurbIndex + blurb.length).trim();

				return {
					code,
					description: cleanedDescription,
				};
			};

			const { code, description } = removeBlurbAndGetCode(
				event.description ?? ""
			);

			return [
				{
					name: event.name,
					value: description || "No description provided",
					inline: true,
				},
				{
					name: "When",
					value: formatDateTime(event.scheduledStartAt),
					inline: true,
				},
				{
					name: "Link",
					value: code
						? `[${code}](https://www.potluck.quest/event/${code})`
						: "Check the description",
					inline: true,
				},
			];
		});

	const embed = new EmbedBuilder()
		.setTitle("Upcoming Potluck Quest Events")
		.addFields(fields.flat());

	await interaction.reply({
		embeds: [embed],
		ephemeral: true,
	});
};
