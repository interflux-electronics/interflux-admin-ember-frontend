import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TranslationController extends Controller {
  // @service api;
  @service store;
  @service router;
  @service translation;

  @tracked lastSavedNative = null;
  @tracked isTranslating = false;
  @tracked showError = false;

  @action
  onInsert() {
    this.lastSavedNative = this.record.native;
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

  get hasError() {
    return this.record.status === 'error';
  }

  get hasChanges() {
    return this.lastSavedNative !== this.record.native;
  }

  @action
  onClickEdit() {
    const native = document.querySelector('#textarea-native');
    if (native) {
      native.focus();
    }
  }

  @action
  onClickSave() {
    this.record.status = this.record.native ? 'done' : 'to-translate';
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
        const native = document.querySelector('#textarea-native');
        if (native) {
          native.blur();
        }
      });
  }

  @action
  onClickUndo() {
    this.record.native = this.lastSavedNative;
    this.lastSavedNative = this.record.native;
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
    const robotSuggestion = this.record.native;
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
        // The idea is to first delete native from the database, but then show it to the user.
        // Why? Because the robot translation is often 90% correct and human wants to do small edit.
        this.record.native = robotSuggestion;
        this.lastSavedNative = null;
        const native = document.querySelector('#textarea-native');
        if (native) {
          native.focus();
        }
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

  @action
  async onClickAutoTranslate() {
    this.isTranslating = true;
    const response = await this.translation.translate(this.record);
    if (response?.success) {
      console.debug('translation done');
      console.debug(response);
      if (response.translations.length > 0) {
        this.record.native = response.translations[0]; // use first one
        this.record.status = 'to-review';
        this.record.save();
      } else {
        console.warn('no translation received...');
        this.record.status = 'error';
        this.record.error = 'no translations received';
        this.record.save();
      }
    } else {
      console.error('translation failed');
      console.error(response);
      this.record.status = 'error';
      this.record.error = 'auto-translation failed';
      this.record.save();
    }
    this.isTranslating = false;
  }

  @action
  onClickReset() {
    this.record.status = 'to-translate';
    this.record.save();
  }
}
