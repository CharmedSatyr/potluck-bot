import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	SlashCommandBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { CustomId } from "../constants";

// TODO: Add cooldowns https://discordjs.guide/additional-features/cooldowns.html#resulting-code
export const data = new SlashCommandBuilder()
	.setName("plan")
	.setDescription("Plan a new Potluck Quest event");

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const modal = new ModalBuilder()
		.setCustomId(CustomId.PLAN_EVENT_MODAL)
		.setTitle("Plan an Event");

	const titleInput = new TextInputBuilder()
		.setCustomId(CustomId.PLAN_EVENT_TITLE)
		.setLabel("Title")
		.setMinLength(1)
		.setMaxLength(100)
		.setPlaceholder("What's this adventure?")
		.setRequired(true)
		.setStyle(TextInputStyle.Short);

	const dateTimeInput = new TextInputBuilder()
		.setCustomId(CustomId.PLAN_EVENT_DATETIME)
		.setLabel("Date and Time")
		.setMinLength(1)
		.setMaxLength(256)
		.setPlaceholder("12/31 8pm - 10pm, Feb 5 at 9am (defaults to 1 hour)")
		.setRequired(true)
		.setStyle(TextInputStyle.Short);

	const locationInput = new TextInputBuilder()
		.setCustomId(CustomId.PLAN_EVENT_LOCATION)
		.setLabel("Location")
		.setMinLength(1)
		.setMaxLength(256)
		.setPlaceholder("Bilbo's house")
		.setRequired(true)
		.setStyle(TextInputStyle.Short);

	const descriptionInput = new TextInputBuilder()
		.setCustomId(CustomId.PLAN_EVENT_DESCRIPTION)
		.setLabel("Description")
		.setMinLength(1)
		.setMaxLength(256)
		.setPlaceholder("Additional info or vibe text")
		.setRequired(false)
		.setStyle(TextInputStyle.Paragraph);

	const actionRows = [
		titleInput,
		dateTimeInput,
		locationInput,
		descriptionInput,
	].map((input) =>
		new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(input)
	);

	modal.addComponents(...actionRows);

	await interaction.showModal(modal);
};
