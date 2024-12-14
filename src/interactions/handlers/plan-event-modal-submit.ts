import { MessageFlags, ModalSubmitInteraction } from "discord.js";
import { createPotluckQuestEvent } from "../../services/potluck-quest";
import { createDiscordEvent } from "../../services/discord";
import buildBlurb from "../../utilities/build-blurb";

export const data = { customId: "plan-event-modal" };

export const execute = async (interaction: ModalSubmitInteraction) => {
	const title = interaction.fields.getTextInputValue("plan-event-title");
	const dateTime = interaction.fields.getTextInputValue("plan-event-dateTime");
	const duration = interaction.fields.getTextInputValue("plan-event-duration");
	const location = interaction.fields.getTextInputValue("plan-event-location");
	const description = interaction.fields.getTextInputValue(
		"plan-event-description"
	);

	const code = await createPotluckQuestEvent({
		description,
		discordUserId: interaction.user.id,
		location,
		startDate: "2025-12-10",
		startTime: "12:00:00",
		title,
	});

	if (!code) {
		interaction.reply({
			content: `<@${interaction.user.id}> failed to create event **${title}**. Please try again.`,
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	const augmentedDescription = description.concat("\n", buildBlurb(code));

	const discordEvent = await createDiscordEvent({
		guildId: interaction.guild?.id ?? "",
		title,
		description: augmentedDescription,
		location,
		startDate: "2025-01-10",
		startTime: "12:00:00",
	});

	if (!discordEvent) {
		interaction.reply({
			content: `<@${interaction.user.id}> failed to create event **${title}**. Make sure you're logged in to [Potluck Quest](https://potluck.quest) and try again.`,
			flags: MessageFlags.Ephemeral,
		});
	}

	interaction.reply({
		content: `<@${interaction.user.id}> successfully created new event **${title}**. Check it out at [Potluck Quest](https://potluck.quest/event/${code}) with code **${code}**.`,
	});
};
