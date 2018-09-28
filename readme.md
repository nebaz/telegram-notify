# telegram-notify
this package for sending telegram messages

## Usage
    const Telegram = require('telegram-notify');
    let notify = new Telegram({token:'tokenString', chaiId:'id'}});
    notify.sendTelegram('hello');

    
## Installation
To use the library, install it through [npm](https://npmjs.com)
```shell
npm install --save telegram-notify
```

## config
* `token`  - your telegram bot token
* `chatId` - telegram chat id for notify
* `proxy` - telegram proxy string [optional], e.q. http://login:password@ip:port

## API
* `send` send a telegram message