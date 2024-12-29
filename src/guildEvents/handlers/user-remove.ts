import {
	Events,
	GuildScheduledEvent,
	GuildScheduledEventStatus,
	PartialGuildScheduledEvent,
	User,
} from "discord.js";
import { removeBlurbAndGetCode } from "../../utilities/description-blurb";
import { upsertRsvp } from "../../services/potluck-quest";

export const data = { eventName: Events.GuildScheduledEventUserRemove };

export const execute = async (
	event:
		| GuildScheduledEvent<GuildScheduledEventStatus>
		| PartialGuildScheduledEvent,
	user: User
) => {
	if (!event.isCanceled()) {
		console.warn("Event is not active");
		return;
	}

	const { code } = removeBlurbAndGetCode(event.description);

	if (!code) {
		console.error("Failed to retrieve code from description on event user add");
		return;
	}

	const result = await upsertRsvp({
		code,
		discordUserId: user.id,
		message: "",
		response: "no",
	});

	if (!result) {
		console.error("Failed to upsert rsvp for event:", code);
	}
};
