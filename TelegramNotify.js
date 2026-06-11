const {ProxyAgent} = require('undici');
const {sleep} = require('usleep');
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

  async send(message, fetchOptions = {}, apiOptions = {}) {
    apiOptions.text = message;
    let url = 'https://api.telegram.org/bot' + this.token + '/sendMessage?chat_id=' + this.chatId + '&';
    return this.#prepareAndSend(url, fetchOptions, apiOptions);
  }

  async sendDocument(blobObject, fileName, message = '', fetchOptions = {}, apiOptions = {}) {
    let url = 'https://api.telegram.org/bot' + this.token + '/sendDocument?';
    let form = new FormData();
    form.append('chat_id', this.chatId);
    form.append('caption', message);
    form.append('document', blobObject, fileName);
    fetchOptions.method = 'POST';
    fetchOptions.body = form;
    return this.#prepareAndSend(url, fetchOptions, apiOptions);
  }

  async #prepareAndSend(url, fetchOptions, apiOptions) {
    fetchOptions.dispatcher ??= this.dispatcher;
    apiOptions.disable_web_page_preview ??= 1;
    apiOptions.parse_mode ??= 'html';
    url += new URLSearchParams(apiOptions).toString();
    return this.#apiRequest(url, fetchOptions);
  }

  async #apiRequest(url, fetchOptions) {
    for (let attempt = 1; attempt <= this.maxErrors; attempt++) {
      try {
        const result = await (await fetch(url, {signal: AbortSignal.timeout(this.timeout), ...fetchOptions})).json();
        if (!result.ok) {
          throw new Error(result.description);
        }
        return result;
      } catch (e) {
        console.error(new Date().toLocaleString(), 'attempt ' + attempt, e.message);
        await sleep(5);
      }
    }
    return {ok: false, errorMessage: 'Maximum number of failed attempts'};
  }
}

module.exports = TelegramNotify;
