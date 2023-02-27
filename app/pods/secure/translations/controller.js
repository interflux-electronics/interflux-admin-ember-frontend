import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class TranslationsController extends Controller {
  @service api;
  @service router;
  @service translation;

  @tracked language = 'de';
  @tracked statuses = 'to-translate,to-update,to-review,done';

  get columns() {
    const language = this.translation.languages.find(
      (lang) => lang.locale === this.language
    );

    return [
      {
        label: 'Status',
        property: 'status',
        tags: {
          'to-translate': { color: 'red-1', label: 'to translate' },
          'to-update': { color: 'orange-2', label: 'to update' },
          'to-review': { color: 'blue-2', label: 'to review' },
          done: { color: 'green-1', label: 'done' },
          unknown: { label: 'uknown' }
        }
      },
      { label: language.nameEnglish, property: 'native' },
      { label: 'English', property: 'english' },
      { label: 'ID', property: 'location' }
    ];
  }

  get filters() {
    return [
      {
        type: 'options',
        property: 'language',
        options: [
          {
            label: 'German',
            value: 'de',
            selected: this.language === 'de'
          },
          {
            label: 'Spanish',
            value: 'es',
            selected: this.language === 'es'
          },
          {
            label: 'French',
            value: 'fr',
            selected: this.language === 'fr'
          }
        ]
      },
      {
        type: 'checkboxes',
        property: 'statuses',
        checkboxes: [
          {
            label: 'to translate',
            value: 'to-translate',
            checked: this.statuses.split(',').includes('to-translate'),
            count: {
              label: this.sortedTranslationsForLanguage
                .filterBy('status', 'to-translate')
                .length.toString(),
              color: 'red-1'
            }
          },
          {
            label: 'to update',
            value: 'to-update',
            checked: this.statuses.split(',').includes('to-update'),
            count: {
              label: this.sortedTranslationsForLanguage
                .filterBy('status', 'to-update')
                .length.toString(),
              color: 'orange-2'
            }
          },
          {
            label: 'to review',
            value: 'to-review',
            checked: this.statuses.split(',').includes('to-review'),
            count: {
              label: this.sortedTranslationsForLanguage
                .filterBy('status', 'to-review')
                .length.toString(),
              color: 'blue-2'
            }
          },
          {
            label: 'done',
            value: 'done',
            checked: this.statuses.split(',').includes('done'),
            count: {
              label: this.sortedTranslationsForLanguage
                .filterBy('status', 'done')
                .length.toString(),
              color: 'green-1'
            }
          }
        ]
      }
      // { type: 'search' }
    ];
  }

  @action
  onFilter(filter, option) {
    const { type } = filter;
    const { value } = option;

    if (type === 'options') {
      this[filter.property] = value;
    }

    if (type === 'checkboxes') {
      const arr = this[filter.property].split(',');

      this[filter.property] = arr.includes(value)
        ? arr.filter((x) => x !== value).join(',')
        : [...arr, value].join(',');
    }

    if (type === 'search') {
      //
    }
  }

  @action
  onClickRecord(record) {
    this.router.transitionTo('secure.translations.translation', record.id);
  }

  get sortedTranslationsForLanguage() {
    return this.model.translations
      .filterBy('language', this.language)
      .sortBy('location');
  }

  get shownTranslations() {
    return this.sortedTranslationsForLanguage.filter((t) => {
      return this.statuses.split(',').includes(t.status);
    });
  }

  get buttons() {
    return [
      {
        label: 'Stop',
        theme: 'medium grey',
        hide: !this.isTranslating
      },
      {
        label: 'Auto-translate',
        theme: 'medium grey',
        isBusy: this.isTranslating,
        busyLabel: 'Translating...'
      }
    ];
  }

  @action
  onClickButton(button) {
    console.log('button clicked');

    if (button.label === 'Auto-translate') {
      this.autoTranslate();
    }

    if (button.label === 'Stop') {
      this.isTranslating = false;
    }
  }

  @tracked isTranslating = false;

  async autoTranslate() {
    console.log('auto-translate');
    this.isTranslating = true;
    this.statuses = 'to-translate';

    let done = false;

    while (!done) {
      const allToTranslate = this.sortedTranslationsForLanguage.filterBy(
        'status',
        'to-translate'
      );
      if (allToTranslate.length > 0 && this.isTranslating) {
        const record = allToTranslate[0];
        const response = await this.translation.translate(record);
        if (response?.success) {
          console.debug('translation done');
          console.debug(record.location);
          console.debug(record.english);
          console.debug(response);
          if (response.translations.length > 0) {
            record.native = response.translations[0]; // use first one
            record.status = 'to-review';
            record.save();
          } else {
            console.warn('no translation received...');
          }
        } else {
          console.error('translation failed');
          console.error(response);
        }
      } else {
        done = true;
      }
    }

    this.isTranslating = false;
    this.statuses = 'to-review';
  }
}
