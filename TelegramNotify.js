const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');

class TelegramNotify {

  constructor(config) {
    this.token = config.token;
    this.chatId = config.chatId;
    this.proxy = config.proxy;
  }

  async send(message, fetchOptions = {}, disableNotification = true) {
    fetchOptions.timeout = fetchOptions.timeout || 3000;
    if (this.proxy) {
      fetchOptions.agent = new HttpsProxyAgent(this.proxy);
    }
    let url = 'https://api.telegram.org/bot' + this.token + '/sendmessage?chat_id=' + this.chatId + '&disable_web_page_preview=1&disable_notification=' + disableNotification + '&text=' + encodeURIComponent(message);

    try {
      let response = await (await fetch(url, fetchOptions)).json();
      return response;
    } catch (e) {
      console.error(new Date().toLocaleString(), e.message);
      return false;
    }
  }
}

module.exports = TelegramNotify;
