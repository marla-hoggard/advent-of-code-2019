const INPUTS = [
  null,
  DAY1,
  DAY2,
  DAY3,
];

const ANSWERS = {
  "1-1": totalFuelRequirement,
  "1-2": totalFuelRequirement2,
  "2-1": input => programAlarm1202(input, 12, 2), // noun = 12, verb = 2, from puzzle spec
  "2-2": input => findNounVerb(input, 19690720), // output = 19690720, from puzzle spec
  "3-1": crossedWires,
  "3-2": crossedWires2,
};