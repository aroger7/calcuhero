import { Component, OnInit, ViewChildren, ViewChild, QueryList, ElementRef, Renderer, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { ArithmeticOperator } from '../arithmetic-operator.enum';
import { CalculatorService } from '../calculator.service';
import { NumberService } from '../number.service';
import { HotkeysService, Hotkey, ExtendedKeyboardEvent } from 'angular2-hotkeys';
import { BigNumber } from 'bignumber.js';

@Component({
	selector: 'cho-calculator',
	templateUrl: './calculator.component.html',
	styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
	constructor(private _renderer: Renderer,
		private _calculatorService: CalculatorService,
		private _hotkeysService: HotkeysService,
		private _ref: ChangeDetectorRef,
		private _numberService: NumberService) {
	}

	public ArithmeticOperator = ArithmeticOperator;
	public number: string = '0';

	@ViewChildren('button')
	private _buttons: QueryList<ElementRef>;
	private _equationUpdated: EventEmitter<any> = new EventEmitter<any>();
	@ViewChild('numberElement')
	private _numberElement: ElementRef;
	private _resetEmitter: EventEmitter<any> = new EventEmitter<any>();

	private readonly MIN_NUMBER_FONT_SIZE = 8;

	public get currentNumberFontSize(): number {
		return Number.parseFloat(window.getComputedStyle(this._numberElement.nativeElement).fontSize);
	}

	public get equation(): string {
		return this._calculatorService.equation;
	}

	public get equationUpdated(): EventEmitter<any> {
		return this._equationUpdated;
	}

	public get isNumberFontSizeMin(): boolean {
		return this.currentNumberFontSize >= 12;
	}

	public get resetEmitter(): EventEmitter<any> {
		return this._resetEmitter;
	}

	private get isNumberOverflowing(): boolean {
		return this._numberElement.nativeElement.scrollWidth
			> Number.parseFloat(window.getComputedStyle(this._numberElement.nativeElement).width);
	}

	ngOnInit() {
		this._numberService
			.get()
			.subscribe(number => {
				this.number = number;
				this._ref.detectChanges(); //force change detection to resize correctly below
				if (this.isNumberOverflowing) {
					this.tryShrinkNumberTextToFit();
				} else {
					this.tryEnlargeNumberTextToFit();
				}
			});
	}

	ngAfterViewInit() {
		this._buttons.forEach(button => {
			if (button.nativeElement.hasAttribute('hotkey')) {
				this._hotkeysService.add(
					new Hotkey(button.nativeElement.getAttribute('hotkey'),
						(event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
							button.nativeElement.click();
							event.returnValue = false;
							return event;
						}));
			}
		});
	}

	public addDigit(digit: number): void {
		if (this.currentNumberFontSize > this.MIN_NUMBER_FONT_SIZE) {
			this._calculatorService.addDigit(digit);
		}
	}

	public addDecimal(): void {
		if (this.currentNumberFontSize > this.MIN_NUMBER_FONT_SIZE) {
			this._calculatorService.addDecimal();
		}
	}

	public addOperator(operator: ArithmeticOperator): void {
		this._calculatorService.addOperator(operator);
		this.equationUpdated.emit();
	}

	public backspace(): void {
		this._calculatorService.backspace();
	}

	public clear(): void {
		// let number: BigNumber = new BigNumber('1234567890.012345');
		let number: BigNumber = new BigNumber('0.1234567890');
		console.log('total number of digits in ' + number.toString() + ' is ' + (number.e + 1 + number.decimalPlaces()));
		console.log('number of decimal places is ' + number.decimalPlaces());
		console.log('precision says it is ' + number.precision(true));
		//debugger;
		this._calculatorService.clear();
		this.resetEmitter.emit();
	}

	public closeGroup(): void {
		this._calculatorService.closeGroup();
		this.equationUpdated.emit();
	}

	public evaluate(): void {
		this._calculatorService.evaluate();
		this.resetEmitter.emit();
	}

	public negate(): void {
		this._calculatorService.isNumberNegative = !this._calculatorService.isNumberNegative;
	}

	public startGroup(): void {
		this._calculatorService.startGroup();
		this.equationUpdated.emit();
	}

	private tryShrinkNumberTextToFit(): void {
		let numberStyle = window.getComputedStyle(this._numberElement.nativeElement);
		while (this.isNumberOverflowing && this.currentNumberFontSize > this.MIN_NUMBER_FONT_SIZE) {
			this._renderer.setElementStyle(this._numberElement.nativeElement, 'font-size', (this.currentNumberFontSize - 1).toString() + 'px');
		}
	}

	private tryEnlargeNumberTextToFit(): void {
		let numberStyle = window.getComputedStyle(this._numberElement.nativeElement);
		let initialFontSize = Number.parseFloat(numberStyle.fontSize);
		while (!this.isNumberOverflowing && this.currentNumberFontSize <= 32) {
			this._renderer.setElementStyle(this._numberElement.nativeElement, 'font-size', (this.currentNumberFontSize + 1).toString() + 'px');
		}

		if (this.currentNumberFontSize !== initialFontSize) {
			this._renderer.setElementStyle(this._numberElement.nativeElement, 'font-size', (this.currentNumberFontSize - 1).toString() + 'px');
		}
	}
}
