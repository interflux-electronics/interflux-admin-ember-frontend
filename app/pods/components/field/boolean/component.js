import FieldComponent from '../component';
import { action } from '@ember/object';

export default class BooleanFieldComponent extends FieldComponent {
  constructor() {
    super(...arguments);

    const { record, attribute } = this.args;
    const value = record.get(attribute);

    this.lastSavedValue = value;

    // TODO: fix false warning on showOnProductList when adding processes to products
    if (value === undefined) {
      console.warn(`${attribute} is not an attribute on the model`);
    }
  }

  get value() {
    return this.args.record.get(this.args.attribute);
  }

  set value(value) {
    this.args.record.set(this.args.attribute, value);
  }

  get disabled() {
    return this.state === 'error' || this.args.disabled;
  }

  @action
  onClick(event) {
    this.value = !this.value;
    this.save({
      adapterOptions: {
        whitelist: [this.args.attribute]
      }
    });
    if (this.args.onClick) {
      this.args.onClick(event);
    }
  }
}
