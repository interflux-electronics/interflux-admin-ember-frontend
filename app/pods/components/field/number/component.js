import FieldComponent from '../component';
import { action } from '@ember/object';

// Usage:
// <Field::Number
//   @label="Rank among top level families"
//   @record={{family}}
//   @attribute='rank'
// />

export default class NumberFieldComponent extends FieldComponent {
  constructor() {
    super(...arguments);

    const { record, attribute } = this.args;
    const value = record.get(attribute);

    this.lastSavedValue = value || null;

    if (!record.isNew && value === undefined) {
      console.warn(`${attribute} is not an attribute on the model`);
    }
  }

  get value() {
    return this.args.record.get(this.args.attribute);
  }

  set value(value) {
    this.args.record.set(this.args.attribute, value);
  }

  @action
  onKeyUp(event) {
    const { multiline } = this.args;
    const element = event.target;

    // If it's an <input> we grab the value. If it's a contenteditable <p>, we grab its innerText.
    const value = Number(element.value);

    // Set the new value on the record
    this.value = value;

    // Reset errors
    this.error = null;

    // On enter, save the attribute, unless it's a <Form::Textarea>
    if (event.key === 'Enter' && !multiline) {
      this.save();
    }
  }
}
