/**
 * Created by christoph on 26.02.16.
 */

import {Inject, Injectable} from '@angular/core';

import {Log} from './log';

const LOGS_STORAGE_KEY = 'LOGS';

@Injectable()
export class LogStorage {

    static EVENT_KEY = 'LOG_CHANGE';
    static LOG_ENTITY = Log;

    logs : Array<Log>;

    constructor() {
        this._load();
    }

    private _load() {
        let logs = localStorage.getItem(LOGS_STORAGE_KEY);
        if (logs !== null) {
            this.logs = JSON.parse(logs);
        } else {
            this.logs = [];
        }
        this.logs.reverse();
    }

    add(message) {
      return console.log(message);
      /*  this.logs.reverse();
        this.logs.push(
            new Log(message, new Date())
        );
        localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(this.logs));
        this.logs.reverse();*/
    }

    clearLogs() {
        this.logs = [];
        localStorage.removeItem(LOGS_STORAGE_KEY);
    }

}
