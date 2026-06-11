const {ProxyAgent} = require('undici');
const {sleep} = require('usleep');
const API_URL = 'https://api.telegram.org/bot';
const MAX_ERRORS = 5;
const TIMEOUT = 3000;

class TelegramNotify {

  constructor(config) {
    this.token = config.token;
    this.chatId = config.chatId;
    this.proxy = config.proxy;
    this.maxErrors = config.maxErrors || MAX_ERRORS;
    this.timeout = config.timeout || TIMEOUT;
    this.dispatcher = this.proxy ? new ProxyAgent(this.proxy) : undefined;
  }

  async send(message, apiOptions = {}, fetchOptions = {}) {
    return this.sendMessage(message, apiOptions, fetchOptions);
  }

  async sendMessage(message, apiOptions = {}, fetchOptions = {}) {
    apiOptions.text = message;
    let url = API_URL + this.token + '/sendMessage?chat_id=' + this.chatId + '&';
    return this.#prepareAndSend(url, apiOptions, fetchOptions);
  }

  async answerInlineQuery(message, apiOptions = {}, fetchOptions = {}) {
    apiOptions.text = message;
    let url = API_URL + this.token + '/answerInlineQuery?chat_id=' + this.chatId + '&';
    return this.#prepareAndSend(url, apiOptions, fetchOptions);
  }

  async sendDocument(blobObject, fileName, message = '', apiOptions = {}, fetchOptions = {}) {
    let url = API_URL + this.token + '/sendDocument?';
    let form = new FormData();
    form.append('chat_id', this.chatId);
    form.append('caption', message);
    form.append('document', blobObject, fileName);
    fetchOptions.method = 'POST';
    fetchOptions.body = form;
    return this.#prepareAndSend(url, apiOptions, fetchOptions);
  }

  async #prepareAndSend(url, apiOptions, fetchOptions) {
    fetchOptions.dispatcher ??= this.dispatcher;
    apiOptions.disable_web_page_preview ??= 1;
    apiOptions.parse_mode ??= 'html';
    url += new URLSearchParams(apiOptions).toString();
    return this.#apiRequest(url, fetchOptions);
  }

  async #apiRequest(url, fetchOptions) {
    for (let attempt = 1; attempt <= this.maxErrors; attempt++) {
      try {
        return await (await fetch(url, {signal: AbortSignal.timeout(this.timeout), ...fetchOptions})).json();
      } catch (e) {
        console.error(new Date().toLocaleString(), 'attempt ' + attempt, e.message);
        await sleep(5);
      }
    }
    return {ok: false, errorMessage: 'Maximum number of failed attempts'};
  }
}

module.exports = TelegramNotify;
