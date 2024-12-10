import "dotenv/config";

const { homepage, version } = require("../package.json");

export const discordRequest = async (
	endpoint: string,
	options: Record<string, unknown>
) => {
	console.log("discord request", endpoint, options);

	const url = "https://discord.com/api/v10/" + endpoint;

	if (options.body) {
		options.body = JSON.stringify(options.body);
	}

	const res = await fetch(url, {
		headers: {
			Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
			"Content-Type": "application/json; charset=UTF-8",
			"User-Agent": `DiscordBot (${homepage}, ${version})`,
		},
		...options,
	});

	if (!res.ok) {
		const data = await res.json();
		console.log(res.status);
		throw new Error(JSON.stringify(data));
	}

	return res;
};
