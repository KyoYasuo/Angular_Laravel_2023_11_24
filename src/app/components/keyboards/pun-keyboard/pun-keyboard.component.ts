import { Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
	selector: 'pun-keyboard',
	templateUrl: './pun-keyboard.component.html',
	styleUrls: ['./pun-keyboard.component.scss']
})
export class PunKeyboardComponent implements OnInit {

	@Output() onKeyPress = new EventEmitter();

	constructor() { }

	ngOnInit() {
	}

	enterKeyword(val) {
		this.onKeyPress.emit(val);
	}

}
