import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class TranslationsController extends Controller {
  @service router;
  @service translation;

  @tracked language = 'de';
  @tracked statuses = 'a,b';

  get columns() {
    const language = this.translation.languages.find(
      (lang) => lang.locale === this.language
    );

    return [
      { label: language.nameEnglish, property: 'native', type: 'text' },
      { label: 'English', property: 'english', type: 'text' },
      { label: 'Status', property: 'status', type: 'text' }
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
        colouredTags: true,
        checkboxes: [
          {
            label: 'to translate',
            value: 'a',
            checked: this.statuses.split(',').includes('a'),
            tagColour: 'red'
          },
          {
            label: 'to update',
            value: 'a',
            checked: this.statuses.split(',').includes('a'),
            tagColour: 'orange'
          },
          {
            label: 'to review',
            value: 'b',
            checked: this.statuses.split(',').includes('b'),
            tagColour: 'green-1'
          },
          {
            label: 'done',
            value: 'c',
            checked: this.statuses.split(',').includes('c'),
            tagColour: 'green-3'
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
  onRecordClick(record) {
    this.router.transitionTo('secure.translations.translation', record.id);
  }

  get records() {
    return this.model.translations
      .filterBy('language', this.language)
      .sortBy('english')
      .reverse();
  }
}
