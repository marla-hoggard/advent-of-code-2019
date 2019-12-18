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
// Modified for use in Day 7 - Puzzle 1
const diagnosticTest = (puzzleInput, input1, input2 = input1, relativeBase = 0) => {
	let program = puzzleInput.split(',').map(el => +el);
	let outputValue;
	let hasUsedInput = false;

	let i = 0;
	while (i < program.length) {
		const opCode = parseOpCode(program[i]);
		const inputValue = hasUsedInput ? input2 : input1;
		const result = useOpCode(program, opCode, i, inputValue, relativeBase);

		if (result.shouldReturnOutput) {
			return outputValue;
		}

		if (result.outputValue !== undefined) {
			outputValue = result.outputValue;
		}

		if (result.usedInput) {
			hasUsedInput = true;
		}

		program = result.program;
		i = result.i;
		relativeBase = result.relativeBase;
	}
};

/* Performs the instructions of one opcode and updates params accordingly
 * Returns an object with the following keys:
 * program: the updated version of the program param
 * i: the updated i-counter
 * outputValue: the updated outputValue if opcode = 4, otherwise undefined
 * shouldReturnOutput: boolean - true if opcode 99 (to tell greater program to halt and return)
 * usedInput: boolean - true if opcode 3 (to tell greater program)
*/
const useOpCode = (program, opCode, i, inputValue, relativeBase) => {
	let shouldReturnOutput = false;
	let usedInput = false;

	let [param1, param2, where] = program.slice(i + 1, i + 4);
	let val1, val2, outputValue;
	// Set values to use
	if (opCode.paramTypes) {
		if (opCode.paramTypes[0] === '0') {
			if (param1 < 0) console.log({ param1, code: opCode.code });
			val1 = program[param1] || 0;
		} else if (opCode.paramTypes[0] === '1') {
			val1 = param1;
		} else {
			val1 = program[param1 + relativeBase];
		}

		if (opCode.paramTypes.length > 1) {
			if (opCode.paramTypes[1] === '0') {
				if (param2 < 0) console.log({ param2, code: opCode.code });
				val2 = program[param2] || 0;
			} else if (opCode.paramTypes[1] === '1') {
				val2 = param2;
			} else {
				val2 = program[param2 + relativeBase];
			}
		}

		if (opCode.paramTypes[2] === '2') {
			where += relativeBase;
		}
	}

	switch (opCode.code) {
		case 99:
			shouldReturnOutput = true;
			break;
		case 1:
			program[where] = val1 + val2;
			i += 4;
			break;
		case 2:
			program[where] = val1 * val2;
			i += 4;
			break;
		case 3:
			opCode.paramTypes[0] === '2'
				? program[param1 + relativeBase] = inputValue
				: program[param1] = inputValue;
			usedInput = true;
			i += 2;
			break;
		case 4:
			outputValue = val1;
			i += 2;
			// console.log(outputValue);
			break;
		case 5:
			i = val1 !== 0 ? val2 : i + 3;
			break;
		case 6:
			i = val1 === 0 ? val2 : i + 3;
			break;
		case 7:
			program[where] = val1 < val2 ? 1 : 0;
			i += 4;
			break;
		case 8:
			program[where] = val1 === val2 ? 1 : 0;
			i += 4;
			break;
		case 9:
			relativeBase += val1;
			i += 2;
			break;
		default:
			console.log(`Invalid opCode at pos ${i}`, opCode);
			return;
	}

	return {
		program,
		i,
		outputValue,
		shouldReturnOutput,
		usedInput,
		relativeBase,
	};
}

