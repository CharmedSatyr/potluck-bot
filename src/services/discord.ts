import {
	GuildScheduledEventEntityType,
	GuildScheduledEventPrivacyLevel,
} from "discord.js";
import client from "../client";

// TODO: zod
type DiscordEventData = {
	guildId: string;
	title: string;
	description: string;
	location: string;
	startDate: string;
	startTime: string;
	endDate: string;
	endTime: string;
};

export const createEvent = async (data: DiscordEventData) => {
	try {
		const guild = await client.guilds.fetch(data.guildId);

		const event = await guild.scheduledEvents.create({
			description: data.description,
			entityMetadata: {
				location: data.location,
			},
			entityType: GuildScheduledEventEntityType.External,
			image: undefined, // TODO
			name: data.title,
			privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
			scheduledEndTime: new Date(`${data.endDate} ${data.endTime}`),
			scheduledStartTime: new Date(`${data.startDate} ${data.startTime}`),
		});

		return event;
	} catch (error) {
		console.error("Error creating Discord event:", error);

		return null;
	}
};
