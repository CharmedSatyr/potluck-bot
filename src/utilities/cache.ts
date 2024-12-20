import NodeCache from "node-cache";

export const slotsCache = new NodeCache({
	stdTTL: 3600,
	checkperiod: 1200,
});
