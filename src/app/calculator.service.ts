import { Injectable } from '@angular/core';
import { ArithmeticOperator } from './arithmetic-operator.enum';
import { EquationBuilderService } from './equation-builder.service';
import { NumberService } from './number.service';
import { BigNumber } from 'bignumber.js';

@Injectable()
export class CalculatorService {
	constructor(private _equationBuilderService: EquationBuilderService,
		private _numberService: NumberService) { }

	private readonly MAX_RESULT_DIGITS = 30;
	private readonly MIN_DP_ON_ROUNDING = 10;

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
		let number: BigNumber = new BigNumber(this.number);
		if (!number.isNaN()) {
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
		if (this._equationBuilderService.hasOpenGroup) {
			if (this._equationBuilderService.canAddNumber) {
				this._equationBuilderService.tryAddNumber(new BigNumber(this.number));
			}

			if (this._equationBuilderService.canCloseGroup) {
				this._equationBuilderService.closeGroup();
				this.clearNumber();
			}
		}
	}

	public evaluate(): void {
		if (!this._equationBuilderService.canEvaluate) {
			this._equationBuilderService.tryAddNumber(new BigNumber(this.number));
		}

		try {
			let result: BigNumber = this._equationBuilderService.evaluate();

			result = this.tryTrimResultDecimals(result);
			let digits = this.countBigNumberDigits(result);

			if(digits > this.MAX_RESULT_DIGITS) {
				this.numberAbsoluteValue = result.abs().toExponential();
			} else {
				this.numberAbsoluteValue = result.abs().toString();
			}

			this.isNumberNegative = result.lessThan(0);
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

	private countBigNumberDigits(result: BigNumber): number {
		let digits: number = result.decimalPlaces();
		if (result.e >= 0) {
			digits += result.e + 1;
		} else {
			digits += 1;
		}

		return digits;
	}

	private isDigit(number: number) {
		return Number.isInteger(number) && number >= 0 && number <= 9;
	}

	private tryTrimResultDecimals(result: BigNumber): BigNumber {
		let digits = this.countBigNumberDigits(result);
		let overflow: number = digits - this.MAX_RESULT_DIGITS;
		let maxRemovableDps: number = result.decimalPlaces() - this.MIN_DP_ON_ROUNDING;
		if (maxRemovableDps > 0) {
			let removableDps = Math.min(maxRemovableDps, overflow);
			return result.round(result.decimalPlaces() - removableDps);
		}

		return result;
	}
}
