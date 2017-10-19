import { OperatorNode } from './operator-node';
import { BigNumber } from 'bignumber.js';

export class SubtractionNode extends OperatorNode {

	public operatorString = '\u2212';
	public precedence = 1;

	public evaluate(): BigNumber {
		return this.children[0].evaluate().sub(this.children[1].evaluate());
	}
}
