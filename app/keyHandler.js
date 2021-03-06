var exec = require('child_process').exec,
config = require('./config.js'),
lastTime = {},
windowID = 'unfilled',
throttledCommands = config.throttledCommands,
regexThrottle = new RegExp('^(' + throttledCommands.join('|') + ')$', 'i'),
regexFilter = new RegExp('^(' + config.filteredCommands.join('|') + ')$', 'i');

for (var i = 0; i < throttledCommands.length; i++) {
    lastTime[throttledCommands[i]] = new Date().getTime();
}

function setWindowID(){
    if(config.os === 'other' & windowID === 'unfilled') {
        exec('xdotool search --onlyvisible --name ' + config.programName, function (error, stdout) {
            windowID = stdout.trim();
            // console.log(key, windowID);
        });
    }
}

function sendKey(command) {
    //if doesn't match the filtered words
    if (!command.match(regexFilter)) {
        var allowKey = true,
        key = config.keymap[command];
        //throttle certain commands (not individually though)
        if (key.match(regexThrottle)) {
            var newTime = new Date().getTime();
            if (newTime - lastTime[key] < config.timeToWait) {
                allowKey = false;
            } else {
                lastTime = newTime;
            }
        }
        if (allowKey) {
            //if xdotool is installed
            if (config.os === 'other') {
                //Send to preset window under non-windows systems
                exec('xdotool key --window ' + windowID + ' --delay ' + config.delay + ' ' + key);
            } else {
                //use python on windows
                exec('key.py ' + key);
            }
        }
    }
}

//Only actually does something when not running under windows.
setWindowID();

exports.sendKey = sendKey;
