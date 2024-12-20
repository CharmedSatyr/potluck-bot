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
import getRandomPlaceholder from "../utilities/get-random-placeholder";
import { checkAccountExists } from "../services/potluck-quest";

// TODO: Add cooldowns https://discordjs.guide/additional-features/cooldowns.html#resulting-code
export const data = new SlashCommandBuilder()
	.setName("plan")
	.setDescription("Plan a new Potluck Quest event");

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const hasAccount = await checkAccountExists(interaction.user.id);

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
		.setMaxLength(100)
		.setPlaceholder("12/31 8pm - 10pm, Feb 5 at 9am (defaults to 1 hour)")
		.setRequired(true)
		.setStyle(TextInputStyle.Short);

	const placeholders = [
		"The field across from the pigpen, Caer Dallben",
		"Lyra’s Apothecary, 36 Azure Lane, Moonshade Village",
		"Captain Eldric’s boat, Celestine Port, Starfall Harbor",
		"The Blacksmith’s Forge, 5 Emberglade Grove",
		"Mira’s Bakery, 22 Frostpeak Summit, West Auroria",
		"Ealdor’s Manor, Shadowfang Pass, near Duskhaven",
		"Luthien’s Library, 12 Crystal Crescent, Dawnspire City",
		"The Siren’s Refuge, Sunken Bazaar, under Crescent Isle",
		"Aedric’s Stables, Crimson Spire, Emberlight District",
		"The Abyss",
	];

	const locationInput = new TextInputBuilder()
		.setCustomId(CustomId.PLAN_EVENT_LOCATION)
		.setLabel("Location")
		.setMinLength(1)
		.setMaxLength(100)
		.setPlaceholder(getRandomPlaceholder(placeholders))
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
