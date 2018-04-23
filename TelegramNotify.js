const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');

class TelegramNotify {

  constructor(config) {
    this.token = config.token;
    this.adminChatId = config.adminChatId;
    this.proxy = config.proxy;
  }

  async sendTelegram(message) {
    let url = 'https://api.telegram.org/bot' + this.token + '/sendmessage?chat_id=' + this.adminChatId + '&disable_web_page_preview=1&disable_notification=true&text=' + encodeURIComponent(message);
    let fetchOptions = {};
    if (this.proxy) {
      fetchOptions.agent = new HttpsProxyAgent(this.proxy);
    }
    let response = await fetch(url, fetchOptions);
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
