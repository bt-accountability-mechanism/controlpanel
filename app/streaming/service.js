/**
 * Created by christoph on 17.03.16.
 */

var Janus = require('./janus');

var server = null;
if (window.location.protocol === 'http:')
    server = "http://" + window.location.hostname + ":8088/janus";
else
    server = "https://" + window.location.hostname + ":8089/janus";

var janus = null;
var streaming = null;
var spinner = null;

var selectedStream = null;

export function init(streamParam, serverParam) {
    server = serverParam;
    selectedStream = streamParam;
    console.log("Try to connect to server: "+server);
    console.log("start janus");

    // Initialize the library (all console debuggers enabled)
    Janus.init({
        debug: "all", callback: function () {
            console.log("Start session");
            // Create session
            janus = new Janus({
                server: server,
                success: function () {
                    console.log("Connection succeeded");
                    // Attach to streaming plugin
                    janus.attach(
                        {
                            plugin: "janus.plugin.streaming",
                            success: function (pluginHandle) {
                                streaming = pluginHandle;
                                console.log("Connection succeeded");
                                Janus.log("Plugin attached! (" + streaming.getPlugin() + ", id=" + streaming.getId() + ")");
                                updateStreamsList();
                                startStream();
                            },
                            error: function (error) {
                                Janus.error("  -- Error attaching plugin... ", error);
                                alert("Error attaching plugin... " + error);
                            },
                            onmessage: function (msg, jsep) {
                                Janus.debug(" ::: Got a message :::");
                                Janus.debug(JSON.stringify(msg));
                                var result = msg["result"];
                                if (result !== null && result !== undefined) {
                                    if (result["status"] !== undefined && result["status"] !== null) {
                                        var status = result["status"];
                                         if(status === 'starting')
                                         // show message that is starting!
                                         // else if(status === 'started')
                                            console.log("Stream is "+status);
                                        else
                                        if (status === 'stopped')
                                            stopStream();
                                    }
                                } else if (msg["error"] !== undefined && msg["error"] !== null) {
                                    alert(msg["error"]);
                                    stopStream();
                                    return;
                                }
                                if (jsep !== undefined && jsep !== null) {
                                    Janus.debug("Handling SDP as well...");
                                    Janus.debug(jsep);
                                    // Answer
                                    streaming.createAnswer(
                                        {
                                            jsep: jsep,
                                            media: {audioSend: false, videoSend: false},	// We want recvonly audio/video
                                            success: function (jsep) {
                                                Janus.debug("Got SDP!");
                                                Janus.debug(jsep);
                                                var body = {"request": "start"};
                                                streaming.send({"message": body, "jsep": jsep});
                                            },
                                            error: function (error) {
                                                Janus.error("WebRTC error:", error);
                                                alert("WebRTC error... " + JSON.stringify(error));
                                            }
                                        });
                                }
                            },
                            onremotestream: function (stream) {
                                Janus.debug(" ::: Got a remote stream2 :::");
                                Janus.debug(JSON.stringify(stream));

                                console.log("Before ID finding!");
                                var remoteVideo = document.getElementById('remotevideo');
                                console.log("Start playing!");
                                // Show the stream and hide the spinner when we get a playing event
                                remoteVideo.addEventListener("playing", function () {
                                    remoteVideo.className = remoteVideo.className.replace('hide', '');
                                    if (spinner !== null && spinner !== undefined)
                                        spinner.stop();
                                    spinner = null;
                                });
                                attachMediaStream(remoteVideo, stream);
                            },
                            oncleanup: function () {
                                Janus.log(" ::: Got a cleanup notification :::");
                            }
                        });
                },
                error: function (error) {
                    Janus.error(error);
                    alert(error, function () {
                        window.location.reload();
                    });
                },
                destroyed: function () {
                    window.location.reload();
                }
            });
        }
    });
}

export function updateStreamsList() {
    var body = {"request": "list"};
    Janus.debug("Sending message (" + JSON.stringify(body) + ")");
    streaming.send({
        "message": body, success: function (result) {
            if (result === null || result === undefined) {
                alert("Got no response to our query for available streams");
                return;
            }
            if (result["list"] !== undefined && result["list"] !== null) {
                var list = result["list"];
                Janus.log("Got a list of available streams");
                Janus.debug(list);
                for (var mp in list) {
                    Janus.debug("  >> [" + list[mp]["id"] + "] " + list[mp]["description"] + " (" + list[mp]["type"] + ")");
                }
            }
        }
    });
}

export function startStream() {
    Janus.log("Selected video id #" + selectedStream);
    if (selectedStream === undefined || selectedStream === null) {
        alert("Select a stream from the list");
        return;
    }
    var body = {"request": "watch", id: parseInt(selectedStream)};
    streaming.send({"message": body});
    if (spinner == null) {
        var target = document.getElementById('stream');
        spinner = new Spinner({top: 100}).spin(target);
    } else {
        spinner.spin();
    }
}

export function stopStream() {
    if (streaming !== null) {
        var body = {"request": "stop"};
        streaming.send({"message": body});
        streaming.hangup();
    }
}
