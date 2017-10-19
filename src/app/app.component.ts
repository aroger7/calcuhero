import { Component, OnInit, Host } from '@angular/core';
import { BigNumber } from 'bignumber.js';

@Component({
	selector: 'cho-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'app';

	constructor() {
	}

	ngOnInit() {
		BigNumber.config({
			ERRORS: false,
		});
		console.log(BigNumber.config());
	}
}
