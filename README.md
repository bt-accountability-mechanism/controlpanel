# Remote Control Application for iRobot

## External Dependencies

 - Command server: https://github.com/bt-accountability-mechanism/command-server
 - Streaming server: https://github.com/bt-accountability-mechanism/streaming-server

## Deploy on existing web server

```bash
# replace destination path
cp -R www/* DEST_PATH
```

## Develop and deploy local

This application is optimized for Node.JS version 4.4.x. Therefore it is recommended to use this version. 
Installation on Mac, see https://changelog.com/install-node-js-with-homebrew-on-os-x/. 

The other dependencies can be installed directly from npm: 
```bash
$ # install dependencies
$ sudo npm install -g ionic@2.0.0-beta.35
$ sudo npm install -g cordova@5.0.0
$ # clone repo
$ git clone https://github.com/bt-accountability-mechanism/controlpanel
$ cd controlpanel
$ ionic serve
```

After that the app should be initialized on [http://localhost:8100](http://localhost:8100). 

## Customize

### Add/Modify robots

Simply change the method fetchRobots() of src/app/robot-list/service.ts
