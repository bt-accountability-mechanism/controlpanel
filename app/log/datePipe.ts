/**
 * Created by christoph on 26.02.16.
 */

import {Pipe} from '@angular/core';

@Pipe({
    name: 'date'
})
export class DatePipe {
    transform(value, args) {
        if (!(value instanceof Date))
            value = new Date(value);

        let format = args[0];
        if (!format) {
            format = 'dd.mm.YYYY';
        }

        format = format.replace(/YYYY/g, value.getFullYear());
        format = format.replace(/mm/g, this._zeroBasedValue(value.getMonth()+1));
        format = format.replace(/dd/g, this._zeroBasedValue(value.getDate()));
        format = format.replace(/d/g, value.getDate());
        format = format.replace(/m/g, value.getMonth()+1);
        format = format.replace(/H/g, this._zeroBasedValue(value.getHours()));
        format = format.replace(/i/g, this._zeroBasedValue(value.getMinutes()));
        format = format.replace(/s/g, this._zeroBasedValue(value.getSeconds()));
        return format;
    }

    private _zeroBasedValue(value : number) {
        if (value < 10)
            return `0${value}`;
        else
            return `${value}`;
    }
}
