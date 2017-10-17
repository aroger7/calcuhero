import { OperatorNode } from './operator-node';

export class AdditionNode extends OperatorNode {
	
	public operatorString = '\u002B';
	public precedence = 1;

	public evaluate(): number {
		return this.children[0].evaluate() + this.children[1].evaluate();
	}
}
