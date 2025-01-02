import * as chrono from "chrono-node";
import { DateTime } from "luxon";
import { DEFAULT_TIMEZONE } from "../constants";

export const formatDateTimeForView = (date: Date | null): string => {
	if (!date) {
		return " ・ ";
	}

	const day = date.getDate();
	const month = date.toLocaleString("en-US", { month: "short" });
	const weekday = date.toLocaleString("en-US", { weekday: "short" });

	const getOrdinalSuffix = (n: number): string => {
		if (n % 10 === 1 && n % 100 !== 11) return "st";
		if (n % 10 === 2 && n % 100 !== 12) return "nd";
		if (n % 10 === 3 && n % 100 !== 13) return "rd";
		return "th";
	};

	const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;

	const time = date.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});

	return `${weekday} ${month} ${dayWithSuffix}・${time}`;
};

// TODO: Sometimes this passes when zod in PQ doesn't on event date TODAY.
// TODO: Time zones are off.
export const parseDateTimeInputForServices = (
	dateTimeInput: string
): {
	startDate: string;
	startUtcMs: number;
	startTime: string;
	endDate: string;
	endTime: string;
	endUtcMs: number;
} | null => {
	const parsed = chrono.parse(
		dateTimeInput,
		{ instant: new Date(), timezone: "PT" },
		{ forwardDate: true }
	)[0];

	if (!parsed) {
		return null;
	}

	const start = parsed.start.date();
	const end = parsed.end?.date();

	const startDt = DateTime.fromJSDate(start, { zone: DEFAULT_TIMEZONE });
	const endDt = end
		? DateTime.fromJSDate(end, { zone: DEFAULT_TIMEZONE })
		: startDt.plus({ hours: 1 }); // DEFAULT to 1 hour duration

	if (startDt <= DateTime.now()) {
		return null;
	}

	if (startDt > endDt) {
		return null;
	}

	return {
		endDate: endDt.toFormat("yyyy-MM-dd"),
		endTime: endDt.toFormat("HH:mm:ss"),
		endUtcMs: endDt.toUTC().toMillis(),
		startDate: startDt.toFormat("yyyy-MM-dd"),
		startTime: startDt.toFormat("HH:mm:ss"),
		startUtcMs: startDt.toUTC().toMillis(),
	};
};
