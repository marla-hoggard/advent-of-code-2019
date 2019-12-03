/* ------------------ DAY 1 -------------------- */

// Day 1 - Puzzle 1
// @input = puzzle input -> list of masses separated by new lines
// returns the total fuel required for the input using Puzzle 1 rules
const totalFuelRequirement = input => {
	return input.split('\n')
		.map(fuelRequired)
		.reduce((tally, el) => tally + el, 0);
};

// Returns the amount of fuel required for a given mass
const fuelRequired = mass => {
	return Math.floor(+mass / 3) - 2;
}

// Day 1 - Puzzle 2
// @input = puzzle input -> list of masses separated by new lines
// returns the total fuel required for the input using Puzzle 2 rules
const totalFuelRequirement2 = input => {
	return input.split('\n')
		.map(fuelRequiresFuel)
		.reduce((tally, el) => tally + el, 0);
};

// Returns the total fuel for the mass, where fuel also needs fuel
const fuelRequiresFuel = mass => {
	let total = 0;
	let fuel = fuelRequired(mass);
	do {
		total += fuel;
		mass = fuel;
		fuel = fuelRequired(mass);
	} while (fuel >= 0);
	return total;
};

/* ------------------ DAY 2 -------------------- */

// Day 2
// Takes the puzzle input, a comma-separated list of ints, and two integers (noun, verb)
// Changes values 1 and 2 to noun and verb, then runs the program
// For Puzzle 1, noun = 12 and verb = 2
const programAlarm1202 = (input, noun, verb) => {
	let program = input.split(',').map(el => +el);

	program[1] = noun;
	program[2] = verb;

	for (let i = 0; i < program.length && program[i] !== 99; i += 4) {
		const [opCode, pos1, pos2, where] = program.slice(i, i + 4);
		const val1 = program[pos1];
		const val2 = program[pos2];
		if (opCode === 1) {
			program[where] = val1 + val2;
		} else if (opCode === 2) {
			program[where] = val1 * val2;
		} else {
			console.log(`Invalid opCode ${opCode} at pos ${i}`);
			return;
		}
	}
	return program[0];
};

// Day 2 - Puzzle 2
// Find the noun and verb for the input such that
// programAlarm1202(input, noun, verb) = output
// noun and verb are integers between 0-99
const findNounVerb = (input, output) => {
	for (let noun = 0; noun <= 99; noun++) {
		for (let verb = 0; verb <= 99; verb++) {
			if (programAlarm1202(input, noun, verb) === output) {
				return (100 * noun) + verb;
			}
		}
	}
	console.log(`No pair found`);
	return;
}

/* ------------------ DAY 3 -------------------- */

// Day 3 - Puzzle 1
const crossedWires = input => {
	const [wire1, wire2] = input.split(/\s/);
	let grid = [['S']];
	let intersections = [];
	let startX = 0;
	let startY = 0;

	const drawWire = (instr, numWire) => {
		const [dir, ...rest] = instr.split('');
		const long = +rest.join('');
		let i;

		switch (dir) {
			case 'R':
				for (i = startX + 1; i <= startX + long; i++) {
					if (grid[startY][i] && grid[startY][i] < numWire) {
						grid[startY][i] = 'X';
						intersections.push([i, startY]);
					} else {
						grid[startY][i] = numWire;
					}
				}
				startX = i - 1;
				break;
			case 'L':
				for (i = startX - 1; i >= startX - long; i--) {
					if (grid[startY][i] && grid[startY][i] < numWire) {
						grid[startY][i] = 'X';
						intersections.push([i, startY]);
					} else {
						grid[startY][i] = numWire;
					}
				}
				startX = i + 1;
				break;
			case 'U':
				for (i = startY - 1; i >= startY - long; i--) {
					if (!grid[i]) {
						grid[i] = [];
					}
					if (grid[i][startX] && grid[i][startX] < numWire) {
						grid[i][startX] = 'X';
						intersections.push([startX, i]);
					} else {
						grid[i][startX] = numWire;
					}
				}
				startY = i + 1;
				break;
			case 'D':
				for (i = startY + 1; i <= startY + long; i++) {
					if (!grid[i]) {
						grid[i] = [];
					}
					if (grid[i][startX] && grid[i][startX] < numWire) {
						grid[i][startX] = 'X';
						intersections.push([startX, i]);
					} else {
						grid[i][startX] = numWire;
					}
				}
				startY = i - 1;
				break;
			default:
				console.log('Bad direction');
				return;
		}
	};

	wire1.split(',').forEach(instruction => drawWire(instruction, 1));

	startX = 0;
	startY = 0;
	wire2.split(',').forEach(instruction => drawWire(instruction, 2));

	return Math.min(...intersections.map(point => manhattanDistance([0, 0], point)));
}

