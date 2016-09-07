/**
 * Created by christoph on 07.03.16.
 */

import {Inject, Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {

    base_url : String;

    http : Http;

    constructor(http : Http) {
        this.http = http;
    }

    reset() {
        return this._get('reset');
    }

    changeMod(newMode : string) {
        let action = null;
        if (newMode === "passive") {
            action = "passive_mode";
        } else if (newMode === 'active') {
            action = 'active_mode';
        } else if (newMode === 'docking') {
            action = 'dock_mode';
        } else if (newMode === 'safe') {
            action = 'safe_mode';
        } else if (newMode === 'cleaning') {
            action = 'cleaning_mode';
        } else {
            throw new Error('Invalid mode, must be (cleaning|safe|docking|active|passive)');
        }
        return this._get(action);
    }

    goLeft(finished : boolean) {
        return this._get('left', finished);
    }

    goRight(finished : boolean) {
        return this._get('right', finished);
    }

    goStraightOn(finished : boolean) {
        return this._get('straight_on', finished);
    }

    turnAround(finished : boolean) {
        return this._get('turn_around', finished);
    }

    toot() {
        console.log("TOOT!");
        return this._get('toot');
    }

    private _get(action : string, finished? : boolean) {
        if (typeof finished === 'undefined') {
            finished = false;
        }
        if (typeof this.base_url !== 'string') {
            throw new Error('Base URL is not set in ApiService! ');
        }

        console.log(`Send request to: ${this.base_url}/index.php?action=${action}&finished=${finished}`)
        return this.http.get(`${this.base_url}/index.php?action=${action}&finished=${finished}`, {
            headers : ApiService._getHeaders()
        }).map(res => res.text());
    }

    private static _getHeaders() {
        var headers = new Headers();

        return headers;
    }

}
