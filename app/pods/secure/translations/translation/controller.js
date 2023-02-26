import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TranslationController extends Controller {
  @service api;
  @service store;
  @service router;

  @tracked loadingSuggestions = false;
  @tracked suggestions = null;
  @tracked isSaving = false;
  @tracked lastSavedNative = null;
  @tracked showError = false;

  @action
  onInsert() {
    this.lastSavedNative = this.record.native;
  }

  // When using the navigation arrows to switch between translations,
  // the input fields do not update unless we use this hack below.
  // HACK: the [contentetiable] textarea component does not update it's text when the value passed in changes...
  // below is the workaround (temporary?)
  @action
  onUpdate() {
    const source = document.querySelector('#textarea-source');
    const native = document.querySelector('#textarea-native');
    const last = document.querySelector('#textarea-last');
    if (source) {
      source.innerText = this.record.english;
    }
    if (native) {
      native.innerText = this.record.native;
    }
    if (last) {
      last.innerText = this.record.englishBefore;
    }
  }

  get record() {
    return this.model.translation;
  }

  get isToTranslate() {
    return this.record.status === 'to-translate';
  }

  get isToUpdate() {
    return this.record.status === 'to-update';
  }

  get isToReview() {
    return this.record.status === 'to-review';
  }

  get isDone() {
    return this.record.status === 'done';
  }

  get showSuggestions() {
    return this.loadingSuggestions || Array.isArray(this.suggestions);
  }

  get hasSuggestions() {
    return Array.isArray(this.suggestions) && this.suggestions.length > 0;
  }

  get hasChanges() {
    return this.lastSavedNative !== this.record.native;
  }

  @action
  onClickEdit() {
    document.querySelector('#input-native').select();
  }

  @action
  onClickSave() {
    this.record.status = this.record.native ? 'done' : 'to-translate';
    this.isSaving = true;
    this.record
      .save({
        adapterOptions: {
          whitelist: ['native', 'status']
        }
      })
      .then(() => {
        console.log('saved');
        this.lastSavedNative = this.record.native;
      })
      .catch((error) => {
        console.error('save failed', error);
        this.showError = true;
      })
      .finally(() => {
        this.isSaving = false;
        const input = document.querySelector('#input-native');
        if (input) {
          input.blur();
        }
      });
  }

  @action
  onClickUndo() {
    this.record.native = this.lastSavedNative;
    this.lastSavedNative = this.record.native;
  }

  @action
  onClickSuggest() {
    console.log('onClickSuggest');

    const sourceLang = 'EN';
    const targetLang = this.record.language.toUpperCase();
    const phrase = this.record.english;

    this.suggestions = [];
    this.showError = false;
    this.loadingSuggestions = true;

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
          console.debug(data.translations);
          this.suggestions = data.translations.map((t) => {
            return { label: t };
          });
        } else {
          console.error('fail');
          console.error(data);
          this.showError = true;
        }
      })
      .catch((response) => {
        console.error('catch');
        console.error(response);
        this.showError = true;
      })
      .finally(() => {
        this.loadingSuggestions = false;
      });
  }

  @action
  onClickSuggestion(suggestion) {
    this.suggestions = null;
    this.record.native = suggestion.label;
    // HACK: the [contentetiable] textarea component does not update it's text when the value passed in changes...
    // below is the workaround (temporary?)
    const native = document.querySelector('#textarea-native');
    if (native) {
      native.innerText = this.record.native;
    }
  }

  @action
  onClickAccept() {
    this.showError = false;
    this.record.status = 'done';
    this.record
      .save({
        adapterOptions: {
          whitelist: ['status']
        }
      })
      .then(() => {
        console.log('saved');
      })
      .catch((error) => {
        console.error('save failed', error);
        this.record.status = 'to-review';
        this.showError = true;
      });
  }

  @action
  onClickReject() {
    this.showError = false;
    this.record.native = null;
    this.record.status = 'to-translate';
    this.record
      .save({
        adapterOptions: {
          whitelist: ['native', 'status']
        }
      })
      .then(() => {
        console.log('saved');
      })
      .catch((error) => {
        console.error('save failed', error);
        this.record.status = 'to-review';
        this.showError = true;
      });
  }

  @action
  onClickRightArrow() {
    const records = this.store
      .peekAll('translation')
      .filterBy('language', this.record.language)
      .sortBy('location');
    const IDs = records.mapBy('id');
    const currentIndex = IDs.indexOf(this.record.id);
    let nextIndex = currentIndex + 1;
    if (nextIndex > IDs.length - 1) {
      nextIndex = 0;
    }
    const nextRecordID = IDs[nextIndex];

    this.router.transitionTo('secure.translations.translation', nextRecordID);
  }

  @action
  onClickLeftArrow() {
    const records = this.store
      .peekAll('translation')
      .filterBy('language', this.record.language)
      .sortBy('location');
    const IDs = records.mapBy('id');
    const currentIndex = IDs.indexOf(this.record.id);
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = IDs.lenght - 1;
    }
    const nextRecordID = IDs[prevIndex];
    this.router.transitionTo('secure.translations.translation', nextRecordID);
  }

  get sourceLabel() {
    return 'English';
  }

  get sourceLegend() {
    return 'English is the source language of our website. That means if an English phrase is added or update, it needs to be translated into all other languages.';
  }

  get languageFull() {
    return {
      fr: 'French',
      de: 'German',
      es: 'Spanish'
    }[this.record.language];
  }

  get nativeLegend() {
    return `${this.languageFull} is one of the languages to which we translate our website to. Please translate the English phrase above to ${this.languageFull}.`;
  }

  get nativeLabel() {
    if (this.isToReview) {
      return `${this.languageFull} translation made by robot`;
    }

    if (this.isToUpdate) {
      return `${this.languageFull} translation (update me)`;
    }

    return `${this.languageFull} translation`;
  }
}
