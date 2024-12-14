import client from "../clients/discord";

export async function createDiscordEvent(
	guildId: string,
	title: string,
	description: string,
	location: string,
	startDate: string,
	startTime: string
) {
	try {
		const guild = await client.guilds.fetch(guildId);

		const event = await guild.scheduledEvents.create({
			name: title,
			description,
			scheduledEndTime: "2025-01-01T23:59:59Z", // TODO
			scheduledStartTime: new Date(`${startDate} ${startTime}`),
			privacyLevel: 2, // GUILD
			entityType: 3, // EXTERNAL event type
			entityMetadata: {
				location,
			},
			image: undefined, // TODO
		});

		return event;
	} catch (error) {
		console.error("Error creating Discord event:", error);
		return null;
	}
}
