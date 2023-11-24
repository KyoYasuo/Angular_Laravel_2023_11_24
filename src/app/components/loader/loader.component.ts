import { Component, Input, OnDestroy } from '@angular/core';

@Component({
	selector: 'app-loader',
	templateUrl: './loader.component.html',
	styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnDestroy {

		/**
     * Current Timeout
     */
    public currentTimeout = null;

    /**
     * Is Delayed Running
     */
	isDelayedRunning: boolean = false;

  	 /**
     * Delay
     */
    @Input() delay: number = 10;

    /**
     * Start Spinner
     */
    @Input()
    set isRunning(value: boolean) {
        if (!value) {
            this.cancelTimeout();
            this.isDelayedRunning = false;
            return;
        }

        if (this.currentTimeout) return;

        this.currentTimeout = setTimeout(() => {
            this.isDelayedRunning = value;
            this.cancelTimeout();
        }, this.delay);
    }

    /**
     * Clear Timeout
     */
    public cancelTimeout(): void {
        clearTimeout(this.currentTimeout);
        this.currentTimeout = undefined;
    }

    /**
     * On Destroy
     */
    ngOnDestroy(): any {
        this.cancelTimeout();
    }

}
