var irc = require('irc'),
printf = require('printf'),
keyHandler = require('./keyHandler.js'),
config = require('./config.js');

var client = new irc.Client(config.server, config.nick, {
    channels: config.channelList,
    port: config.port,
    sasl: config.sasl,
    nick: config.nick,
    userName: config.nick,
    password: config.password,
    //This has to be false, since SSL in NOT supported by twitch IRC (anymore?)
    // see: http://help.twitch.tv/customer/portal/articles/1302780-twitch-irc
    secure: false,
    floodProtection: config.floodProtection,
    floodProtectionDelay: config.floodProtectionDelay,
    autoConnect: false,
    autoRejoin: true
});

client.addListener('message' + config.channel, function (from, message) {
    if (message.match(config.regexCommands)) {

        if (config.printToConsole) {
            //format console output if needed
            var maxName = config.maxCharName,
            maxCommand = config.maxCharCommand,
            logFrom = from.substring(0,maxName),
            logMessage = message.substring(0,6).toLowerCase();
            //format log
            console.log(printf('%-' + maxName + 's % ' + maxCommand + 's',
                logFrom,logMessage));
        }

        //send message to program
        if (config.sendKey) {
            keyHandler.sendKey(message.toLowerCase());
        }
    }
});

client.addListener('error', function(message) {
    console.log('error: ', message);
});

client.connect();
