import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TranslationController extends Controller {
  @service api;
  @service translation;

  @tracked view = 'idle'; // busy, done, error
  @tracked suggestions;

  get record() {
    return this.model.translation;
  }

  get english() {
    return this.record.english;
  }

  get native() {
    return this.record.native || '';
  }

  get languageCode() {
    return this.record.language;
  }

  get languageRecord() {
    return this.translation.languages.findBy('locale', this.languageCode);
  }

  get language() {
    return this.languageRecord.nameEnglish;
  }

  get sortedEvents() {
    return this.record.events.sortBy('createdAt');
  }

  @action
  translate() {
    this.view = 'busy';

    const phrase = this.model.translation.english;
    const sourceLang = 'EN';
    const targetLang = this.model.translation.language.toUpperCase();

    fetch(`${this.api.url}/translate`, {
      method: 'POST',
      headers: this.api.headers,
      body: JSON.stringify({ phrase, sourceLang, targetLang })
    })
      .then((response) => response.json())
      .then((data) => {
        console.debug(data);
        if (data.success) {
          console.debug('success');
          this.suggestions = data.translations;
          this.view = 'done';
        } else {
          console.error('fail');
          console.error(data);
          this.view = 'error';
        }
      })
      .catch((response) => {
        console.error('catch');
        console.error(response);
        this.view = 'error';
      });
  }

  @action
  use(suggestion) {
    this.model.translation.native = suggestion;
    this.model.translation.save();
    this.suggestions = null;
    this.view = 'idle';
  }

  get showIdle() {
    return this.view === 'idle';
  }

  get showBusy() {
    return this.view === 'busy';
  }

  get showDone() {
    return this.view === 'done';
  }

  get showError() {
    return this.view === 'error';
  }
}
