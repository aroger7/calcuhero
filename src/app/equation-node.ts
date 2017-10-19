import { BigNumber } from 'bignumber.js';

export interface EquationNode {
	canEvaluate: boolean;
	children: EquationNode[];
	maxChildren: number;
	numChildren: number;
	parent: EquationNode;
	precedence: number;

	getInfixString(): string;
	evaluate(): BigNumber;
}