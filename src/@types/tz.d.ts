/**
 * IANA format used by Luxon
 * See https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
 */
export type SupportedTimezones =
	| "America/Los_Angeles"
	| "America/Denver"
	| "America/Chicago"
	| "America/New_York"
	| "Etc/UTC";

/**
 * Chrono maps timezone abbreviations to second offsets.
 * See https://github.com/wanasit/chrono/blob/master/src/timezone.ts
 */
export type SupportedChronoTZ = "PT" | "MT" | "CT" | "ET" | "UTC";
