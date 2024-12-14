import { Request, Response } from "express";
import {
	InteractionResponseFlags,
	InteractionResponseType,
	MessageComponentTypes,
} from "discord-interactions";
import { createDiscordEvent } from "../services/discord";

// Modal structure for event creation
const createEventModal = {
	title: "Create an Event",
	custom_id: "create-event-modal",
	components: [
		{
			type: MessageComponentTypes.ACTION_ROW,
			components: [
				{
					type: MessageComponentTypes.INPUT_TEXT,
					custom_id: "title",
					label: "Event Title",
					style: 1,
					min_length: 1,
					max_length: 256,
					placeholder: "What's this adventure?",
					required: true,
				},
			],
		},
		{
			type: MessageComponentTypes.ACTION_ROW,
			components: [
				{
					type: MessageComponentTypes.INPUT_TEXT,
					custom_id: "startDate",
					label: "Date",
					style: 1,
					min_length: 1,
					max_length: 256,
					placeholder: "Date of the event",
					required: true,
				},
			],
		},
		{
			type: MessageComponentTypes.ACTION_ROW,
			components: [
				{
					type: MessageComponentTypes.INPUT_TEXT,
					custom_id: "startTime",
					label: "Time",
					style: 1,
					min_length: 1,
					max_length: 256,
					placeholder: "Time of the event",
					required: true,
				},
			],
		},
		{
			type: MessageComponentTypes.ACTION_ROW,
			components: [
				{
					type: MessageComponentTypes.INPUT_TEXT,
					custom_id: "location",
					label: "Location",
					style: 1,
					min_length: 1,
					max_length: 256,
					placeholder: "Place name, address, or link",
					required: true,
				},
			],
		},
		{
			type: MessageComponentTypes.ACTION_ROW,
			components: [
				{
					type: MessageComponentTypes.INPUT_TEXT,
					custom_id: "description",
					label: "Description",
					style: 1,
					min_length: 1,
					max_length: 256,
					placeholder: "Additional info or vibe text",
					required: false,
				},
			],
		},
	],
};

export const handleCreateCommand = async (
	_req: Request,
	res: Response
): Promise<void> => {
	// Return modal to user for event creation
	res.send({
		type: InteractionResponseType.MODAL,
		data: createEventModal,
	});
};

export const handleCreateEvent = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { data, guild, member } = req.body;

	try {
		// Extract values from the modal submission
		const modalValues = data.components.map(
			(c: {
				components: [{ custom_id: string; value: string }];
				type: number;
			}) => ({
				[c.components[0].custom_id]: c.components[0].value,
			})
		);

		const { title, startDate, startTime, location, description } =
			modalValues.reduce(
				(acc: Record<string, string>, curr: Record<string, string>) => ({
					...acc,
					...curr,
				}),
				{}
			);

		// Create event in Potluck.Quest
		const targetUrl = process.env.POTLUCK_CREATE_EVENT_API_URL!;
		const result = await fetch(targetUrl, {
			method: "POST",
			body: JSON.stringify({
				discordUserId: member.user.id,
				title,
				startDate,
				startTime,
				location,
				description,
			}),
		});

		if (!result.ok) {
			const json = await result.json();
			console.warn({
				errors: JSON.stringify(json.errors.fieldErrors),
				success: json.success,
			});

			if (result.status === 400) {
				res.send({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						content: `<@${member.user.id}> failed to create event ${title}. Please check your input and try again.`,
						flags: InteractionResponseFlags.EPHEMERAL,
					},
				});
				return;
			}

			if (result.status === 401) {
				res.send({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						content: `<@${member.user.id}> failed to create event ${title}. Log in to [Potluck Quest](https://potluck.quest) and try again.`,
						flags: InteractionResponseFlags.EPHEMERAL,
					},
				});
				return;
			}
		}

		const { code } = await result.json();

		if (!code) {
			res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					content: `<@${member.user.id}> failed to create event ${title}. Please try again.`,
					flags: InteractionResponseFlags.EPHEMERAL,
				},
			});
			return;
		}

		// Create event in Discord
		const discordEvent = await createDiscordEvent(
			guild.id,
			title,
			description,
			location,
			startDate,
			startTime
		);

		if (!discordEvent) {
			res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					content: `<@${member.user.id}> failed to create Discord event for ${title}. Please try again.`,
					flags: InteractionResponseFlags.EPHEMERAL,
				},
			});
			return;
		}

		res.send({
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				content: `<@${member.user.id}> successfully created a new event, ${title}. Check it out: https://potluck.quest/event/${code}.`,
			},
		});
	} catch (err) {
		console.error(err);
		res.send({
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				content: `<@${member.user.id}> failed to create event. Please try again.`,
				flags: InteractionResponseFlags.EPHEMERAL,
			},
		});
	}
};
