import FieldComponent from '../component';
import { action } from '@ember/object';

// Usage:
// <Field::String
//   @label="Business name"
//   @record={{company}}
//   @attribute='businessName'
//
//   @type="email"
//   @autofocus="true"
//   @onBlur={{this.onBlur}}
//   @onFocus={{this.onFocus}}
// />

export default class StringFieldComponent extends FieldComponent {
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
    const value = multiline ? element.innerText : element.value;

    // Set the new value on the record
    this.value = value;

    // Reset errors
    this.error = null;

    // On enter, save the attribute, unless it's a <Textarea>
    if (event.key === 'Enter' && !multiline) {
      this.save();
    }
  }

  // get warning() {
  //   const rules = this.args.record.validations[this.args.attribute];
  //
  //   // Consider value as valid if no rules are found
  //   if (!rules) {
  //     return null;
  //   }
  //
  //   const fails = rules.find((rule) => {
  //     return this.valuePassesRule(this.value, rule);
  //   });
  //
  //   console.log('fails', fails);
  //
  //   return fails[0];
  // }

  // valuePassesRule(value, rule) {
  //   if (rule === 'not-blank') {
  //     return value ? true : false;
  //   }
  //
  //   if (rule === 'is-url') {
  //     return value && value.startsWith('https://');
  //   }
  // }
}
