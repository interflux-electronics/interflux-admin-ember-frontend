import FieldComponent from '../component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

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

const bulletsTemplate = `
* a
* b
* c
`;

export default class StringFieldComponent extends FieldComponent {
  constructor() {
    super(...arguments);

    const { record, attribute } = this.args;
    const value = record.get(attribute);

    if (value || value === '') {
      this.lastSavedValue = value;
    }

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

    // On enter, save the attribute, unless it's a <Form::Textarea>
    if (event.key === 'Enter' && !multiline) {
      this.save();
    }
  }

  get theme() {
    return this.args.tools ? 'has-tools' : 'no-tools';
  }

  @tracked editing = true;

  get showEditPanel() {
    return this.editing;
  }

  get showPreviewPanel() {
    return !this.editing;
  }

  @action
  onEditTabClick() {
    this.editing = true;
  }

  @action
  onPreviewTabClick() {
    this.editing = false;
  }

  @action
  onToolClick(tool) {
    if (tool === 'bullets') {
      const textarea = document.getElementById(`textarea-${this.id}`);
      if (textarea) {
        const newValue = this.value + bulletsTemplate;
        this.value = newValue;
        textarea.innerText = newValue;
        const ev = new KeyboardEvent('keyup');
        textarea.dispatchEvent(ev);
      }
    }
  }
}
