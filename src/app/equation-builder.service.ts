import { Injectable } from '@angular/core';
import { EquationNode } from './equation-node';
import { NumberNode } from './number-node';
import { OperatorNode } from './operator-node';
import { AdditionNode } from './addition-node';
import { SubtractionNode } from './subtraction-node';
import { MultiplicationNode } from './multiplication-node';
import { DivisionNode } from './division-node';
import { GroupNode } from './group-node';
import { ArithmeticOperator } from './arithmetic-operator.enum';
import { BigNumber } from 'bignumber.js';

@Injectable()
export class EquationBuilderService {

	constructor() { }

	private _root: EquationNode = undefined;
	private _groups: GroupNode[] = [];

	public get canAddNumber(): boolean {
		return this.hasEmptyChildren;
	}

	public get canCloseGroup(): boolean {
		return this._groups.length > 0
			&& this.getNodesWithEmptyChildren(this._groups[this._groups.length - 1]).length === 0;
	}

	public get canEvaluate(): boolean {
		return this._root && this._root.canEvaluate;
	}

	public get hasOpenGroup(): boolean {
		return this._groups.length > 0;
	}

	private get hasEmptyChildren(): boolean {
		return !this._root
			|| this.getNodesWithEmptyChildren(this._root).length > 0;
	}

	public addOperator(operator: ArithmeticOperator): void {
		let node = this.getOperatorNode(operator);
		this.insertNode(node);
	}

	public clear(): void {
		this._root = undefined;
		this._groups = [];
	}

	public closeGroup(): void {
		if (this._groups.length > 0 && this._groups[this._groups.length - 1].canClose) {
			this._groups.pop().isClosed = true;
		}
	}

	public evaluate(): BigNumber {
		return this._root.evaluate();
	}

	public getInfixEquation(): string {
		return this._root
			? this._root.getInfixString()
			: '';
	}

	public startGroup(): void {
		if (this.hasEmptyChildren) {
			let node = new GroupNode()
			this.insertNode(node);
			this._groups.push(node);
		}
	}

	public tryAddNumber(number: BigNumber): boolean {
		if (this.canAddNumber) {
			let node = new NumberNode(number);
			this.insertNode(node);
			return true;
		}

		return false;
	}

	private getNodesWithEmptyChildren(root: EquationNode): EquationNode[] {
		let nodes: EquationNode[] = [];
		if (root.numChildren !== root.maxChildren) {
			nodes.push(root);
		}

		root
			.children
			.forEach(child => nodes = nodes.concat(this.getNodesWithEmptyChildren(child)));

		return nodes;
	}

	private getOperatorNode(operator: ArithmeticOperator): OperatorNode {
		switch (operator) {
			case ArithmeticOperator.Addition:
				return new AdditionNode();
			case ArithmeticOperator.Subtraction:
				return new SubtractionNode();
			case ArithmeticOperator.Multiplication:
				return new MultiplicationNode();
			case ArithmeticOperator.Division:
				return new DivisionNode();
			default:
				return undefined;
		}
	}

	private insert(node: EquationNode, currentNode: EquationNode): EquationNode {
		if (currentNode.children.length !== currentNode.maxChildren) {
			currentNode.children.push(node);
			node.parent = currentNode;
			return node;
		} else if (node.precedence <= currentNode.precedence) {
			if (this._root !== currentNode) {
				let parentIndex = currentNode
					.parent
					.children
					.findIndex(child => child === currentNode);

				currentNode
					.parent
					.children[parentIndex] = node;
				node.parent = currentNode.parent;
			} else {
				this._root = node;
			}
			node.children.push(currentNode)
			currentNode.parent = node;

			return node;
		}

		return this.insert(node, currentNode.children[currentNode.children.length - 1]);
	}

	private insertNode(node: EquationNode): EquationNode {
		if (!this._root) {
			this._root = node;
		} else if (this._groups.length > 0) {
			let group: GroupNode = this._groups[this._groups.length - 1];
			if (group.numChildren > 0) {
				this.insert(node, group.children[0]);
			} else {
				group.children.push(node);
				node.parent = group;
			}
		} else {
			this.insert(node, this._root);
		}

		return node;
	}
}
