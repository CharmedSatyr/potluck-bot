import {
	ActionRowBuilder,
	CommandInteraction,
	StringSelectMenuBuilder,
} from "discord.js";

async function handleListEvents(interaction: CommandInteraction) {
	const events = await interaction.guild?.scheduledEvents.fetch();

	if (!events || events.size === 0) {
		await interaction.reply("❌ No events found.");
		return;
	}

	const options = events.map((event) => ({
		label: event.name,
		value: event.id, // Use event ID as the select menu value
	}));

	const menu = new StringSelectMenuBuilder()
		.setCustomId("select_event")
		.setPlaceholder("Choose an event")
		.addOptions(options);

	const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
		menu
	);

	await interaction.reply({
		content: "Select an event to add metadata:",
		components: [row],
		ephemeral: true,
	});
}

export default handleListEvents;
