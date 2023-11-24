import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'eng-keyboard',
	templateUrl: './eng-keyboard.component.html',
	styleUrls: ['./eng-keyboard.component.scss']
})
export class EngKeyboardComponent implements OnInit {

	@Output() onKeyPress = new EventEmitter();

	constructor() { }

	ngOnInit() {
	}

	enterKeyword(val) {
		this.onKeyPress.emit(val);
	}

}
