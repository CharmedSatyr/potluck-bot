import {
	Events,
	GuildScheduledEvent,
	GuildScheduledEventStatus,
	PartialGuildScheduledEvent,
	User,
} from "discord.js";
import { GuildEventHandler } from "../../@types/client";

export const listener = async (
	event:
		| GuildScheduledEvent<GuildScheduledEventStatus>
		| PartialGuildScheduledEvent,
	user: User
) => {
	const eventName = Events.GuildScheduledEventUserRemove;

	const handler = event.client.handlers.get(eventName);

	if (!handler) {
		console.error(`No guild event name matching ${eventName} was found.`);
		return;
	}

	try {
		await (handler as GuildEventHandler).execute(event, user);
	} catch (error) {
		console.error(error);
	}
};
