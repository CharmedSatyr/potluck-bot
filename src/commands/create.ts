import { SlashCommandBuilder } from "@discordjs/builders";

const create = new SlashCommandBuilder()
	.setName("create")
	.setDescription("Create an event")
	.addStringOption((option) =>
		option
			.setName("title")
			.setDescription("The title of the event")
			.setRequired(true)
	);

export default create;
