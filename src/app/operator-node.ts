import { EquationNode } from './equation-node';

export abstract class OperatorNode implements EquationNode {

	constructor(parent?: EquationNode, left?: EquationNode, right?: EquationNode) {
	}

	public children: EquationNode[] = [];
	public maxChildren: number = 2;
	public operatorString: string = undefined;
	public parent: EquationNode = undefined;
	public abstract precedence: number;

	public get canEvaluate(): boolean {
		return this.numChildren === this.maxChildren
			&& this.children.every(child => child.canEvaluate);
	}

	public get numChildren(): number {
		return this.children.length;
	}

	public abstract evaluate(): number;

	public getInfixString(): string {
		let leftInfix = this.children[0]
			? this.children[0].getInfixString()
			: '';
		let rightInfix = this.children[1]
			? this.children[1].getInfixString()
			: '';

		return leftInfix +
			' ' +
			this.operatorString +
			' ' +
			rightInfix;
	}
}
