import { OperatorNode } from './operator-node';
import { BigNumber } from 'bignumber.js';

export class AdditionNode extends OperatorNode {
	
	public operatorString = '\u002B';
	public precedence = 1;

	public evaluate(): BigNumber {
		return this.children[0].evaluate().add(this.children[1].evaluate());
	}
}
