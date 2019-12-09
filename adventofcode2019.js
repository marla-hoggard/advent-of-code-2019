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

/* ------------------ DAY 4 -------------------- */

// Day 4 - Puzzle 1
const validPasswords = input => {
	const [lowerBound, upperBound] = input.split('-').map(el => +el);
	let count = 0;

	for (let i = lowerBound; i <= upperBound; i++) {
		if (hasDouble(i) && isIncreasing(i)) {
			count++;
		}
	}
	return count;
}

const hasDouble = num => {
	return !!String(num).match(/(\d)\1/);
};

const isIncreasing = num => {
	const digits = String(num).split('');
	for (let i = 0; i < digits.length - 1; i++) {
		if (digits[i] > digits[i + 1]) {
			return false;
		}
	}
	return true;
}

// Day 4 - Puzzle 2
const validPasswords2 = input => {
	const [lowerBound, upperBound] = input.split('-').map(el => +el);
	let count = 0;

	for (let i = lowerBound; i <= upperBound; i++) {
		if (isIncreasing(i) && hasSoloDouble(i)) {
			count++;
		}
	}
	return count;
}

const hasSoloDouble = num => {
	let digits = [];
	String(num).split('').forEach(d => {
		if (digits[digits.length - 1] && digits[digits.length - 1].slice(-1) === d) {
			digits[digits.length - 1] += d;
		} else {
			digits.push(d);
		}
	});
	return !!digits.find(el => el.length === 2);
};

/* ------------------ DAY 5 -------------------- */

// Day 5 - Puzzles 1 & 2
// Modified for Day 7
const diagnosticTest = (puzzleInput, input1, input2 = input1) => {
	let program = puzzleInput.split(',').map(el => +el);
	let outputValue;
	let hasUsedInput = false;

	let i = 0;
	while (i < program.length) {
		const opCode = parseOpCode(program[i]);
		let param1, param2, val1, val2, where;

		switch (opCode.code) {
			case 99:
				return outputValue;
			case 1:
				[param1, param2, where] = program.slice(i + 1, i + 4);
				val1 = opCode.paramTypes[0] === '0' ? program[param1] : param1;
				val2 = opCode.paramTypes[1] === '0' ? program[param2] : param2;
				program[where] = val1 + val2;
				i += 4;
				break;
			case 2:
				[param1, param2, where] = program.slice(i + 1, i + 4);
				val1 = opCode.paramTypes[0] === '0' ? program[param1] : param1;
				val2 = opCode.paramTypes[1] === '0' ? program[param2] : param2;
				program[where] = val1 * val2;
				i += 4;
				break;
			case 3:
				param1 = program[i + 1];
				program[param1] = hasUsedInput ? input2 : input1;
				hasUsedInput = true;
				i += 2;
				break;
			case 4:
				param1 = program[i + 1];
				val1 = opCode.paramTypes[0] === '0' ? program[param1] : param1;
				outputValue = val1;
				// console.log('Outputting', val1);
				i += 2;
				break;
			case 5:
				[param1, param2] = [program[i + 1], program[i + 2]];
				val1 = opCode.paramTypes[0] === '0' ? program[param1] : param1;
				val2 = opCode.paramTypes[1] === '0' ? program[param2] : param2;
				i = val1 !== 0 ? val2 : i + 3;
				break;
			case 6:
				[param1, param2] = [program[i + 1], program[i + 2]];
				val1 = opCode.paramTypes[0] === '0' ? program[param1] : param1;
				val2 = opCode.paramTypes[1] === '0' ? program[param2] : param2;
				i = val1 === 0 ? val2 : i + 3;
				break;
			case 7:
				[param1, param2, where] = program.slice(i + 1, i + 4);
				val1 = opCode.paramTypes[0] === '0' ? program[param1] : param1;
				val2 = opCode.paramTypes[1] === '0' ? program[param2] : param2;
				program[where] = val1 < val2 ? 1 : 0;
				i += 4;
				break;
			case 8:
				[param1, param2, where] = program.slice(i + 1, i + 4);
				val1 = opCode.paramTypes[0] === '0' ? program[param1] : param1;
				val2 = opCode.paramTypes[1] === '0' ? program[param2] : param2;
				program[where] = val1 === val2 ? 1 : 0;
				i += 4;
				break;
			default:
				console.log(`Invalid opCode at pos ${i}`, opCode);
				return;
		}
	}
};

