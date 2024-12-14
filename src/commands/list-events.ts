import { SlashCommandBuilder } from "discord.js";

const listEvents = new SlashCommandBuilder()
	.setName("list-events")
	.setDescription("List Discord events");

export default listEvents;
