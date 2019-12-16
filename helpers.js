const manhattanDistance = ([x1, y1], [x2, y2]) => {
	return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

const reduceFraction = (numerator, denominator) => {
	const gcd = greatestCommonDenominator(numerator, denominator);
	return [numerator / gcd, denominator / gcd];
}

const greatestCommonDenominator = (a, b) => b ? greatestCommonDenominator(b, a % b) : a;