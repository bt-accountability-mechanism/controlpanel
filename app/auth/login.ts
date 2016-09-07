/**
 * Created by christoph on 10.03.16.
 */

import {Page, Alert, NavController, IONIC_DIRECTIVES} from 'ionic-angular';
import {Component, Input} from '@angular/core';
import {LogView} from '../log/log-view';
import {LogStorage} from '../log/storage';
import {ApiService} from '../log/apiService';
import {RobotListService, Robot} from '../robot-list/service';

@Component({
    selector: 'login',
    directives : [IONIC_DIRECTIVES],
    templateUrl: 'build/auth/login.html',
    providers: [RobotListService]
})
export class Login {

    @Input('handle-submit') loginAction : Function;
    @Input() test : string;

    robot: string = "1";
    robots : Array<Robot>;

    constructor(robotService : RobotListService) {
        if (!this.loginAction) {
            //throw new Error('attribute handle-submit is missing! ');
        }
        this.robots = robotService.fetchRobots();
    }

    handleSubmit() {
        // search if robot exists
        let intRobotID = parseInt(this.robot);
        let robot = null;
        for (let i = 0; i < this.robots.length; i++) {
            // robot found?
            if (this.robots[i].id === intRobotID) {
                robot = this.robots[i];
                break;
            }
        }

        this.loginAction(robot);
        /*
        // only go to dashboard when robot exists
        if (robot !== null) {
            this._nav.setRoot(DashboardPage, {
                robot : robot
            });
        } else {
            this._nav.present(Alert.create('Robot not found'));
        }
        */
    }
}
