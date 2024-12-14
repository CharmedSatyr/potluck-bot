import { SlashCommandBuilder } from "discord.js";

const potluck = new SlashCommandBuilder()
	.setName("potluck")
	.setDescription("Create a Potluck Quest event");

export default potluck;
