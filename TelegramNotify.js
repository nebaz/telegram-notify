const fetch = require('node-fetch');

class TelegramNotify {

  constructor(telegramToken, telegramAdminChatId) {
    this.telegramToken = telegramToken;
    this.telegramAdminChatId = telegramAdminChatId;
  }

  async sendTelegram(message) {
    let url = 'https://api.telegram.org/bot' + this.telegramToken + '/sendmessage?chat_id=' + this.telegramAdminChatId + '&disable_web_page_preview=1&disable_notification=true&text=' + encodeURIComponent(message);
    let response = await fetch(url);
    response = await response.json();
    if (!response) {
      console.error('telegram response is null');
    }
    if (response.error) {
      console.error('telegram response is ' + response.error);
    }
  }

}

module.exports = TelegramNotify;
