import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class TranslationsController extends Controller {
  @service api;
  @service router;
  @service store;
  @service translation;

  @tracked language = 'de';
  @tracked statuses = 'to-translate,to-update,to-review,done,error';

  queryParams = ['language', 'statuses'];

  get columns() {
    const language = this.filters[0].options.find(
      (opt) => opt.value === this.language
    );

    if (!language) {
      return [];
    }

    return [
      {
        label: 'Status',
        property: 'status',
        tags: {
          'to-translate': { color: 'red-1', label: 'to translate' },
          'to-update': { color: 'orange-2', label: 'to update' },
          'to-review': { color: 'blue-2', label: 'to review' },
          done: { color: 'green-1', label: 'done' },
          error: { color: 'grey-7', label: 'error' },
          unknown: { label: 'uknown' }
        }
      },
      { label: language.label, property: 'native' },
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
            label: 'Chinese',
            value: 'zh',
            selected: this.language === 'zh'
          },
          {
            label: 'Dutch',
            value: 'nl',
            selected: this.language === 'nl'
          },
          {
            label: 'French',
            value: 'fr',
            selected: this.language === 'fr'
          },
          {
            label: 'German',
            value: 'de',
            selected: this.language === 'de'
          },

          {
            label: 'Spanish',
            value: 'es',
            selected: this.language === 'es'
          }
        ]
      },
      {
        type: 'checkboxes',
        property: 'statuses',
        checkboxes: [
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
            label: 'error',
            value: 'error',
            checked: this.statuses.split(',').includes('error'),
            count: {
              label: this.sortedTranslationsForLanguage
                .filterBy('status', 'error')
                .length.toString(),
              color: 'grey-7'
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
    const queryParams = {};

    if (type === 'options') {
      queryParams[filter.property] = value;
    }

    if (type === 'checkboxes') {
      const arr = this[filter.property].split(',');

      queryParams[filter.property] = arr.includes(value)
        ? arr.filter((x) => x !== value).join(',')
        : [...arr, value].join(',');
    }

    if (type === 'search') {
      //
    }

    this.router.transitionTo({ queryParams });
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

    let done = false;

    while (!done) {
      const allToTranslate = this.sortedTranslationsForLanguage.filterBy(
        'status',
        'to-translate'
      );

      // If there is nothing to translate, then stop.
      if (allToTranslate.length === 0) {
        done = true;
        continue;
      }

      // If something outside this loop whishes to interrupt it, it needs to set isTranslating to false
      // For example the "Stop auto-translating" button does.
      if (!this.isTranslating) {
        done = true;
        continue;
      }

      // Grab the first next record to translate.
      const record = allToTranslate[0];

      // In case the english sentence is an empty line break then Deepl Translator will fail.
      if (record.english === '\n') {
        console.warn('---');
        console.warn('SINGLE LINE BREAK');

        // A common place for \n issues is the product.pitch
        if (record.location.startsWith('product.2.')) {
          console.warn('fix product');
          const id = record.location.split('.')[2];
          const product = await this.store.findRecord('product', id);
          if (product?.id) {
            console.warn('product found');
            product.pitch = null;
            await product.save({
              adapterOptions: {
                whitelist: ['pitch']
              }
            });
            console.warn('product pitch wiped');
            await record.destroyRecord();
            console.warn('translation record destroyed');
            console.warn('---');
            continue;
          }

          console.warn('log error');
          record.status = 'error';
          record.error = 'Single line breaks. Product not found.';
          await record.save();
          console.warn('---');
          continue;
        }

        // If it's not a product
        console.warn('log error');
        record.status = 'error';
        record.error = 'Single line break.';
        await record.save();
        console.warn('---');

        continue;
      }

      // Start auto-translation
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
          record.status = 'error';
        }
      } else {
        console.error('translation failed');
        console.error(response);
        record.status = 'error';
      }
    }

    this.isTranslating = false;
  }

  @action
  onClickResetFilters() {
    this.statuses = 'to-translate,to-update,to-review,done,error';

    const language = this.filters[0].options.find(
      (opt) => opt.value === this.language
    );

    if (!language) {
      this.language = 'de';
    }
  }
}
