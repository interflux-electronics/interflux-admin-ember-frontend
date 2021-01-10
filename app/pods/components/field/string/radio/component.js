import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class FieldStringRadioComponent extends Component {
  // @api attribute
  // @api attribute

  @service form;
  @service api;

  id; // Unique across the app

  constructor() {
    super(...arguments);
    this.id = this.form.getUniqueId();
  }

  get value() {
    return this.args.record.get(this.args.attribute);
  }

  set value(value) {
    this.args.record.set(this.args.attribute, value);
  }

  get options() {
    return this.args.options.map((option) => {
      const selected = option.value === this.value;
      const ariaChecked = selected ? 'true' : 'false';
      const tabindex = ariaChecked ? 0 : -1;

      return { ...option, ariaChecked, tabindex };
    });
  }

  @action
  onClick(value) {
    console.debug('onClick');
    console.debug(value);
    this.value = value;
    this.save();
  }

  @action
  onKeyDown(value, event) {
    console.debug('onKeyDown');
    console.debug(value);

    // On arrow down, highlight the next record
    if ('ArrowDown' === event.key) {
      // TODO
    }

    // On arrow up, highlight the previous record
    if ('ArrowUp' === event.key) {
      // TODO
    }

    if ('Enter' === event.key) {
      this.value = value;
      this.save();
    }
  }

  @action
  async save() {
    console.debug('saving');

    // Reset errors, allow second save attempt
    this.error = null;

    this.args.record
      .save({
        adapterOptions: {
          whitelist: [this.args.attribute]
        }
      })
      .then(() => {
        console.debug('save successful');
      })
      .catch((response) => {
        console.error('save failed');

        // Show error in console
        this.api.logError(response);

        // Show error to user
        if (response.errors && response.errors[0] && response.errors[0].code) {
          const code = response.errors[0].code;
          this.error = code;
        } else {
          this.error = 'unknown';
        }
      });
  }
}
