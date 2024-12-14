import client from "../client";

type DiscordEventData = {
	guildId: string;
	title: string;
	description: string;
	location: string;
	startDate: string;
	startTime: string;
};

export const createDiscordEvent = async (data: DiscordEventData) => {
	try {
		const guild = await client.guilds.fetch(data.guildId);

		const event = await guild.scheduledEvents.create({
			name: data.title,
			description: data.description,
			scheduledEndTime: "2025-01-10T23:00:00Z", // TODO
			scheduledStartTime: new Date(`${data.startDate} ${data.startTime}`),
			privacyLevel: 2, // GUILD
			entityType: 3, // EXTERNAL event type
			entityMetadata: {
				location: data.location,
			},
			image: undefined, // TODO
		});

		return event;
	} catch (error) {
		console.error("Error creating Discord event:", error);

		return null;
	}
};
