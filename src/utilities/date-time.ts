import * as chrono from "chrono-node";
import { DateTime } from "luxon";

export const formatDateTimeForView = (date: Date | null): string => {
	if (!date) {
		return "Date ? ・ ??:??";
	}

	const dt = DateTime.fromJSDate(date);

	const dayWithSuffix = dt.toFormat("d") + dt.toFormat("o"); // "o" adds the ordinal suffix

	const formattedDate = dt.toFormat("ccc LLL"); // "ccc" = short weekday, "LLL" = short month
	const formattedTime = dt.toFormat("HH:mm"); // 24-hour time format

	return `${formattedDate} ${dayWithSuffix}・${formattedTime}`;
};

export const parseDateTimeInputForServices = (
	dateTimeInput: string
): {
	startDate: string;
	startTime: string;
	endDate: string;
	endTime: string;
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

	return {
		startDate: startDt.toFormat("yyyy-MM-dd"),
		startTime: startDt.toFormat("HH:mm:ss"),
		endDate: endDt.toFormat("yyyy-MM-dd"),
		endTime: endDt.toFormat("HH:mm:ss"),
	};
};