// Day 3 - Puzzle 2
const crossedWires2 = input => {
	const [wire1, wire2] = input.split(/\s/);
	let grid = [['S']];
	let startX = 0;
	let startY = 0;
	let numSteps = 0;
	let minDist;

	const drawFirstWire = (instr) => {
		const [dir, ...rest] = instr.split('');
		const long = +rest.join('');
		let i;

		switch (dir) {
			case 'R':
				for (i = startX + 1; i <= startX + long; i++) {
					numSteps++;
					if (!grid[startY][i]) {
						grid[startY][i] = `A${numSteps}`;
					}
				}
				startX = i - 1;
				break;
			case 'L':
				for (i = startX - 1; i >= startX - long; i--) {
					numSteps++;
					if (!grid[startY][i]) {
						grid[startY][i] = `A${numSteps}`;
					}
				}
				startX = i + 1;
				break;
			case 'U':
				for (i = startY - 1; i >= startY - long; i--) {
					numSteps++;
					if (!grid[i]) {
						grid[i] = [];
					}
					if (!grid[i][startX]) {
						grid[i][startX] = `A${numSteps}`;
					}
				}
				startY = i + 1;
				break;
			case 'D':
				for (i = startY + 1; i <= startY + long; i++) {
					numSteps++;
					if (!grid[i]) {
						grid[i] = [];
					}
					if (!grid[i][startX]) {
						grid[i][startX] = `A${numSteps}`;
					}
				}
				startY = i - 1;
				break;
			default:
				console.log('Bad direction');
				return;
		}
	};

	const drawSecondWire = (instr) => {
		const [dir, ...rest] = instr.split('');
		const long = +rest.join('');
		let i, dist;

		switch (dir) {
			case 'R':
				for (i = startX + 1; i <= startX + long; i++) {
					numSteps++;
					if (grid[startY][i] && grid[startY][i][0] === 'A') {
						dist = numSteps + +grid[startY][i].slice(1);
						if (!minDist || dist < minDist) {
							minDist = dist;
						}
					} else {
						grid[startY][i] = `B${numSteps}`;
					}
				}
				startX = i - 1;
				break;
			case 'L':
				for (i = startX - 1; i >= startX - long; i--) {
					numSteps++;
					if (grid[startY][i] && grid[startY][i][0] === 'A') {
						dist = numSteps + +grid[startY][i].slice(1);
						if (!minDist || dist < minDist) {
							minDist = dist;
						}
					} else {
						grid[startY][i] = `B${numSteps}`;
					}
				}
				startX = i + 1;
				break;
			case 'U':
				for (i = startY - 1; i >= startY - long; i--) {
					numSteps++;
					if (!grid[i]) {
						grid[i] = [];
					}
					if (grid[i][startX] && grid[i][startX][0] === 'A') {
						dist = numSteps + +grid[i][startX].slice(1);
						if (!minDist || dist < minDist) {
							minDist = dist;
						}
					} else {
						grid[i][startX] = `B${numSteps}`;
					}
				}
				startY = i + 1;
				break;
			case 'D':
				for (i = startY + 1; i <= startY + long; i++) {
					numSteps++;
					if (!grid[i]) {
						grid[i] = [];
					}
					if (grid[i][startX] && grid[i][startX][0] === 'A') {
						dist = numSteps + +grid[i][startX].slice(1);
						if (!minDist || dist < minDist) {
							minDist = dist;
						}
					} else {
						grid[i][startX] = `B${numSteps}`;
					}
				}
				startY = i - 1;
				break;
			default:
				console.log('Bad direction');
				return;
		}
	};

	wire1.split(',').forEach(instruction => drawFirstWire(instruction));

	startX = 0;
	startY = 0;
	numSteps = 0;
	wire2.split(',').forEach(instruction => drawSecondWire(instruction));

	return minDist;
}