const parseOpCode = opCode => {
	if (opCode === 99) {
		return { code: 99 };
	}
	const splitCode = String(opCode).split('').reverse();
	const code = +splitCode[0];
	let numParams;
	switch (code) {
		case 1:
		case 2:
		case 7:
		case 8:
			numParams = 3;
			break;
		case 3:
		case 4:
			numParams = 1;
			break;
		case 5:
		case 6:
			numParams = 2;
			break;
		default:
			console.log('Invalid opCode', code);
			return;
	}
	const paramTypes = splitCode.slice(2).join('').padEnd(numParams, '0').split('');

	return {
		code,
		paramTypes,
	};
};

/* ------------------ DAY 6 -------------------- */

// Day 6 - Puzzle 1
// Find the total number of orbits in the input universe
const totalOrbits = input => {
	const map = createOrbitMap(input);
	return map.reduce((tally, cur) => tally + cur.desc.length, 0);
};

// Creates an orbit map from the puzzle input
// Form: Array of { name: string, parent: string, children[], desc[] }
const createOrbitMap = input => {
	const allPatterns = input.split('\n');
	let patterns = input.split('\n');
	let map = [];
	let queue = ['COM'];
	while (patterns.length || queue.length) {
		const name = queue.shift();
		const parent = getParentName(allPatterns, name);
		const children = patterns.filter(el => el.startsWith(name)).map(el => el.split(')')[1]);
		map.push({ name, parent, children, desc: children });

		const ancestors = map.filter(el => el.desc.includes(name));
		ancestors.forEach(ancestor => ancestor.desc = ancestor.desc.concat(children))

		queue = queue.concat(children);

		patterns = patterns.filter(el => !el.startsWith(name));
	}
	return map;
};

// Returns the name of the parent object, given a list of patters and the name of this object
const getParentName = (patterns, name) => {
	const pattern = patterns.find(el => el.endsWith(name));
	if (!pattern) {
		return null;
	}
	const [parent] = pattern.split(')');
	return parent;
}

// Day 6 - Puzzle 2
const fromYouToSanta = input => {
	const map = createOrbitMap(input);
	const commonAncestors = map.filter(el => el.desc.includes('YOU') && el.desc.includes('SAN'));

	// Map each common ancestor to the total distance from YOU and SAN to that ancestor
	// Then subtract 2 since the puzzle wants distance from YOU's parent to SAN's parent
	// If this is built on in a later puzzle, move the specificity elsewhere
	const distances = commonAncestors.map(anc => findOrbitDistance(map, anc.name, 'YOU') + findOrbitDistance(map, anc.name, 'SAN') - 2);
	return Math.min(...distances);
}

// Finds the distance from @planet to @ancestor in the given @map universe
// @ancestor, @planet are name strings
const findOrbitDistance = (map, ancestor, planet) => {
	let count = 0;
	let current = planet;
	while (current !== ancestor) {
		const curObject = map.find(el => el.name === current);
		current = map.find(el => el.name === curObject.parent);
		if (current) {
			current = current.name;
		} else {
			console.log(curObject);
		}
		count++;
	}
	return count;
}

/* ------------------ DAY 7 -------------------- */

// Day 7 - Puzzle 1
// Runs amplifiers on all possible values of phases
// Returns the value of the max output
const findMaxOutput = input => {
	let maxValue = -Infinity;
	let bestPhases;

	const permutations = getPermutations("01234");
	permutations.forEach(perm => {
		const output = amplifiers(input, perm);
		if (output > maxValue) {
			maxValue = output;
			bestPhases = perm;
		}
	});

	console.log(bestPhases);
	return maxValue;
}

// Runs the diagnostic test five times,
// using the five digits of phases as input1
// and each run's output as input2 of the next test
// @phases = A five digit string
const amplifiers = (input, phases) => {
	let output = 0;
	phases.split('').map(el => +el).forEach(phase => {
		output = diagnosticTest(input, phase, output);
	});
	return output;
}

// Takes a string
// Returns an array of all possible permutations of the characters in string
// Note: This assumes all chars in str are unique, since they are for Day 7, Puzzle 1
// To account for duplicates, change the return to `Array.from(new Set(perms))`
const getPermutations = str => {
	const allChars = str.split('');
	let perms = [...allChars];

	while (perms[0].length < str.length) {
		let nextPerms = [];
		perms.forEach(perm => {
			nextPerms = nextPerms.concat(
				allChars.filter(char => !perm.includes(char))
					.map(end => perm + end));
		});
		perms = [...nextPerms];
	}

	return perms;
}

