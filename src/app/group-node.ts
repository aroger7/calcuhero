import { EquationNode } from './equation-node';
import { BigNumber } from 'bignumber.js';

export class GroupNode implements EquationNode {
	constructor(parent?: EquationNode, left?: EquationNode) {
	}

	public children: EquationNode[] = [];
	public isClosed: boolean = false;
	public maxChildren: number = 1;
	public parent: EquationNode;
	public precedence = 3;

	public get canClose(): boolean {
		return this.numChildren === this.maxChildren
			&& this.children[0].canEvaluate;
	}

	public get canEvaluate(): boolean {
		return this.numChildren === this.maxChildren
			&& this.children.every(child => child.canEvaluate);
	}

	public get numChildren(): number {
		return this.children.length;
	}

	public getInfixString(): string {
		let childInfix = this.children[0]
			? this.children[0].getInfixString()
			: '';
		return '('
			+ childInfix
			+ (this.isClosed
				? ')'
				: '');
	}

	public evaluate(): BigNumber {
		return this.children[0].evaluate();
	}
}
