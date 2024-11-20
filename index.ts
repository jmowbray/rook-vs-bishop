import { SimResult, Simulator } from "./simulator";
import { Position } from "./game-board";

const rookStart: Position = [7, 7];
const bishopStart: Position = [5, 2];
const numberOfTurns = 15;

const simulator = new Simulator(rookStart, bishopStart, numberOfTurns);

const result: SimResult = simulator.simulate();

console.log(`${result.winner} won after ${result.numberOfTurns} turns`);