/**
 * Created by christoph on 26.02.16.
 */

import {Component, Input} from '@angular/core';
import {LogStorage} from './storage';
import {DatePipe} from './datePipe';

@Component({
    selector: 'log-view',
    pipes : [DatePipe],
    templateUrl: 'build/log/log_view.html'
})
export class LogView {

    storage : LogStorage;

    constructor(logStorage : LogStorage) {
        this.storage = logStorage;
    }
}
