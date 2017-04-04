var population = [];
const TARGET = 200;
const MIN = 0;
const MAX = TARGET - 1;
const IND_COUNT = 4;
const POP_SIZE = 100;
const CLOSE_ENOUGH = 0.001;

var RETAIN = 0.02;
var RANDOM_SELECTION = 0.05;
var MUTATION_PROBABILITY = 0.01;

function randomInt(min, max) {
	return Math.round(random(min, max));
}

function random(min, max) {
	if (max == undefined) {
		max = min;
		min = 0;
	}
	if (max == undefined) {
		max = 100;
	}
	return (Math.random()*(max-min)) + min;
}

function fitness(individual) {
	sum = individual.reduce((a,b) => a + b, 0);
	return Math.abs(TARGET - sum);
}

function sortByFitness(population) {
	population.sort((a, b) => {
		var fitA = fitness(a);
		var fitB = fitness(b);
		return fitA > fitB ? 1 : -1;
	});

	return population;
}

function randomIndividual() {
	var individual = [];
	for (var i = 0; i < IND_COUNT; i++) {
		individual.push(random(MIN, MAX));
	}
	return individual;
}

function randomPopulation(size) {
	var population = [];
	for (var i = 0; i < size; i++) {
		population.push(randomIndividual());
	}
	return population;
}

function mutate(population) {
	for (var i=0; i < population.length; i++) {
		if (MUTATION_PROBABILITY > Math.random()) {
			var index = randomInt(population[i].length);
			population[i][index] = random(MIN, MAX);
		}
	}

	return population;
}

function reproduce(father, mother) {
	var half = father.length / 2;
	var child = [];
	child = child.concat(father.slice(0, half), mother.slice(half, mother.length));
	return child;
}

function evolve(population) {
	var parents = [];

	//Keep the best solutions
	parents = sortByFitness(population).slice(0, Math.round(POP_SIZE*RETAIN));

	//Randomly add new elements
	for (var i = parents.length; i < POP_SIZE - parents.length; i++) {
		if (RANDOM_SELECTION > Math.random()) {
			parents.push(randomIndividual());
		}
	}

	//Mutate elements
	parents = mutate(parents);
	var rndMax = parents.length - 1;

	while (parents.length < POP_SIZE) {
		var father = randomInt(rndMax);
		var mother = randomInt(rndMax);
		if (father != mother) {
			father = parents[father];
			mother = parents[mother];
			parents.push(reproduce(father, mother));
		}
	}

	return parents;

}

function findSolution() {
	var population = randomPopulation(POP_SIZE);
	var generation = 0;

	while (fitness(population[0]) > CLOSE_ENOUGH) {
		generation++;
		population = evolve(population);
	}

	return {solution: population[0], generations: generation};
}

var sol = findSolution();
console.log("Found solution in " + sol.generations + " generations.", sol.solution);