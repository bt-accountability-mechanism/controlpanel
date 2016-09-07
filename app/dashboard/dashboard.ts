'use strict';

import {Page, Alert, NavController, NavParams, IONIC_DIRECTIVES} from 'ionic-angular';
import {Component, Input} from '@angular/core';
import {LogView} from '../log/log-view';
import {LogStorage} from '../log/storage';
import {ApiService} from '../log/apiService';

import {Robot} from '../robot-list/service';
import {Login} from '../auth/login';

// import {init as initStreaming, stopStream} from '../streaming/service.js';

let ID = 0;

let keypresses = {};

@Component({
    selector: 'dashboard',
    directives: [LogView, IONIC_DIRECTIVES],
    templateUrl: 'build/dashboard/dashboard.html',
    providers: [ApiService, LogStorage]
})
export class Dashboard {

    @Input() robot: Robot;
    @Input() mode: string;

    private _api:ApiService;
    private _logStorage : LogStorage;

    constructor(api:ApiService, logStorage : LogStorage) {
        this._api = api;
        this._logStorage = logStorage;

        // bind keyboard events
        document.body.addEventListener('keydown', this.onKeyDown.bind(this));
        document.body.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    ngOnInit() {
        console.log(this.robot);
        if (this.robot) {
            this._api.base_url = this.robot.url;

            // initStreaming("10", this.robot.cameraUrl);

            // reset mode first
            if (!this.mode) {
                // this.mode = 'passive';
            }
            // this.handleChangeMode();

            // streamingService.init(this.robot.cameraUrl);
        }
    }

    onKeyDown(event) {
        if ((this.mode === 'active' || this.mode === 'safe') && keypresses[event.keycode] === null) {
            keypresses[event.keycode] = true;
            switch (event.keyCode) {
                case 40:
                    this.handleButtonTouchStart('TURN');
                    break;
                case 39:
                    this.handleButtonTouchStart('RIGHT');
                    break;
                case 38:
                    this.handleButtonTouchStart('STRAIGHT_FORWARD');
                    break;
                case 37:
                    this.handleButtonTouchStart('LEFT');
                    break;
            }
        }
    }

    onKeyUp(event) {
        if (this.mode === 'active' || this.mode === 'safe') {
            keypresses[event.keycode] = null;
            switch (event.keyCode) {
                case 40:
                    this.handleButtonTouchEnd('TURN');
                    break;
                case 39:
                    this.handleButtonTouchEnd('RIGHT');
                    break;
                case 38:
                    this.handleButtonTouchEnd('STRAIGHT_FORWARD');
                    break;
                case 37:
                    this.handleButtonTouchEnd('LEFT');
                    break;
                case 32:
                    this.handleToot();
                    break;

            }
        }
    }

    handleButtonTouchStart(action) {
        this._handleTouchAction(action, false);
    }

    handleButtonTouchEnd(action) {
        this._handleTouchAction(action, true);
    }

    private _handleTouchAction(action, finished:boolean) {
        switch (action) {
            case 'STRAIGHT_FORWARD':
                this._handleGoStraightOn(finished);
                break;
            case 'LEFT':
                this._handleGoLeft(finished);
                break;
            case 'RIGHT':
                this._handleGoRight(finished);
                break;
            case 'TURN':
                this._handleTurnAround(finished);
                break;
            default:
                this._logStorage.add(`Invalid action "${action}"`);
        }
    }

    private _handleGoStraightOn(finished:boolean) {
        let id = ID++;
        let logActionVerb = finished ? 'stop' : 'start';
        this._logStorage.add(`ID: ${id}: Robot should ${logActionVerb} going straight forward!`);
        this._api.goStraightOn(finished).subscribe((result) => {
                this._logStorage.add(`Result of ID ${id}: ${result}`);
            },
            err => {
                this._logStorage.add(`Result of ID ${id}: ${err}`)
            });
    }

    private _handleGoLeft(finished:boolean) {
        let id = ID++;
        this._logStorage.add(`ID: ${id}: Robot should go left!`);
        this._api.goLeft(finished).subscribe((result) => {
                this._logStorage.add(`Result of ID ${id}: ${result}`);
            },
            err => {
                this._logStorage.add(`Result of ID ${id}: ${err}`)
            });
    }

    private _handleGoRight(finished:boolean) {
        let id = ID++;
        this._logStorage.add(`ID: ${id}: Robot should go right!`);
        this._api.goRight(finished).subscribe((result) => {
                this._logStorage.add(`Result of ID ${id}: ${result}`);
            },
            err => {
                this._logStorage.add(`Result of ID ${id}: ${err}`)
            });
    }

    private _handleTurnAround(finished:boolean) {
        let id = ID++;
        this._logStorage.add(`ID: ${id}: Robot should turn around!`);
        this._api.turnAround(finished).subscribe((result) => {
                this._logStorage.add(`Result of ID ${id}: ${result}`);
            },
            err => {
                this._logStorage.add(`Result of ID ${id}: ${err}`)
            });
    }

    handleToot() {
        let id = ID++;
        this._logStorage.add(`ID: ${id}: Robot should toooooooots!`);
        this._api.toot().subscribe((result) => {
                this._logStorage.add(`Result of ID ${id}: ${result}`);
            },
            err => {
                this._logStorage.add(`Result error of ID ${id}: ${err}`)
            });
    }

}
