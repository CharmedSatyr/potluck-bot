const getRandomPlaceholder = (placeholders: string[]) => {
	const randomIndex = Math.floor(Math.random() * placeholders.length);

	return placeholders[randomIndex];
};

export default getRandomPlaceholder;
