import { MessageFlags, ModalSubmitInteraction } from "discord.js";
import { createEvent as createPotluckQuestEvent } from "../../services/potluck-quest";
import { createEvent as createDiscordEvent } from "../../services/discord";
import buildDescriptionBlurb from "../../utilities/description-blurb";
import { parseDateTimeInputForServices } from "../../utilities/date-time";

export const data = { customId: "plan-event-modal" };

export const execute = async (interaction: ModalSubmitInteraction) => {
	if (!interaction.guild?.id) {
		await interaction.reply({
			content: `<@${interaction.user.id}> Please ensure you're creating the event on a server with **Potluck Quest Bot** installed and try again.`,
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	const title = interaction.fields.getTextInputValue("plan-event-title");
	const dateTime = interaction.fields.getTextInputValue("plan-event-dateTime");
	const location = interaction.fields.getTextInputValue("plan-event-location");
	const description = interaction.fields.getTextInputValue(
		"plan-event-description"
	);

	const parsedDateTime = parseDateTimeInputForServices(dateTime);

	if (!parsedDateTime) {
		await interaction.reply({
			content: `<@${interaction.user.id}> failed to create event **${title}**. Please format the date and time clearly and try again.`,
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	const { startDate, startTime, endDate, endTime } = parsedDateTime;

	const code = await createPotluckQuestEvent({
		description,
		discordUserId: interaction.user.id,
		location,
		startDate,
		startTime,
		title,
	});

	if (!code) {
		await interaction.reply({
			content: `<@${interaction.user.id}> failed to create event **${title}**. Please try again.`,
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	const augmentedDescription = description.concat(
		"\n",
		buildDescriptionBlurb(code)
	);

	const discordEvent = await createDiscordEvent({
		guildId: interaction.guild?.id,
		title,
		description: augmentedDescription,
		location,
		startDate,
		startTime,
		endDate,
		endTime,
	});

	if (!discordEvent) {
		await interaction.reply({
			content: `<@${interaction.user.id}> failed to create event **${title}**. Make sure you're logged in to [Potluck Quest](https://potluck.quest) and try again.`,
			flags: MessageFlags.Ephemeral,
		});
	}

	await interaction.reply({
		content: `<@${interaction.user.id}> successfully created new event **${title}**. Check it out at [**${code} | Potluck Quest**](https://potluck.quest/event/${code}).`,
	});
};
