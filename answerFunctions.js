const INPUTS = [
  null,
  DAY1,
  DAY2,
  DAY3,
  DAY4,
];

// Which function to run to display the answer to a given puzzle
// Key: {day}-{puzzle}
// The function is passed one parameter, INPUT[day]
// If the answer function requires other parameters, write an anonymous function that takes input (i.e. 2-1)
const ANSWERS = {
  "1-1": totalFuelRequirement,
  "1-2": totalFuelRequirement2,
  "2-1": input => programAlarm1202(input, 12, 2), // noun = 12, verb = 2, from puzzle spec
  "2-2": input => findNounVerb(input, 19690720), // output = 19690720, from puzzle spec
  "3-1": crossedWires,
  "3-2": crossedWires2,
  "4-1": validPasswords,
  "4-2": validPasswords2,
};