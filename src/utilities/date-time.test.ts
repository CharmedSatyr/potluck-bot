import { parseDateTimeInputForServices } from "./date-time";

describe("date-time", () => {
	describe("parseDateTimeInputForServices", () => {
		it("should return null when it receives an unparseable input", () => {
			const result = parseDateTimeInputForServices("hi there. date?");

			expect(result).toBeNull();
		});

		it("should return null when it receives a past start time", () => {
			const result = parseDateTimeInputForServices("November 7, 1863 at 4pm");

			expect(result).toBeNull();
		});

		it("should return the expected results", () => {
			const result = parseDateTimeInputForServices(
				"January 9, 2030 at 9am to January 10, 2030 at 1:30pm"
			);

			const expected = {
				endDate: "2030-01-10",
				endTime: "13:30:00",
				endUtcMs: 1894311000000,
				startDate: "2030-01-09",
				startTime: "09:00:00",
				startUtcMs: 1894208400000,
			};

			expect(result).toEqual(expected);
		});
	});
});