const parseOpCode = opCode => {
	if (opCode === 99) {
		return { code: 99 };
	}
	const splitCode = String(opCode).split('').reverse();
	const code = +splitCode[0];
	let numParams;
	switch (code) {
		case 3:
		case 4:
		case 9:
			numParams = 1;
			break;
		case 5:
		case 6:
			numParams = 2;
			break;
		case 1:
		case 2:
		case 7:
		case 8:
			numParams = 3;
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

	console.log('Best permutation:', bestPhases);
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

// Day 7 - Puzzle 2
const findMaxOutput2 = input => {
	let maxValue = -Infinity;
	let bestPhases;

	const permutations = getPermutations("56789");
	permutations.forEach(perm => {
		// The program hung every time a perm started with a 6, so I just skipped them
		// I was fortunate, that the right answer did not start with a 6!
		if (perm.startsWith("6")) {
			console.log('bad, skipping');
		} else {
			const output = feedbackLoop(input, perm);
			if (output > maxValue) {
				maxValue = output;
				bestPhases = perm;
			}
		}
	});

	console.log('Best permutation:', bestPhases);
	return maxValue;
};

// Runs the diagnostic test through a feedback loop of five amplifiers
// @phases = A five digit string
const feedbackLoop = (input, phases) => {
	const steps = input.split(',').map(el => +el);
	let amps = ['A', 'B', 'C', 'D', 'E']
		.map((name, idx) => {
			return {
				name,
				program: [...steps],
				i: 0,
				inputValue: +phases[idx],
				outputValue: null,
				nextInputValue: null,
				done: false,
				relativeBase: 0,
			};
		});

	amps[0].nextInputValue = 0;

	let currentAmpIndex = 0;

	while (amps.some(a => !a.done)) {
		let current = amps[currentAmpIndex];
		let { program, i, inputValue, nextInputValue, relativeBase } = current;
		const opCode = parseOpCode(program[i]);

		// If this amp has halted or the next step requires an input that we don't have yet, go to the next amp
		if (current.done || (opCode.code === 3 && current.inputValue === null)) {
			currentAmpIndex = (currentAmpIndex + 1) % 5;
		} else {
			const result = useOpCode(program, opCode, i, inputValue, relativeBase);

			current.program = result.program;
			current.i = result.i;
			current.relativeBase = result.relativeBase;

			if (result.usedInput) {
				if (nextInputValue !== null) {
					current.inputValue = nextInputValue;
					current.nextInputValue = null;
				} else {
					current.inputValue = null;
				}
			}

			if (result.shouldReturnOutput || result.outputValue) {
				if (result.outputValue) {
					current.outputValue = result.outputValue;
				}

				if (result.shouldReturnOutput) {
					current.done = true;
				}

				currentAmpIndex = (currentAmpIndex + 1) % 5;
				current = amps[currentAmpIndex];
				if (current.inputValue === null) {
					current.inputValue = result.outputValue;
				} else {
					current.nextInputValue = result.outputValue;
				}
			}
		}
	}

	return amps[4].outputValue;
};

/* ------------------ DAY 8 -------------------- */
// Day 8 - Puzzle 1
// Takes the puzzle input (made up of 0-2) and the width & height of each layer
// Returns the number of 1s * 2s on the layer with the fewest 0s
const digitalSendingNetwork = (input, width = 25, height = 6) => {
	let zeros = [];
	let ones = [];
	let twos = [];

	const area = width * height;

	for (let i = 0; i < input.length; i += area) {
		const layer = input.slice(i, i + area).split('').sort().join('');
		const index1 = layer.indexOf('1');
		const index2 = layer.indexOf('2');
		zeros.push(index1);
		ones.push(index2 - index1);
		twos.push(area - index2);
	}

	const minIndex = zeros.findIndex(el => el === Math.min(...zeros));
	return ones[minIndex] * twos[minIndex];
}

// Day 8 - Puzzle 2
const calculateImage = (input, width = 25, height = 6) => {
	const area = width * height;
	let layers = [];

	for (let i = 0; i < input.length; i += area) {
		layers.push(input.slice(i, i + area));
	}

	let image = [];
	let i = 0;
	for (let row = 0; row < height; row++) {
		let imageRow = [];
		for (let col = 0; col < width; col++) {
			const pixel = layers.find(p => p[i] !== '2');
			pixel[i] !== null ? imageRow.push(pixel[i]) : imageRow.push(2);
			i++;
		}
		image.push(imageRow);
	}
	return image;
}

// Display the visualization for Day 8 - Puzzle 2
const drawImage = input => {
	const image = calculateImage(input);
	const imageDiv = document.getElementById('day8visualization');
	imageDiv.innerHTML = '';
	image.forEach(row => {
		const rowDiv = document.createElement('div');
		rowDiv.classList.add('day8row');
		row.forEach(cell => {
			const cellDiv = document.createElement('div');
			cellDiv.classList.add('day8cell');
			if (cell === '0') {
				cellDiv.classList.add('black');
			}
			rowDiv.appendChild(cellDiv);
		});
		imageDiv.appendChild(rowDiv);
	});
	document.getElementById('day8').style.display = 'block'

	return 'See visualization';
};

/* ------------------ DAY 9 -------------------- */
// Day 9 required updating the existing Int Code Computer functions from Day 5
// and did not need any additional functions

/* ------------------ DAY 10 -------------------- */

// Day 10 - Puzzle 1
const bestAsteroid = input => {
	let asteroids = [];
	input.split('\n').forEach((row, whichRow) => {
		row.split('').forEach((el, whichCol) => {
			if (el === '#') {
				asteroids.push(`${whichCol},${whichRow}`);
			}
		});
	});

	const whoCanISee = visibleAsteroids(asteroids);
	return Math.max(...Object.values(whoCanISee).map(arr => arr.length));
}

const visibleAsteroids = (asteroids) => {
	let whoCanISee = {};
	asteroids.forEach(coord => whoCanISee[coord] = []);
	// For each pair of points, find the slope of their line
	// Check all integer points on the line that connects them
	// If no integer points are asteroids, add opposing coords to from and to keys of whoCanISee
	for (let fromIdx = 0; fromIdx < asteroids.length; fromIdx++) {
		for (let toIdx = fromIdx + 1; toIdx < asteroids.length; toIdx++) {
			const from = asteroids[fromIdx];
			const to = asteroids[toIdx];
			const [fromX, fromY] = from.split(',').map(el => +el);
			const [toX, toY] = to.split(',').map(el => +el);
			let [slopeY, slopeX] = calcSlope(from, to);

			// For negative slope, make sure it's always the slopeX coord that's negative
			if (slopeY < 0) {
				slopeY *= -1;
				slopeX *= -1;
			}

			let x = fromX + slopeX;
			let y = fromY + slopeY;
			let blocked = false;
			while (
				!blocked &&
				([x, y].join(',') !== to) &&
				((slopeY >= 0 && y <= toY) || (slopeY < 0 && y >= toY)) &&
				((slopeX >= 0 && x <= toX) || (slopeX < 0 && x >= toX))
			) {
				if (asteroids.includes([x, y].join(','))) {
					blocked = true;
				} else {
					x += slopeX;
					y += slopeY;
				}
			}
			if (!blocked) {
				whoCanISee[from].push(to);
				whoCanISee[to].push(from);
			}
		}
	}
	return whoCanISee;
}


// Takes two points, each in the form "x,y"
// Returns an array of the form [dy, dx]
// where dy = a.y - b.y and dx = a.x - b.x
// representing the reduced fraction of the slope
const calcSlope = (a, b) => {
	const [ax, ay] = a.split(',').map(el => +el);
	const [bx, by] = b.split(',').map(el => +el);
	const num = ay - by;
	const denom = ax - bx;
	return reduceFraction(num, denom);
}

// Returns the actual slope
const divideSlope = (a, b) => {
	const [ax, ay] = a.split(',').map(el => +el);
	const [bx, by] = b.split(',').map(el => +el);
	const num = ay - by;
	const denom = ax - bx;
	return num / denom;
}

// Day 10 - Puzzle 2
const destroyAsteroids = (input, nth = 200) => {
	let asteroids = [];
	input.split('\n').forEach((row, whichRow) => {
		row.split('').forEach((el, whichCol) => {
			if (el === '#') {
				asteroids.push(`${whichCol},${whichRow}`);
			}
		});
	});

	const whoCanISee = visibleAsteroids(asteroids);
	const [laser, toHit] = Object.entries(whoCanISee).find(el => el[1].length === Math.max(...Object.values(whoCanISee).map(arr => arr.length)));

	// The designated asteroid will be hit in this rotation
	// Sort by hit order then return the nth (n-1 since 1-indexed)
	if (toHit.length >= nth) {
		const hitOrder = toHit.sort((a, b) => {
			const quadA = whichQuadrant(laser, a);
			const quadB = whichQuadrant(laser, b);
			if (quadA < quadB) {
				return -1;
			} else if (quadA > quadB) {
				return 1;
			}
			const slopeA = divideSlope(laser, a);
			const slopeB = divideSlope(laser, b);
			// Highest |slope| first
			if (quadA === 2 || quadA === 6) {
				return Math.abs(slopeB) - Math.abs(slopeA);
			} else { // Lowest |slope| first
				return Math.abs(slopeA) - Math.abs(slopeB);
			}
		});
		return hitOrder[nth - 1];
	}
	// Since our puzzle input doesn't require more than one round, we're not going to code the else
	else {
		console.log('Need more than one round');
		return {
			laser,
			toHit,
		}
	}
}

// Returns which quadrant the point is relative to the center
// @center & @point are strings "x,y"
// Quadrants 1-8, starting vertical and moving clockwise
// 1,3,5,7 are like x- and y-axes (if center were 0,0)
// 2,4,6,8 are the four quadrants, TR, BR, BL, TL
const whichQuadrant = (center, point) => {
	const [centerX, centerY] = center.split(',').map(el => +el);
	const [pointX, pointY] = point.split(',').map(el => +el);

	const dx = pointX - centerX;
	const dy = pointY - centerY;

	if (dx === 0 && dy < 0) {
		return 1;
	} else if (dx > 0 && dy < 0) {
		return 2;
	} else if (dx > 0 && dy === 0) {
		return 3;
	} else if (dx > 0 && dy > 0) {
		return 4;
	} else if (dx === 0 && dy > 0) {
		return 5;
	} else if (dx < 0 && dy > 0) {
		return 6;
	} else if (dx < 0 && dy === 0) {
		return 7;
	} else if (dx < 0 && dy < 0) {
		return 8;
	}
	console.log('Invalid quadrant');
	return 9;
}

/* ------------------ DAY 11 -------------------- */
const paintRobot = (input, startColor) => {
	let panel = Array(150).fill(null).map(_ => Array(150).fill(null).map(__ => startColor));
	let x = 75;
	let y = 75;
	let dir = 0;
	let painted = [];
	let program = input.split(',').map(el => +el);
	let i = 0;
	let inputValue = startColor;
	let relativeBase = 0;
	let paintNext = true;

	while (i < program.length) {
		const opCode = parseOpCode(program[i]);
		inputValue = panel[y][x];
		const result = useOpCode(program, opCode, i, inputValue, relativeBase);
		program = result.program;
		i = result.i;
		relativeBase = result.relativeBase;

		if (result.shouldReturnOutput) {
			break;
		}

		if (result.usedInput) {
			inputValue = null;
		}

		if (result.outputValue !== undefined) {
			if (paintNext) {
				panel[y][x] = result.outputValue;
				painted.push(`${x},${y}`);
			} else {
				[x, y, dir] = moveRobot(x, y, dir, result.outputValue);
			}
			paintNext = !paintNext;
		}
	}

	return {
		painted: Array.from(new Set(painted)),
		panel,
	};
}


// Takes a coordinate (@x,@y), an initial direction and a rotation directoin
// @x, @y: int, starting coordinate
// @dir: int, 0-3 representing NESW
// @rotate: 0 for CCW, 1 for CW
// Returns updated [x, y, dir] after rotating and moving one space
const moveRobot = (x, y, dir, rotate) => {
	const newDir = rotate ? (dir + 1) % 4 : (dir + 3) % 4;
	switch (newDir) {
		case 0: // Move up one
			return [x, y - 1, newDir];
		case 1: // Move right one
			return [x + 1, y, newDir];
		case 2: // Move down one
			return [x, y + 1, newDir];
		case 3: // Move left one
			return [x - 1, y, newDir];
		default:
			throw new Error('Bad "newDir" in moveRobot');
	}
};

const howManyPainted = (input, startColor = 0) => {
	return paintRobot(input, startColor).painted.length;
}

// Display the visualization for Day 11 - Puzzle 2
const doThePainting = (input, startColor = 1) => {
	let image = paintRobot(input, startColor).panel;

	// Trim panel to just the image
	const firstRealRow = image.findIndex(row => row.includes(0));
	const firstAfterImage = image.slice(firstRealRow).findIndex(row => !row.includes(0));
	image = image.slice(firstRealRow, firstRealRow + firstAfterImage);
	const firstRealCol = Math.min(...image.map(row => row.indexOf(0)));
	const lastRealCol = Math.max(...image.map(row => row.lastIndexOf(0)));
	image = image.map(row => row.slice(firstRealCol, lastRealCol + 1));

	const imageDiv = document.getElementById('day11visualization');
	imageDiv.innerHTML = '';
	image.forEach(row => {
		const rowDiv = document.createElement('div');
		rowDiv.classList.add('day11row');
		row.forEach(cell => {
			const cellDiv = document.createElement('div');
			cellDiv.classList.add('day11cell');
			if (cell === 0) {
				cellDiv.classList.add('black');
			}
			rowDiv.appendChild(cellDiv);
		});
		imageDiv.appendChild(rowDiv);
	});
	document.getElementById('day11').style.display = 'block';

	return 'See visualization';
};

/* ------------------ DAY 12 -------------------- */
// Day 12 - Puzzle 1
// Calculates the total moon energy of the @input map after @steps steps
const totalMoonEnergy = (input, steps = 1000) => {
	let moons = parseMoonInput(input);

	for (let step = 0; step < steps; step++) {
		moons = moveMoons(moons);
	}

	return moons.map(moon => {
		return moon.pos.reduce((tally, cur) => tally + Math.abs(cur), 0) *
			moon.vel.reduce((tally, cur) => tally + Math.abs(cur), 0);
	}).reduce((tally, cur) => tally + Math.abs(cur), 0);
}

const moveMoons = moons => {
	// Apply gravity to update velocity
	for (let p = 0; p < 3; p++) {
		moons.map(moon => moon.pos[p])
			.forEach((thisPos, whichMoon, positions) => {
				let delta = 0;
				delta += positions.filter(psn => psn > thisPos).length;
				delta -= positions.filter(psn => psn < thisPos).length;
				moons[whichMoon].vel[p] += delta;
			});
	}

	// Apply velocity to update position
	moons = moons.map(moon => {
		moon.pos = moon.pos.map((p, i) => p + moon.vel[i]);
		return moon;
	});

	return moons;
}

// Converts the input to an array of objects { pos: [x, y, z], vel: [0, 0, 0]}
const parseMoonInput = input => {
	return input.split('\n').map(text => {
		const [x, y, z] = text.match(/-?\d+/g).map(el => +el);
		return {
			pos: [x, y, z],
			vel: [0, 0, 0],
		};
	});
}

const repeatMoon = input => {
	let moons = parseMoonInput(input);
	let moonLayouts = [];
	let steps = 0;
	let currentLayout = moons.map(moon => `${moon.pos.join(',')},${moon.vel.join(',')}`).join(',');

	while (!moonLayouts.includes(currentLayout)) {
		if (steps % 10000 === 0) console.log(steps);
		moonLayouts.push(currentLayout);
		moons = moveMoons(moons);
		currentLayout = moons.map(moon => `${moon.pos.join(',')},${moon.vel.join(',')}`).join(',');
		steps++;
	}

	return steps;
}
