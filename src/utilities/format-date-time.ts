const formatDateTime = (date: Date | null): string => {
	if (!date) {
		return "";
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

export default formatDateTime;
