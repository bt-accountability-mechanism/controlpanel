/**
 * Created by christoph on 26.02.16.
 */

export class Log {

    message : String;
    date : Date;

    constructor(message : String, date : Date) {
        this.message = message;
        this.date = date;
    }

    toString() {
        return `${this.date} ${this.message}`;
    }

}