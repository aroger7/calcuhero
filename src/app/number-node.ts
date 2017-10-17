import { EquationNode } from './equation-node';

export class NumberNode implements EquationNode {
	constructor(public number: number, parent?: EquationNode) {
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

	public evaluate(): number {
		return this.number;
	}

	public getInfixString(): string {
		return this.number.toString();
	}
}
