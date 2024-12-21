import {
	GuildScheduledEvent,
	GuildScheduledEventStatus,
	PartialGuildScheduledEvent,
	User,
} from "discord.js";
import { removeBlurbAndGetCode } from "../../utilities/description-blurb";
import { upsertRsvp } from "../../services/potluck-quest";

export const handler = async (
	event:
		| GuildScheduledEvent<GuildScheduledEventStatus>
		| PartialGuildScheduledEvent,
	user: User,
	response: "yes" | "no"
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
