import * as chrono from "chrono-node";
import { DateTime } from "luxon";

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
	startUtc: string;
	startTime: string;
	endDate: string;
	endTime: string;
	endUtc: string;
} | null => {
	const parsed = chrono.parse(dateTimeInput, new Date(), {
		forwardDate: true,
	})[0];

	if (!parsed) {
		return null;
	}

	const start = parsed.start.date();
	const end = parsed.end?.date();

	const startDt = DateTime.fromJSDate(start);
	const endDt = end
		? DateTime.fromJSDate(end)
		: DateTime.fromJSDate(start).plus({ hours: 1 }); // DEFAULT to 1 hour duration

	if (startDt <= DateTime.now()) {
		return null;
	}

	if (startDt > endDt) {
		return null;
	}

	return {
		startDate: startDt.toFormat("yyyy-MM-dd"),
		startTime: startDt.toFormat("HH:mm:ss"),
		startUtc: startDt.toUTC().toString(),
		endDate: endDt.toFormat("yyyy-MM-dd"),
		endTime: endDt.toFormat("HH:mm:ss"),
		endUtc: endDt.toUTC().toString(),
	};
};
