# telegram-notify
Simple Telegram notification service for Node.js with retry and proxy support.

Send messages and documents.

## Usage
    const Telegram = require('telegram-notify');
    let telegram = new Telegram({token:'tokenString', chatId:'id'});
    
    await telegram.send('alert');
    
    const fileBuffer = fs.readFileSync('file.txt');
    const file = new Blob([fileBuffer], {type: 'text/plain'});
    await telegram.sendDocument(file, 'file.txt', 'text of message');

    
## Installation
To use the library, install it through [npm](https://npmjs.com)
```shell
npm install --save telegram-notify
```

## config
* `token`  - your telegram bot token, create bot: https://t.me/BotFather
* `chatId` - telegram chat id to recive the notify, get the id: https://t.me/Getmyid_Work_Bot
* `proxy` [optional] - telegram proxy string, e.q. http://login:password@ip:port
* `maxErrors` [optional] - maximum number of attempts to send a Telegram message (default:5)
* `timeout` [optional] - maximum time to wait for a response from Telegram in milliseconds (default:3000)

## API
* `send` - send a telegram message
* `sendDocument` - send a file via telegram
* `answerInlineQuery` - sets the result of an inline query
