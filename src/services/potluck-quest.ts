import { slotsCache } from "../utilities/cache";
import { Slot } from "../@types/slot";

// TODO: zod
type EventData = {
	description: string;
	discordUserId: string;
	location: string;
	startDate: string;
	startTime: string;
	title: string;
};

export const createEvent = async (data: EventData): Promise<string | null> => {
	try {
		if (!process.env.POTLUCK_EVENT_API_URL) {
			throw new Error("Missing environmental variable: POTLUCK_EVENT_API_URL");
		}

		const result = await fetch(process.env.POTLUCK_EVENT_API_URL, {
			method: "POST",
			body: JSON.stringify(data),
		});

		if (!result.ok) {
			return null;
		}

		const { code } = await result.json();

		if (!code) {
			return null;
		}

		return code;
	} catch (error) {
		console.error("Error creating Potluck Quest event:", error);

		return null;
	}
};

export type UpdateEventData = {
	code: string;
	description?: string;
	location?: string;
	startDate?: string;
	startTime?: string;
	title?: string;
};

export const updateEvent = async (data: UpdateEventData): Promise<boolean> => {
	try {
		if (!process.env.POTLUCK_EVENT_API_URL) {
			throw new Error("Missing environmental variable: POTLUCK_EVENT_API_URL");
		}

		const result = await fetch(process.env.POTLUCK_EVENT_API_URL, {
			method: "PUT",
			body: JSON.stringify(data),
		});

		if (!result.ok) {
			console.warn("Failed to update Potluck Quest event:", result.status);
		}

		return result.ok;
	} catch (error) {
		console.error("Error updating Potluck Quest event:", error);

		return false;
	}
};

export const getSlots = async (code: string): Promise<Slot[] | null> => {
	try {
		if (!process.env.POTLUCK_SLOTS_API_URL) {
			throw new Error("Missing environmental variable: POTLUCK_SLOTS_API_URL");
		}

		code = code.toUpperCase();

		const params = new URLSearchParams({ code });

		const result = await fetch(
			process.env.POTLUCK_SLOTS_API_URL + "?" + params.toString()
		);

		if (!result.ok) {
			return null;
		}

		const { slots }: { slots: Slot[] } = await result.json();

		slots.forEach((slot) => slotsCache.set(slot.id, { code, slot }));

		return slots;
	} catch (err) {
		console.error(`Error fetching Potluck Quest slots for code ${code}:`, err);

		return null;
	}
};

type SlotData = {
	discordUserId: string;
	description: string;
	quantity: number;
	slotId: string;
};

export const createCommitment = async (data: SlotData) => {
	try {
		if (!process.env.POTLUCK_COMMITMENT_API_URL) {
			throw new Error(
				"Missing environmental variable: POTLUCK_COMMITMENT_API_URL"
			);
		}

		const result = await fetch(process.env.POTLUCK_COMMITMENT_API_URL, {
			method: "POST",
			body: JSON.stringify(data),
		});

		return result.ok;
	} catch (err) {
		console.error("Failed to create commitment", JSON.stringify(err, null, 2));

		return false;
	}
};

export const checkAccountExists = async (
	discordUserId: string
): Promise<boolean> => {
	try {
		if (!process.env.POTLUCK_CHECK_ACCOUNT_EXISTS_API_URL) {
			throw new Error(
				"Missing environmental variable: POTLUCK_CHECK_ACCOUNT_EXISTS_API_URL"
			);
		}

		const params = new URLSearchParams({ providerAccountId: discordUserId });

		const result = await fetch(
			process.env.POTLUCK_CHECK_ACCOUNT_EXISTS_API_URL + "?" + params.toString()
		);

		if (!result.ok) {
			console.error("Failed account exists check", result.status);
			return false;
		}

		const data: { exists: boolean } = await result.json();

		return data.exists;
	} catch (err) {
		console.error(
			"Error checking account exists:",
			JSON.stringify(err, null, 2)
		);

		return false;
	}
};

type RsvpData = {
	code: string;
	discordUserId: string;
	message: string;
	response: "yes" | "no";
};

export const upsertRsvp = async (data: RsvpData) => {
	try {
		if (!process.env.POTLUCK_RSVP_API_URL) {
			throw new Error("Missing environmental variable: POTLUCK_RSVP_API_URL");
		}

		const result = await fetch(process.env.POTLUCK_RSVP_API_URL, {
			method: "POST",
			body: JSON.stringify(data),
		});

		return result.ok;
	} catch (err) {
		console.error("Failed to upsert RSVP:", err, JSON.stringify(err, null, 2));

		return false;
	}
};
