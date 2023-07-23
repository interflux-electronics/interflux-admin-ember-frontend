import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class TranslationsController extends Controller {
  @service api;
  @service router;
  @service store;
  @service translation;

  @tracked search = null;
  @tracked language = null;
  @tracked statuses = 'to-translate,to-update,to-review,done,error';

  queryParams = ['search', 'language', 'statuses'];

  get config() {
    const option = this.filters
      .find((f) => f.type === 'options')
      .options.find((o) => o.value === this.language);

    return {
      labels: [
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
        {
          label: option ? option.label : 'Native',
          property: 'native'
        },
        { label: 'English', property: 'english' },
        { label: 'ID', property: 'location' }
      ]
    };
  }

  get filters() {
    return [
      {
        type: 'search',
        value: this.search
      },
      {
        type: 'options',
        property: 'language',
        value: this.language,
        options: [
          {
            label: 'Chinese',
            value: 'zh'
          },
          {
            label: 'Dutch',
            value: 'nl'
          },
          {
            label: 'French',
            value: 'fr'
          },
          {
            label: 'German',
            value: 'de'
          },
          {
            label: 'Spanish',
            value: 'es'
          }
        ]
      },
      {
        type: 'checkboxes',
        property: 'status',
        value: this.statuses,
        queryParam: 'statuses',
        hideIf: !this.language,
        checkboxes: [
          {
            label: 'done',
            value: 'done',
            count: {
              color: 'green-1'
            }
          },
          {
            label: 'to review',
            value: 'to-review',
            count: {
              color: 'blue-2'
            }
          },
          {
            label: 'to update',
            value: 'to-update',
            count: {
              color: 'orange-2'
            }
          },
          {
            label: 'to translate',
            value: 'to-translate',
            count: {
              color: 'red-1'
            }
          },
          {
            label: 'error',
            value: 'error',
            count: {
              color: 'grey-7'
            }
          }
        ]
      }
    ];
  }

  @action
  onClickRecord(record) {
    this.router.transitionTo('secure.translations.translation', record.id);
  }

  get records() {
    return this.model.translations;
  }

  get toTranslate() {
    return this.records
      .filterBy('language', this.language)
      .filterBy('status', 'to-translate');
  }

  get buttons() {
    return [
      {
        label: 'Stop',
        theme: 'medium grey',
        hideIf: !this.isTranslating
      },
      {
        label: 'Auto-translate',
        theme: 'medium green',
        isBusy: this.isTranslating,
        busyLabel: 'Translating...',
        hideIf: this.toTranslate.length === 0
      }
    ];
  }

  @action
  onClickButton(button) {
    if (button.label === 'Auto-translate') {
      this.autoTranslate();
    }

    if (button.label === 'Stop') {
      this.isTranslating = false;
    }
  }

  @tracked isTranslating = false;

  async autoTranslate() {
    // Shrinks list to all records to those "to-translate"
    this.statuses = 'to-translate';

    // Shows loading state on button
    this.isTranslating = true;

    let done = false;

    while (!done) {
      const allToTranslate = this.toTranslate;

      console.log(allToTranslate.length);

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

      if (
        !response ||
        !response.success ||
        !response.translations ||
        !response.translations.length === 0
      ) {
        console.error('translation failed');
        console.error(response);
        record.status = 'error';
        record.error = 'translation failed';
        await record.save();
      }
      console.debug('translation done');
      console.debug(record.location);
      console.debug(record.english);
      console.debug(response);
      record.native = response.translations[0]; // use first one
      record.status = 'to-review';
      await record.save();
    }

    this.isTranslating = false;
    this.statuses = 'to-review';
  }
}
