import { OperatorNode } from './operator-node';

export class DivisionNode extends OperatorNode {
	public operatorString = '\u00F7';
	public precedence = 2;

	public evaluate(): number {
		let val = this.children[0].evaluate() / this.children[1].evaluate();
		if (val === Infinity || val === -Infinity) {
			throw new Error("Calculated value is infinity");
		}

		return val;
	}
}
