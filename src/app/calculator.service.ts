import { Injectable } from '@angular/core';
import { ArithmeticOperator } from './arithmetic-operator.enum';
import { EquationBuilderService } from './equation-builder.service';
import { NumberService } from './number.service';

@Injectable()
export class CalculatorService {
	constructor(private _equationBuilderService: EquationBuilderService,
		private _numberService: NumberService) { }

	private _isNumberNegative: boolean = false;
	private _isNumberResult: boolean = false;
	private _numberAbsoluteValue: string = '0';

	public get canAddDecimal(): boolean {
		return this.number.indexOf('.') < 0 || this.isNumberResult;
	}

	public get canNegate(): boolean {
		return this.number && this.number !== '0' && !this.isNumberResult;
	}

	public get equation(): string {
		return this._equationBuilderService.getInfixEquation();
	}

	public get isNumberNegative(): boolean {
		return this._isNumberNegative;
	}

	public set isNumberNegative(value: boolean) {
		if (this.canNegate && value !== this._isNumberNegative) {
			this._isNumberNegative = value;
			this._numberService.send(this.number);
		}
	}

	public get isNumberResult(): boolean {
		return this._isNumberResult;
	}

	public set isNumberResult(value: boolean) {
		this._isNumberResult = value;
	}

	public get number(): string {
		return this.isNumberNegative && !this.isNumberResult
			? '-' + this.numberAbsoluteValue
			: this.numberAbsoluteValue;
	}

	public get numberAbsoluteValue(): string {
		return this._numberAbsoluteValue;
	}

	public set numberAbsoluteValue(value: string) {
		this._numberAbsoluteValue = value;
		this._numberService.send(this.number);
	}

	public addDigit(digit: number): void {
		if (this.isDigit(digit)) {
			if (this.number === '0' || this.isNumberResult) {
				this.clearNumber();
				this.numberAbsoluteValue = '';
			}
			this.numberAbsoluteValue += digit;
		}
	}

	public addDecimal(): void {
		if (this.canAddDecimal) {
			if (this.isNumberResult) {
				this.clearNumber();
			}
			this.numberAbsoluteValue += '.';
		}
	}

	public addOperator(operator: ArithmeticOperator) {
		let number: number = Number.parseFloat(this.number);
		if (!isNaN(number)) {
			this._equationBuilderService.tryAddNumber(number);
			this._equationBuilderService.addOperator(operator);
			this.clearNumber();
		}
	}

	public backspace(): void {
		if (this.isNumberResult || this.numberAbsoluteValue.length <= 1) {
			this.clearNumber();
		} else {
			this.numberAbsoluteValue = this.numberAbsoluteValue.substring(0, this.numberAbsoluteValue.length - 1);
			if (this.numberAbsoluteValue === '0') {
				this.isNumberNegative = false;
			}
		}
	}

	public clear(): void {
		this.clearNumber();
		this.clearEquation();
	}

	public clearEquation(): void {
		this._equationBuilderService.clear();
	}

	public clearNumber(): void {
		this.numberAbsoluteValue = '0';
		this.isNumberNegative = false;
		this.isNumberResult = false;
	}

	public closeGroup(): void {
		if (this._equationBuilderService.canAddNumber) {
			this._equationBuilderService.tryAddNumber(Number.parseFloat(this.number));
		}
		
		if (this._equationBuilderService.canCloseGroup) {
			this._equationBuilderService.closeGroup();
			this.clearNumber();
		}
	}

	public evaluate(): void {
		if (!this._equationBuilderService.canEvaluate) {
			this._equationBuilderService.tryAddNumber(Number.parseFloat(this.number));
		}

		try {
			let result = this._equationBuilderService.evaluate();
			this.numberAbsoluteValue = Math.abs(result).toString();
			this.isNumberNegative = result < 0;
		} catch (e) {
			this.numberAbsoluteValue = "ERROR";
		} finally {
			this.isNumberResult = true;
			this.clearEquation();
		}
	}

	public startGroup(): void {
		this._equationBuilderService.startGroup();
	}

	private isDigit(number: number) {
		return Number.isInteger(number) && number >= 0 && number <= 9;
	}


}
