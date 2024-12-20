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
		const result = await fetch(process.env.POTLUCK_EVENT_API_URL!, {
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

export const getSlots = async (code: string): Promise<Slot[] | null> => {
	try {
		code = code.toUpperCase();

		const params = new URLSearchParams({ code });

		const result = await fetch(
			process.env.POTLUCK_SLOTS_API_URL! + "?" + params.toString()
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
	const result = await fetch(process.env.POTLUCK_COMMITMENT_API_URL!, {
		method: "POST",
		body: JSON.stringify(data),
	});

	return result.ok;
};

export const checkAccountExists = async (
	discordUserId: string
): Promise<boolean> => {
	const params = new URLSearchParams({ providerAccountId: discordUserId });

	const result = await fetch(
		process.env.POTLUCK_CHECK_ACCOUNT_EXISTS_API_URL! + "?" + params.toString()
	);

	if (!result.ok) {
		console.error("Failed account exists check");
		return false;
	}

	const data: { exists: boolean } = await result.json();

	return data.exists;
};
