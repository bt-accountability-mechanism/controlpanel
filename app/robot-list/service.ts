/**
 * Created by christoph on 10.03.16.
 */

export class Robot {
  private _id:number;
  private _name:string;
  private _url:string;
  private _cameraUrl:string;

  constructor(id:number, name:string, url:string, cameraUrl:string) {
    this._id = id;
    this._name = name;
    this._url = url;
    this._cameraUrl = cameraUrl;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get url() {
    return this._url;
  }

  get cameraUrl() {
    return this._cameraUrl;
  }
}

export class RobotListService {

  fetchRobots() {
    return [
      new Robot(2, 'Valiton iRobot', 'http://192.168.8.1/robot_web', 'http://192.168.8.1:8081'),
      new Robot(1, 'Real iRobot Uni', 'http://192.168.8.1', 'http://192.168.8.1:8081'),
      new Robot(3, 'Station 3 Robot', 'http://192.168.56.101/api', 'http://192.168.56.101:8088/janus')
    ]
  }

}
