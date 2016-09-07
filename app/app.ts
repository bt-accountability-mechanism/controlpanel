import {ApiService} from "./log/apiService";
'use strict';

import {App, Alert, Platform, NavController, MenuController, ionicBootstrap} from 'ionic-angular';
import {Component} from '@angular/core';
//import {DashboardPage} from './pages/dashboard/dashboard';
import {Login} from './auth/login';
import {Dashboard} from "./dashboard/dashboard";
import {Robot} from "./robot-list/service";

const LOGIN_TITLE = 'Select your robot';

@Component({
  templateUrl: 'build/app.html',
  directives: [Dashboard, Login],
  providers: [ApiService]
})
class RootPage {

  menuActions:Object = [];
  robot:Robot;
  mode:string;
  title:string;

  modeTitles:Object = {
    active: 'full control',
    cleaning: 'cleaning',
    safe: 'safe',
    passive: 'passive',
    docking: 'docking',
  };

  constructor(private app:App, private api:ApiService, public menu: MenuController, private nav: NavController) {
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.robot = null;
    this.title = LOGIN_TITLE;
  }

  handleLogout() {
    this.robot = null;
    this.title = LOGIN_TITLE;

    this.handleMenuAction('CHANGE_MODE', 'passive');
  }

  handleMenuAction(action, ...params) {
    switch (action) {
      case 'CHANGE_MODE':
        this.mode = params[0];
        this.api.changeMod(this.mode).subscribe((result) => {
            console.log('Finished');
          },
          err => {
            console.error(err);
          });
        break;
      case 'RESET':
        this.handleDoReset();
        break;
      case 'TOOT':
        this.handleToot();
        break;
    }
  }

  handleToot() {
    this.api.toot().subscribe((result) => {
      },
      err => {
      });
  }

  handleDoReset() {
    this.api.reset().subscribe((result) => {
        console.log('Finished');
      },
      err => {
        console.error(err);
      });
  }

  handleLogin(robot:Robot) {
    if (robot !== null) {
      this.robot = robot;
      this.title = `${robot.name}`;
      this.api.base_url = robot.url;
      this.handleMenuAction('CHANGE_MODE', 'passive');

      this.nav.present(Alert.create({
        title: 'Advice',
        subTitle: 'Your robot is in passive mode. To control the robot, please change in "full control" or "save" mode ' +
        'by opening the actions menu (button on the left/top side). ',
        buttons: ['Ok']
      }));
    } else {
      this.nav.present(Alert.create({
        title: 'Robot not found! ',
        subTitle: 'Please select a robot before continue! ',
        buttons: ['Ok']
      }));
    }
  }
}

@Component({
  template: '<ion-nav id="nav" [root]="rootPage" #content></ion-nav>'
})
class MyApp {
  rootPage:any = RootPage;

  constructor(private platform:Platform) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      // The platform is now ready. Note: if this callback fails to fire, follow
      // the Troubleshooting guide for a number of possible solutions:
      //
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //
      // First, let's hide the keyboard accessory bar (only works natively) since
      // that's a better default:
      //
      // Keyboard.setAccessoryBarVisible(false);
      //
      // For example, we might change the StatusBar color. This one below is
      // good for dark backgrounds and light text:
      // StatusBar.setStyle(StatusBar.LIGHT_CONTENT)
    });
  }
}

ionicBootstrap(MyApp, [ApiService]);
