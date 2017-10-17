import { OperatorNode } from './operator-node';

export class SubtractionNode extends OperatorNode {

	public operatorString = '\u2212';
	public precedence = 1;

	public evaluate(): number {
		return this.children[0].evaluate() - this.children[1].evaluate();
	}
}
