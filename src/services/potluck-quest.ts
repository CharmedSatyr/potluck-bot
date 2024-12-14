type EventData = {
	description: string;
	discordUserId: string;
	location: string;
	startDate: string;
	startTime: string;
	title: string;
};

export const createPotluckQuestEvent = async (
	data: EventData
): Promise<string | null> => {
	try {
		const result = await fetch(process.env.POTLUCK_CREATE_EVENT_API_URL!, {
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
