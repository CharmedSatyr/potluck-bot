import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	SlashCommandBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("plan")
	.setDescription("Plan a new Potluck Quest event");

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const modal = new ModalBuilder()
		.setCustomId("plan-event-modal")
		.setTitle("Plan an Event");

	const titleInput = new TextInputBuilder()
		.setCustomId("plan-event-title")
		.setLabel("Title")
		.setMinLength(1)
		.setMaxLength(256)
		.setPlaceholder("What's this adventure?")
		.setRequired(true)
		.setStyle(TextInputStyle.Short);

	const dateTimeInput = new TextInputBuilder()
		.setCustomId("plan-event-dateTime")
		.setLabel("Date and Time")
		.setMinLength(1)
		.setMaxLength(256)
		.setPlaceholder("8/21 6pm")
		.setRequired(true)
		.setStyle(TextInputStyle.Short);

	const durationInput = new TextInputBuilder()
		.setCustomId("plan-event-duration")
		.setLabel("Duration")
		.setMinLength(1)
		.setMaxLength(256)
		.setPlaceholder("'2h', '2 hours 30 min', '1 day', defaults to 1 hour")
		.setRequired(false)
		.setStyle(TextInputStyle.Short);

	const locationInput = new TextInputBuilder()
		.setCustomId("plan-event-location")
		.setLabel("Location")
		.setMinLength(1)
		.setMaxLength(256)
		.setPlaceholder("Bilbo's house")
		.setRequired(true)
		.setStyle(TextInputStyle.Short);

	const descriptionInput = new TextInputBuilder()
		.setCustomId("plan-event-description")
		.setLabel("Description")
		.setMinLength(1)
		.setMaxLength(256)
		.setPlaceholder("Additional info or vibe text")
		.setRequired(false)
		.setStyle(TextInputStyle.Paragraph);

	const actionRows = [
		titleInput,
		dateTimeInput,
		durationInput,
		locationInput,
		descriptionInput,
	].map((input) =>
		new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(input)
	);

	modal.addComponents(...actionRows);

	await interaction.showModal(modal);
};
