import { EquationNode } from './equation-node';
import { BigNumber } from 'bignumber.js';

export class NumberNode implements EquationNode {

	constructor(public number: BigNumber, parent?: EquationNode) {
	}

	public parent: EquationNode;
	public precedence: number = 4;
	public maxChildren: number = 0;
	public numChildren: number = 0;

	public get canEvaluate(): boolean {
		return true;
	}

	public get children(): EquationNode[] {
		return [];
	}

	public evaluate(): BigNumber {
		return this.number;
	}

	public getInfixString(): string {
		return this.number.toString();
	}
}
