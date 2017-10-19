import { OperatorNode } from './operator-node';
import { BigNumber } from 'bignumber.js';

export class DivisionNode extends OperatorNode {
	public operatorString = '\u00F7';
	public precedence = 2;

	public evaluate(): BigNumber {
		let val: BigNumber = this.children[0].evaluate().div(this.children[1].evaluate());
		if (!val.isFinite()) {
			throw new Error("Calculated value is infinity");
		}

		return val;
	}
}
